import ollama from 'ollama';

export async function analyzeDiffWithLLM(diff) {
    try {
        const response = await ollama.chat({
            model: 'codellama',
            messages: [{
                role: 'system',
                content: 'You are a code review assistant. Analyze the following Git diff and provide specific, actionable feedback focusing on: code quality, potential bugs, security issues, and suggested improvements. Be concise and specific.'
            }, {
                role: 'user',
                content: diff
            }]
        });

        return {
            suggestions: response.message.content.split('\n').filter(line => line.trim()),
            error: null
        };
    } catch (error) {
        return {
            suggestions: [],
            error: `LLM analysis failed: ${error.message}`
        };
    }
}