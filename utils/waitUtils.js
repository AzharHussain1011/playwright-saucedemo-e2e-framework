/**
 * Wait Utilities - Common wait operations
 */

/**
 * Wait for a specified number of milliseconds
 * @param {number} ms - Milliseconds to wait
 */
export const waitFor = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Wait for a condition to be true
 * @param {Function} condition - Function that returns a boolean
 * @param {number} timeout - Timeout in milliseconds
 * @param {number} interval - Check interval in milliseconds
 */
export const waitForCondition = async (condition, timeout = 5000, interval = 100) => {
  const endTime = Date.now() + timeout;
  while (Date.now() < endTime) {
    if (await condition()) {
      return true;
    }
    await waitFor(interval);
  }
  throw new Error(`Condition not met within ${timeout}ms`);
};

/**
 * Retry an async operation
 * @param {Function} operation - Async function to retry
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Delay between retries in milliseconds
 */
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      await waitFor(delay);
    }
  }
};

/**
 * Wait for element state
 * @param {object} locator - Playwright locator
 * @param {string} state - State to wait for ('visible', 'hidden', 'attached', 'detached')
 * @param {number} timeout - Timeout in milliseconds
 */
export const waitForElementState = async (locator, state = 'visible', timeout = 5000) => {
  await locator.waitFor({ state, timeout });
};

/**
 * Wait for network idle
 * @param {object} page - Playwright page object
 * @param {number} timeout - Timeout in milliseconds
 */
export const waitForNetworkIdle = async (page, timeout = 5000) => {
  await page.waitForLoadState('networkidle', { timeout });
};

/**
 * Wait for navigation
 * @param {object} page - Playwright page object
 * @param {Function} action - Action that triggers navigation
 * @param {number} timeout - Timeout in milliseconds
 */
export const waitForNavigation = async (page, action, timeout = 5000) => {
  await Promise.all([
    page.waitForNavigation({ timeout }),
    action(),
  ]);
};
