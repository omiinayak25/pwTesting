/**
 * Logger Utility
 * Provides centralized logging with different levels and formatting
 */

enum LogLevel {
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
  PASS = 'PASS',
  FAIL = 'FAIL',
}

class Logger {
  private enableConsoleLogging = process.env.ENABLE_CONSOLE_LOGGING !== 'false';
  private logLevel = (process.env.LOG_LEVEL || 'info').toUpperCase();

  private log(level: LogLevel, message: string, details?: unknown): void {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    if (this.enableConsoleLogging) {
      if (details) {
        console.log(formattedMessage, details);
      } else {
        console.log(formattedMessage);
      }
    }
  }

  public info(message: string, details?: unknown): void {
    if (this.logLevel === 'INFO' || this.logLevel === 'DEBUG' || this.logLevel === 'ALL') {
      this.log(LogLevel.INFO, message, details);
    }
  }

  public debug(message: string, details?: unknown): void {
    if (this.logLevel === 'DEBUG' || this.logLevel === 'ALL') {
      this.log(LogLevel.DEBUG, message, details);
    }
  }

  public warn(message: string, details?: unknown): void {
    this.log(LogLevel.WARN, message, details);
  }

  public error(message: string, details?: unknown): void {
    this.log(LogLevel.ERROR, message, details);
  }

  public pass(message: string, details?: unknown): void {
    this.log(LogLevel.PASS, `✓ ${message}`, details);
  }

  public fail(message: string, details?: unknown): void {
    this.log(LogLevel.FAIL, `✗ ${message}`, details);
  }
}

export const logger = new Logger();
