import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import { log } from './logger.js';

const exec = promisify(execCallback);

export async function checkOllama() {
    try {
        const { stdout } = await exec('ollama list');

        if (!stdout.includes('codellama')) {
            log('CodeLlama model not found!', 'warning');
            log('To get the full AI-powered experience, run: ollama pull codellama', 'info');
            return false;
        }
        return true;
    } catch (error) {
        log('Ollama not found', 'warning');
        log('For the best review experience:', 'info');
        log('1. Install Ollama from https://ollama.ai', 'info');
        log('2. Run: ollama pull codellama', 'info');
        return false;
    }
} 