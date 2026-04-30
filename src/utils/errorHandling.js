/**
 * Error Handling Utilities
 *
 * Provides consistent error handling with user feedback across the app.
 */

import { NOTIFICATION_DURATION } from '../config/constants';

// Toast context reference - set by ToastProvider
let showToastRef = null;

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

// Current log level (can be set based on __DEV__ or environment)
const currentLogLevel = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.WARN;

/**
 * Internal logging function
 * In production, this could send logs to a monitoring service
 */
function log(level, category, message, error = null) {
  if (level < currentLogLevel) return;

  const prefix = `[${category}]`;
  const timestamp = new Date().toISOString();

  switch (level) {
    case LOG_LEVELS.DEBUG:
      if (__DEV__) console.debug(`${timestamp} ${prefix}`, message);
      break;
    case LOG_LEVELS.INFO:
      if (__DEV__) console.info(`${timestamp} ${prefix}`, message);
      break;
    case LOG_LEVELS.WARN:
      console.warn(`${timestamp} ${prefix}`, message);
      break;
    case LOG_LEVELS.ERROR:
      console.error(`${timestamp} ${prefix}`, message, error || '');
      break;
  }
}

/**
 * Logger utility for consistent logging across the app
 */
export const logger = {
  debug: (category, message) => log(LOG_LEVELS.DEBUG, category, message),
  info: (category, message) => log(LOG_LEVELS.INFO, category, message),
  warn: (category, message) => log(LOG_LEVELS.WARN, category, message),
  error: (category, message, error = null) => log(LOG_LEVELS.ERROR, category, message, error),
};

/**
 * Set the toast show function reference
 * Called once during app initialization
 */
export function setToastHandler(showToastFn) {
  showToastRef = showToastFn;
}

/**
 * Show error toast to user
 * @param {string} message - Error message to display
 * @param {string} title - Optional title
 */
export function showError(message, title = 'Error') {
  if (showToastRef) {
    showToastRef({
      type: 'error',
      message,
      title,
      duration: NOTIFICATION_DURATION.TOAST_DEFAULT,
    });
  }
  // Log for debugging
  logger.error(title, message);
}

/**
 * Show success toast to user
 * @param {string} message - Success message to display
 */
export function showSuccess(message) {
  if (showToastRef) {
    showToastRef({
      type: 'success',
      message,
      duration: NOTIFICATION_DURATION.TOAST_DEFAULT,
    });
  }
}

/**
 * Show warning toast to user
 * @param {string} message - Warning message to display
 */
export function showWarning(message) {
  if (showToastRef) {
    showToastRef({
      type: 'warning',
      message,
      duration: NOTIFICATION_DURATION.TOAST_DEFAULT,
    });
  }
}

/**
 * Show info toast to user
 * @param {string} message - Info message to display
 */
export function showInfo(message) {
  if (showToastRef) {
    showToastRef({
      type: 'info',
      message,
      duration: NOTIFICATION_DURATION.TOAST_DEFAULT,
    });
  }
}

/**
 * Wrap an async operation with error handling
 * @param {Function} operation - Async function to execute
 * @param {Object} options - Options for error handling
 * @param {string} options.errorMessage - Message to show on error
 * @param {*} options.fallbackValue - Value to return on error
 * @param {Function} options.onError - Custom error handler
 * @returns {Promise<*>} Result or fallback value
 */
export async function withErrorHandling(operation, options = {}) {
  const {
    errorMessage = 'Something went wrong. Please try again.',
    fallbackValue = null,
    onError,
  } = options;

  try {
    return await operation();
  } catch (error) {
    logger.error('Operation', errorMessage, error);

    if (onError) {
      onError(error);
    } else {
      showError(errorMessage);
    }

    return fallbackValue;
  }
}

/**
 * Create a safe version of an async function with built-in error handling
 * @param {Function} fn - Async function to wrap
 * @param {Object} options - Error handling options
 * @returns {Function} Wrapped function
 */
export function safeAsync(fn, options = {}) {
  return async (...args) => {
    return withErrorHandling(() => fn(...args), options);
  };
}

// Common error messages
export const ERROR_MESSAGES = {
  SAVE_FAILED: 'Failed to save. Please try again.',
  LOAD_FAILED: 'Failed to load data. Please refresh.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  STORAGE_FULL: 'Storage is full. Please clear some space.',
  UNKNOWN: 'Something went wrong. Please try again.',
};
