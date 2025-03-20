import chalk from 'chalk';

export function generateReport(analysis) {
  let report = chalk.cyan('\n📊 Code Review Report\n');

  // Linting Issues Section
  if (analysis.lintingIssues?.length > 0) {
    report += chalk.yellow('\n🔍 Linting Issues:') + '\n';
    report += chalk.gray('─'.repeat(50)) + '\n';

    for (const fileIssue of analysis.lintingIssues) {
      report += chalk.white(`\nFile: ${chalk.cyan(fileIssue.file)}\n`);
      for (const issue of fileIssue.issues) {
        report += chalk.gray(`Line ${issue.line}: ${issue.message}\n`);
        if (issue.fix) {
          report += chalk.green(`💡 Suggestion: ${issue.fix}\n`);
        }
      }
    }
  }

  // Suggestions Section
  if (analysis.suggestions?.length > 0) {
    report += chalk.yellow('\n💡 Suggestions:') + '\n';
    report += chalk.gray('─'.repeat(50)) + '\n';

    for (const fileSuggestion of analysis.suggestions) {
      report += chalk.white(`\nFile: ${chalk.cyan(fileSuggestion.file)}\n`);
      for (const pattern of fileSuggestion.patterns) {
        report += chalk.white(`• ${pattern}\n`);
      }
    }
  }

  // Security Concerns Section
  if (analysis.securityConcerns?.length > 0) {
    report += chalk.yellow('\n🔒 Security Concerns:') + '\n';
    report += chalk.gray('─'.repeat(50)) + '\n';

    for (const concern of analysis.securityConcerns) {
      report += chalk.white(`\n• ${concern}\n`);
    }
  }

  // AI Suggestions Section
  if (analysis.llmSuggestions?.length > 0) {
    report += chalk.yellow('\n🤖 AI-Powered Suggestions:') + '\n';
    report += chalk.gray('─'.repeat(50)) + '\n';

    for (const suggestion of analysis.llmSuggestions) {
      const cleanSuggestion = suggestion.replace(/─+/g, '').trim();
      if (cleanSuggestion) {
        report += chalk.white(`\n• ${cleanSuggestion}\n`);
      }
    }
  }

  report += chalk.cyan('\nReview completed successfully! 🎉\n');

  return report;
}