export async function analyzeCode(diff, eslint) {
  const analysis = {
    lintingIssues: [],
    suggestions: [],
    securityConcerns: []
  };

  // Parse the diff to get changed files and their content
  const changedFiles = parseDiff(diff);

  for (const file of changedFiles) {
    // Skip binary files and minified code
    if (shouldSkipFile(file)) continue;

    // Run ESLint
    const lintResults = await eslint.lintText(file.content, {
      filePath: file.path
    });

    // Process lint results
    for (const result of lintResults) {
      if (result.messages.length > 0) {
        const issues = result.messages.map(message => ({
          line: file.lineNumbers[message.line - 1] || message.line,
          message: message.message,
          fix: message.fix
        }));

        analysis.lintingIssues.push({
          file: file.path,
          issues
        });
      }
    }

    // Add basic pattern checks
    const patterns = checkCommonPatterns(file.content);
    if (patterns.length > 0) {
      analysis.suggestions.push({
        file: file.path,
        patterns
      });
    }
  }

  return analysis;
}

function parseDiff(diff) {
  const files = [];
  const lines = diff.split('\n');
  let currentFile = null;
  let currentContent = '';
  let currentLineNumber = 0;
  let lineNumbers = [];

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      // Save previous file if exists
      if (currentFile) {
        files.push({
          path: currentFile,
          content: currentContent,
          lineNumbers: lineNumbers
        });
        currentContent = '';
        lineNumbers = [];
      }
      // Extract file path from diff header
      currentFile = line.split(' ')[2].replace('a/', '');
    } else if (line.startsWith('@@')) {
      // Parse the line number from the diff header
      const match = line.match(/@@ -\d+,\d+ \+(\d+),\d+ @@/);
      if (match) {
        currentLineNumber = parseInt(match[1]);
      }
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      // Only include added lines (starting with +)
      currentContent += line.slice(1) + '\n';
      lineNumbers.push(currentLineNumber);
      currentLineNumber++;
    } else if (!line.startsWith('-') && !line.startsWith('+++')) {
      // For unchanged lines, just increment the line number
      currentLineNumber++;
    }
  }

  // Add the last file
  if (currentFile) {
    files.push({
      path: currentFile,
      content: currentContent,
      lineNumbers: lineNumbers
    });
  }

  return files;
}

function shouldSkipFile(file) {
  // Skip binary files, minified files, etc.
  const skipPatterns = [
    /\.min\.(js|css)$/,
    /\.(png|jpg|gif|svg|woff|ttf)$/,
    /bundle\.(js|css)$/
  ];

  return skipPatterns.some(pattern => pattern.test(file.path));
}

function checkCommonPatterns(content) {
  const patterns = [];

  // Example patterns to check
  const checks = [
    {
      pattern: /console\.(log|debug)/g,
      message: 'Consider removing console statements in production code'
    },
    {
      pattern: /TODO|FIXME/g,
      message: 'There are TODO/FIXME comments that should be addressed'
    }
  ];

  for (const check of checks) {
    if (check.pattern.test(content)) {
      patterns.push(check.message);
    }
  }

  return patterns;
}