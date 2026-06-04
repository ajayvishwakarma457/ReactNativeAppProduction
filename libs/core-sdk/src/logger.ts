export interface LoggerOptions {
  prefix?: string;
  enableTimestamp?: boolean;
  logLevel?: 'info' | 'warn' | 'error' | 'debug';
}

export class CoreLogger {
  private prefix: string;
  private enableTimestamp: boolean;
  private logLevel: string;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '[SDK]';
    this.enableTimestamp = options.enableTimestamp !== false;
    this.logLevel = options.logLevel || 'info';
  }

  private formatMessage(message: string): string {
    const timestamp = this.enableTimestamp ? `[${new Date().toISOString()}] ` : '';
    return `${timestamp}${this.prefix}: ${message}`;
  }

  public info(message: string, ...args: any[]): void {
    if (this.logLevel === 'debug' || this.logLevel === 'info') {
      console.log(this.formatMessage(message), ...args);
    }
  }

  public warn(message: string, ...args: any[]): void {
    if (this.logLevel !== 'error') {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  public error(message: string, ...args: any[]): void {
    console.error(this.formatMessage(message), ...args);
  }

  public debug(message: string, ...args: any[]): void {
    if (this.logLevel === 'debug') {
      console.debug(this.formatMessage(message), ...args);
    }
  }
}
