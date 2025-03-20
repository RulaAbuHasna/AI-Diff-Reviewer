#!/usr/bin/env node

import { program } from 'commander';
import { reviewChanges } from './reviewer.js';

program
  .name('diff-reviewer')
  .description('AI-powered code review assistant')
  .version('1.0.0');

program
  .command('review')
  .description('Review code changes')
  .option('-t, --type <type>', 'Review type: diff (latest commit) or working (current changes)', 'diff')
  .option('--no-llm', 'Disable AI-powered review')
  .option('--no-static-analysis', 'Disable static analysis')
  .action(async (options) => {
    try {
      await reviewChanges({
        useLLM: options.llm,
        useStaticAnalysis: options.staticAnalysis,
        reviewType: options.type
      });
    } catch (error) {
      log(`Error: ${error.message}`, 'error');
      process.exit(1);
    }
  });

program.parse();