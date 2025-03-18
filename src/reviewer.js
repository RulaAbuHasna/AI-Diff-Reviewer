import simpleGit from 'simple-git';
import chalk from 'chalk';
import { ESLint } from 'eslint';
import { analyzeCode } from './analyzers/code-analyzer.js';
import { generateReport } from './utils/report-generator.js';

const git = simpleGit();

export async function reviewLatestCommit({ verbose = false }) {
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

  // Analyze the changes
  const analysis = await analyzeCode(diff, eslint);
  
  // Generate the review report
  return generateReport(analysis);
}