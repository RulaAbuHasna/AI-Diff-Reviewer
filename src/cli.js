#!/usr/bin/env node

import { Command } from 'commander';
import { reviewLatestCommit } from './reviewer.js';
import { checkOllama } from './utils/ollama.js';
import { log } from './utils/logger.js';

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
    log('Starting code review...', 'start');

    const ollamaReady = await checkOllama();

    if (!ollamaReady) {
      log('Proceeding with limited functionality...', 'warning');
    } else {
      log('AI-powered review enabled!', 'success');
    }

    try {
      log('Analyzing latest commit...', 'info');
      const review = await reviewLatestCommit(options);
      log('Review completed!', 'success');
      console.log(review);
    } catch (error) {
      log(error.message, 'error');
      process.exit(1);
    }
  });

program.parse(process.argv);