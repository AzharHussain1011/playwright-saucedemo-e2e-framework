/**
 * Logger Utilities - Structured logging for tests
 */
import config from '../config/config.js';

class Logger {
  constructor(testName = 'Test') {
    this.testName = testName;
    this.logs = [];
  }

  /**
   * Format log message with timestamp
   * @param {string} level - Log level (INFO, WARN, ERROR, DEBUG)
   * @param {string} message - Log message
   * @returns {string} - Formatted message
   */
  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] [${this.testName}] ${message}`;
  }

  /**
   * Log info message
   * @param {string} message - Message to log
   */
  info(message) {
    if (config.logging.enabled) {
      const formatted = this.formatMessage('INFO', message);
      console.log(formatted);
      this.logs.push(formatted);
    }
  }

  /**
   * Log warning message
   * @param {string} message - Message to log
   */
  warn(message) {
    if (config.logging.enabled) {
      const formatted = this.formatMessage('WARN', message);
      console.warn(formatted);
      this.logs.push(formatted);
    }
  }

  /**
   * Log error message
   * @param {string} message - Message to log
   * @param {Error} error - Error object
   */
  error(message, error = null) {
    if (config.logging.enabled) {
      const formatted = this.formatMessage('ERROR', message);
      console.error(formatted);
      if (error) {
        console.error(error.stack);
      }
      this.logs.push(formatted);
    }
  }

  /**
   * Log debug message
   * @param {string} message - Message to log
   */
  debug(message) {
    if (config.logging.enabled && config.logging.level === 'debug') {
      const formatted = this.formatMessage('DEBUG', message);
      console.debug(formatted);
      this.logs.push(formatted);
    }
  }

  /**
   * Get all logs
   * @returns {Array<string>} - Array of log messages
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Clear logs
   */
  clearLogs() {
    this.logs = [];
  }

  /**
   * Save logs to file
   * @param {string} filename - Output filename
   */
  saveLogs(filename) {
    const fs = require('fs');
    const content = this.logs.join('\n');
    fs.writeFileSync(filename, content);
  }
}

export default Logger;
