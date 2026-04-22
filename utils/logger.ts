/**
 * Logger Utility
 * Provides centralized logging with different levels and formatting
 * All test actions are logged through this class for debugging and reporting
 */

// Define enum for different log levels (using TypeScript enum for type safety)
enum LogLevel {
  INFO = 'INFO',      // Information message - general logging
  DEBUG = 'DEBUG',    // Debug message - detailed info for developers
  WARN = 'WARN',      // Warning message - something to pay attention to
  ERROR = 'ERROR',    // Error message - something went wrong
  PASS = 'PASS',      // Pass message - test step succeeded
  FAIL = 'FAIL',      // Fail message - test step failed
}

/**
 * Logger Class
 * Provides methods to log messages at different levels
 */
class Logger {
  // Flag to enable/disable console logging (from environment variable)
  private enableConsoleLogging = process.env.ENABLE_CONSOLE_LOGGING !== 'false';
  // Store the log level from environment (default: 'info')
  private logLevel = (process.env.LOG_LEVEL || 'info').toUpperCase();

  /**
   * Generic log method - core logging function used by all log level methods
   * @param level - The LogLevel (INFO, DEBUG, WARN, etc.)
   * @param message - The message to log
   * @param details - Optional additional details object to include
   */
  private log(level: LogLevel, message: string, details?: unknown): void {
    // Get current timestamp in ISO format for consistency
    const timestamp = new Date().toISOString();
    // Format message with timestamp and level: [ISO_TIME] [LEVEL] message
    const formattedMessage = `[${timestamp}] [${level}] ${message}`;

    // Check if console logging is enabled via environment variable
    if (this.enableConsoleLogging) {
      // If details are provided, log them along with the message
      if (details) {
        console.log(formattedMessage, details);
      } else {
        // Otherwise just log the formatted message
        console.log(formattedMessage);
      }
    }
  }

  /**
   * Log info level message (general information)
   * Used for general action logging
   * @param message - The info message
   * @param details - Optional details object
   */
  public info(message: string, details?: unknown): void {
    // Check if current log level includes INFO level
    if (this.logLevel === 'INFO' || this.logLevel === 'DEBUG' || this.logLevel === 'ALL') {
      // Call private log method with INFO level
      this.log(LogLevel.INFO, message, details);
    }
  }

  /**
   * Log debug level message (detailed debugging info)
   * Used for detailed developer debugging
   * @param message - The debug message
   * @param details - Optional details object
   */
  public debug(message: string, details?: unknown): void {
    // Check if current log level is DEBUG or ALL (most verbose)
    if (this.logLevel === 'DEBUG' || this.logLevel === 'ALL') {
      // Call private log method with DEBUG level
      this.log(LogLevel.DEBUG, message, details);
    }
  }

  /**
   * Log warning level message (something to pay attention to)
   * Used for warnings and cautions
   * @param message - The warning message
   * @param details - Optional details object
   */
  public warn(message: string, details?: unknown): void {
    // Always log warnings regardless of log level
    this.log(LogLevel.WARN, message, details);
  }

  /**
   * Log error level message (something went wrong)
   * Used for error reporting
   * @param message - The error message
   * @param details - Optional details object
   */
  public error(message: string, details?: unknown): void {
    // Always log errors regardless of log level
    this.log(LogLevel.ERROR, message, details);
  }

  /**
   * Log pass level message (test step succeeded)
   * Used to mark successful test actions
   * @param message - The success message
   * @param details - Optional details object
   */
  public pass(message: string, details?: unknown): void {
    // Format message with checkmark symbol for visual clarity
    this.log(LogLevel.PASS, `✓ ${message}`, details);
  }

  /**
   * Log fail level message (test step failed)
   * Used to mark failed test actions
   * @param message - The failure message
   * @param details - Optional details object
   */
  public fail(message: string, details?: unknown): void {
    // Format message with X symbol for visual clarity
    this.log(LogLevel.FAIL, `✗ ${message}`, details);
  }
}

// Export singleton instance of Logger (same instance used throughout project)
export const logger = new Logger();

