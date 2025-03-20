# Diff Reviewer

A command-line tool that provides automated code reviews for your git diff changes using both static analysis and AI-powered feedback.

## Features

- 🔍 Automated code analysis of:
  - Latest commit changes (`--type diff`)
  - Current working directory changes (`--type working`)
- 🤖 AI-powered code review using CodeLlama via Ollama
- ✨ ESLint integration for static code analysis
- 📊 Detailed review reports including:
  - Code quality issues
  - Potential bugs
  - Security concerns
  - Best practice suggestions
- 🎨 Beautiful CLI output with color formatting

## Prerequisites

- Node.js 16 or higher
- Git installed and configured
- Ollama installed with the CodeLlama model (https://ollama.com/blog/run-code-llama-locally)

## Installation

```bash
npm install -g @rolaabuhasna/diff-reviewer
```

## Usage

Review latest commit changes:
```bash
diff-reviewer review
# or explicitly
diff-reviewer review --type diff
```

Review current working directory changes (before committing):
```bash
diff-reviewer review --type working
```

### Options

- `-t, --type <type>`: Choose what to review
  - `diff`: Review latest commit (default)
  - `working`: Review current changes in working directory
- `--no-llm`: Disable AI-powered review
- `--no-static`: Disable static code analysis

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes and commit them
4. Push to your fork
5. Create a pull request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

[Rola Abuhasna](https://github.com/RulaAbuHasna)