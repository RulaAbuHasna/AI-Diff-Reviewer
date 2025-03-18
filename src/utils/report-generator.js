import chalk from 'chalk';

export function generateReport(analysis) {
  let report = '# PR Review Report\n\n';

  if (analysis.lintingIssues.length === 0 &&
    analysis.suggestions.length === 0 &&
    analysis.securityConcerns.length === 0 &&
    !analysis.llmSuggestions) {
    return report + '✨ No issues found! Code looks good.\n';
  }

  // Linting Issues
  if (analysis.lintingIssues.length > 0) {
    report += '## Linting Issues\n\n';
    for (const file of analysis.lintingIssues) {
      report += `### ${file.path}\n\n`;
      for (const issue of file.issues) {
        report += `- 🔍 Line ${issue.line}: ${issue.message}\n`;
        if (issue.fix) {
          report += `  - 💡 Suggestion: ${issue.fix}\n`;
        }
      }
      report += '\n';
    }
  }

  // Suggestions
  if (analysis.suggestions.length > 0) {
    report += '## Suggestions\n\n';
    for (const file of analysis.suggestions) {
      report += `### ${file.path}\n\n`;
      for (const pattern of file.patterns) {
        report += `- 💡 ${pattern}\n`;
      }
      report += '\n';
    }
  }

  // LLM Analysis
  if (analysis.llmSuggestions?.length > 0) {
    report += '## AI-Powered Suggestions\n\n';
    for (const suggestion of analysis.llmSuggestions) {
      report += `- 🤖 ${suggestion}\n`;
    }
    report += '\n';
  }

  if (analysis.llmError) {
    report += `## ⚠️ AI Analysis Error\n\n${analysis.llmError}\n\n`;
  }

  // Security Concerns
  if (analysis.securityConcerns.length > 0) {
    report += '## Security Concerns\n\n';
    for (const concern of analysis.securityConcerns) {
      report += `- ⚠️ ${concern}\n`;
    }
    report += '\n';
  }

  return report;
}