import simpleGit from 'simple-git';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { analyzeCode } from './analyzers/code-analyzer.js';
import { analyzeDiffWithLLM } from './analyzers/llm-analyzer.js';
import { generateReport } from './utils/report-generator.js';
import { log } from './utils/logger.js';

const git = simpleGit();

export async function reviewLatestCommit(options = {}) {
  try {
    log('Starting review...', 'start');

    // Check if we're in a git repository with commits
    const hasCommits = await git.raw(['rev-parse', 'HEAD']).catch(() => false);

    if (!hasCommits) {
      return chalk.yellow('No Git history found. Please make at least one commit before running the review.');
    }

    // Get the latest commit diff
    const diff = await git.diff(['HEAD~1', 'HEAD']);
    console.log({ diff });

    if (!diff) {
      log('No changes found in the latest commit.', 'warning');
      return;
    }

    // Initialize ESLint
    const eslint = new ESLint({
      useEslintrc: false,
      overrideConfig: {
        extends: ['eslint:recommended'],
        parserOptions: {
          ecmaVersion: 2022,
          sourceType: 'module'
        }
      }
    });

    log('Running static analysis...', 'info');
    const staticAnalysisPromise = analyzeCode(diff, eslint)
      .then(result => {
        log('Static analysis completed successfully', 'success');
        return result;
      })
      .catch(error => {
        log(`Static analysis failed: ${error.message}`, 'error');
        throw error;
      });

    log('Running AI review...', 'info');
    const llmAnalysisPromise = analyzeDiffWithLLM(diff)
      .then(result => {
        log('AI review complete', 'success');
        return result;
      })
      .catch(error => {
        log(`AI review issue: ${error.message}`, 'warning');
        return { suggestions: [], error: error.message };
      });

    const [staticAnalysis, llmAnalysis] = await Promise.all([
      staticAnalysisPromise,
      llmAnalysisPromise
    ]);

    if (llmAnalysis.suggestions?.length > 0) {
      staticAnalysis.llmSuggestions = llmAnalysis.suggestions;
    }
    if (llmAnalysis.error) {
      staticAnalysis.llmError = llmAnalysis.error;
    }

    const report = generateReport(staticAnalysis);
    log('Review complete', 'success');

    return report;
  } catch (error) {
    log(`Review failed: ${error.message}`, 'error');
    return chalk.red(`Error: ${error.message}`);
  }
}