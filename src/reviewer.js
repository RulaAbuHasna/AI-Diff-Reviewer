import simpleGit from 'simple-git';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { analyzeCode } from './analyzers/code-analyzer.js';
import { generateReport } from './utils/report-generator.js';

const git = simpleGit();

export async function reviewLatestCommit({ verbose = false }) {
  try {
    const hasCommits = await git.raw(['rev-parse', 'HEAD']).catch(() => false);

    if (!hasCommits) {
      return chalk.yellow('No Git history found. Please make at least one commit before running the review.');
    }

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

    // Analyze the changes
    const analysis = await analyzeCode(diff, eslint);

    // Generate the review report
    return generateReport(analysis);
  } catch (error) {
    return chalk.red(`Error: ${error.message}`);
  }
}