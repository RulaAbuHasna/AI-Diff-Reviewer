#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { reviewLatestCommit } from './reviewer.js';

const program = new Command();

program
  .name('diff-reviewer')
  .description('CLI tool for automated PR reviews')
  .version('1.0.0');

program
  .command('review')
  .description('Review the latest commit')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (options) => {
    try {
      console.log(chalk.blue('🔍 Analyzing latest commit...'));
      const review = await reviewLatestCommit(options);
      console.log(chalk.green('\n✅ Review completed!\n'));
      console.log(review);
    } catch (error) {
      console.error(chalk.red('❌ Error:'), error.message);
      process.exit(1);
    }
  });

program.parse(process.argv);