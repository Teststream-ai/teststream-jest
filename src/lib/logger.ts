import chalk from 'chalk';

class Logger {
  private prefix: string;

  constructor() {
    this.prefix = '[TESTSTREAM]';
  }

  public info(message: string): void {
    console.log(chalk.blue(`${this.prefix} ${message}`));
  }

  public error(message: string): void {
    console.error(chalk.red(`${this.prefix} ${message}`));
  }
}

export default Logger;
