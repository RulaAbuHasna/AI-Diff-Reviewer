import { execSync } from 'child_process';
import { analyzeCode } from './analyzers/code-analyzer.js';
import { generateReport } from './utils/report-generator.js';
import { analyzeDiffWithLLM } from './analyzers/llm-analyzer.js';
import { checkOllama } from './utils/ollama.js';
import { eslint } from './utils/constants.js';
import { log } from './utils/logger.js';

export async function reviewChanges(options = {}) {
  const {
    useLLM = true,
    useStaticAnalysis = true,
    reviewType = 'diff'
  } = options;

  log('Starting code review...', 'start');

  if (!useLLM && !useStaticAnalysis) {
    log('No review type selected. Please select at least one review type.', 'error');
    return;
  }

  try {
    const diff = reviewType === 'diff'
      ? getLatestCommitDiff()
      : getWorkingDirectoryChanges();


    if (!diff) {
      log('No changes to review.', 'warning');
      return;
    }

    let analysis = {};

    if (useStaticAnalysis) {
      log('Running static analysis...');
      try {
        analysis = await analyzeCode(diff, eslint);
        log('Static analysis completed successfully.', 'success');
      } catch (error) {
        log('Error during static analysis:', 'error');
      }
    } else {
      log('Static analysis disabled.', 'warning');
    }

    if (useLLM) {
      log('Running LLM analysis...');
      const ollamaReady = await checkOllama();
      if (ollamaReady) {
        try {
          const llmAnalysis = await analyzeDiffWithLLM(diff);
          analysis.llmSuggestions = llmAnalysis.suggestions;
          log('LLM analysis completed successfully.', 'success');
        } catch (error) {
          log('Error during LLM analysis:', 'error');
        }
      } else {
        log('Ollama or CodeLlama model not available. AI review disabled.', 'error');
      }
    } else {
      log('LLM analysis disabled.', 'warning');
    }

    const report = generateReport(analysis);
    log(report);

    return analysis;
  } catch (error) {
    log(`Error during code review: ${error.message}`, 'error');
    throw error;
  }
}

function getLatestCommitDiff() {
  try {
    return execSync('git diff HEAD~1 HEAD', { encoding: 'utf-8' });
  } catch (error) {
    log(`Error getting latest commit diff: ${error.message}`, 'error');
    return null;
  }
}

function getWorkingDirectoryChanges() {
  try {
    const stagedChanges = execSync('git diff --cached', { encoding: 'utf-8' });
    const unstagedChanges = execSync('git diff', { encoding: 'utf-8' });

    return stagedChanges + unstagedChanges;
  } catch (error) {
    log(`Error getting working directory changes: ${error.message}`, 'error');
    return null;
  }
}