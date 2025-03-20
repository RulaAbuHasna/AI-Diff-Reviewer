import chalk from 'chalk';

export function generateReport(analysis) {
  const report = [];

  // Add header
  report.push(chalk.cyan('\n📊 Code Review Report\n'));

  // Static Analysis Section
  if (analysis.lintingIssues?.length > 0) {
    report.push(chalk.yellow('🔍 Linting Issues:'));
    report.push(chalk.gray('─'.repeat(50)));

    analysis.lintingIssues.forEach(issue => {
      report.push(chalk.white(`\nFile: ${chalk.cyan(issue.file)}`));
      report.push(chalk.gray(`Line ${issue.line}: ${issue.message}`));
      if (issue.suggestion) {
        report.push(chalk.green(`💡 Suggestion: ${issue.suggestion}`));
      }
    });
  }

  // Suggestions Section
  if (analysis.suggestions?.length > 0) {
    report.push(chalk.yellow('\n💡 Suggestions:'));
    report.push(chalk.gray('─'.repeat(50)));

    analysis.suggestions.forEach(suggestion => {
      report.push(chalk.white(`\n• ${suggestion}`));
    });
  }

  // Security Concerns Section
  if (analysis.securityConcerns?.length > 0) {
    report.push(chalk.yellow('\n🔒 Security Concerns:'));
    report.push(chalk.gray('─'.repeat(50)));

    analysis.securityConcerns.forEach(concern => {
      report.push(chalk.white(`\n• ${concern}`));
    });
  }

  // AI Suggestions Section
  if (analysis.llmSuggestions?.length > 0) {
    report.push(chalk.yellow('\n🤖 AI-Powered Suggestions:'));
    report.push(chalk.gray('─'.repeat(50)));

    const cleanSuggestions = analysis.llmSuggestions
      .map(suggestion => suggestion.replace(/─+/g, '').trim())
      .filter(suggestion => suggestion.length > 0);

    cleanSuggestions.forEach(suggestion => {
      report.push(chalk.white(`\n• ${suggestion}`));
    });
  }
  report.push(chalk.cyan('\nReview completed successfully! 🎉\n'));

  return report.join('\n');
}