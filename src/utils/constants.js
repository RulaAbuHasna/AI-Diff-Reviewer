import { ESLint } from 'eslint';

export const eslint = new ESLint({
    useEslintrc: false,
    overrideConfig: {
        extends: ['eslint:recommended'],
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        env: {
            node: true,
            es6: true,
            es2022: true
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-undef': 'error',
            'no-console': 'warn'
        }
    }
});