import chalk from 'chalk';

export function log(message, type = 'info') {
    const styles = {
        info: {
            symbol: chalk.blue('→'),
            text: chalk.blue
        },
        start: {
            symbol: chalk.cyan('▶'),
            text: chalk.cyan
        },
        success: {
            symbol: chalk.green('✓'),
            text: chalk.green
        },
        error: {
            symbol: chalk.red('✗'),
            text: chalk.red
        },
        warning: {
            symbol: chalk.yellow('!'),
            text: chalk.yellow
        }
    };

    const style = styles[type];
    console.log(`${style.symbol} ${style.text(message)}`);
} 