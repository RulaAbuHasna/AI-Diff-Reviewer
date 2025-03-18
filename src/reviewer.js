import simpleGit from 'simple-git';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { analyzeCode } from './analyzers/code-analyzer.js';
import { analyzeDiffWithLLM } from './analyzers/llm-analyzer.js';
import { generateReport } from './utils/report-generator.js';

const git = simpleGit();

export async function reviewLatestCommit({ verbose = false }) {
  try {
    // Check if we're in a git repository with commits
    const hasCommits = await git.raw(['rev-parse', 'HEAD']).catch(() => false);

    if (!hasCommits) {
      return chalk.yellow('No Git history found. Please make at least one commit before running the review.');
    }

    // Get the latest commit diff
    const diff = await git.diff(['HEAD~1', 'HEAD']);

    if (!diff) {
      return 'No changes found in the latest commit.';
    }

    if (verbose) {
      console.log(chalk.gray('📄 Analyzing diff...'));
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

    // Run both static and LLM analysis in parallel
    const [staticAnalysis, llmAnalysis] = await Promise.all([
      analyzeCode(diff, eslint),
      analyzeDiffWithLLM(diff)
    ]);

    // Merge LLM suggestions into the analysis
    if (llmAnalysis.suggestions.length > 0) {
      staticAnalysis.llmSuggestions = llmAnalysis.suggestions;
    }
    if (llmAnalysis.error) {
      staticAnalysis.llmError = llmAnalysis.error;
    }

    return generateReport(staticAnalysis);
  } catch (error) {
    return chalk.red(`Error: ${error.message}`);
  }
}