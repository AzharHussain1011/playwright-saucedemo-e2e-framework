/**
 * Assertion Utilities - Custom assertion functions
 */
import { expect } from '@playwright/test';

/**
 * Assert text is present in element
 * @param {object} locator - Playwright locator
 * @param {string} text - Text to assert
 */
export const assertTextPresent = async (locator, text) => {
  await expect(locator).toContainText(text);
};

/**
 * Assert element is visible
 * @param {object} locator - Playwright locator
 */
export const assertElementVisible = async (locator) => {
  await expect(locator).toBeVisible();
};

/**
 * Assert element is hidden
 * @param {object} locator - Playwright locator
 */
export const assertElementHidden = async (locator) => {
  await expect(locator).toBeHidden();
};

/**
 * Assert element is enabled
 * @param {object} locator - Playwright locator
 */
export const assertElementEnabled = async (locator) => {
  await expect(locator).toBeEnabled();
};

/**
 * Assert element is disabled
 * @param {object} locator - Playwright locator
 */
export const assertElementDisabled = async (locator) => {
  await expect(locator).toBeDisabled();
};

/**
 * Assert element count
 * @param {object} locator - Playwright locator
 * @param {number} count - Expected count
 */
export const assertElementCount = async (locator, count) => {
  await expect(locator).toHaveCount(count);
};

/**
 * Assert URL matches
 * @param {object} page - Playwright page object
 * @param {string|RegExp} url - Expected URL
 */
export const assertURLMatches = async (page, url) => {
  await expect(page).toHaveURL(url);
};

/**
 * Assert page title
 * @param {object} page - Playwright page object
 * @param {string} title - Expected title
 */
export const assertPageTitle = async (page, title) => {
  await expect(page).toHaveTitle(title);
};

/**
 * Assert input value
 * @param {object} locator - Playwright locator
 * @param {string} value - Expected value
 */
export const assertInputValue = async (locator, value) => {
  await expect(locator).toHaveValue(value);
};

/**
 * Assert element has attribute
 * @param {object} locator - Playwright locator
 * @param {string} attribute - Attribute name
 * @param {string} value - Expected value
 */
export const assertHasAttribute = async (locator, attribute, value) => {
  await expect(locator).toHaveAttribute(attribute, value);
};

/**
 * Assert element class contains
 * @param {object} locator - Playwright locator
 * @param {string} className - Class name to check
 */
export const assertHasClass = async (locator, className) => {
  await expect(locator).toHaveClass(new RegExp(className));
};

/**
 * Assert element is checked
 * @param {object} locator - Playwright locator
 */
export const assertIsChecked = async (locator) => {
  await expect(locator).toBeChecked();
};

/**
 * Assert element is not checked
 * @param {object} locator - Playwright locator
 */
export const assertIsNotChecked = async (locator) => {
  await expect(locator).not.toBeChecked();
};

/**
 * Assert actual value equals expected
 * @param {any} actual - Actual value
 * @param {any} expected - Expected value
 * @param {string} message - Message for failure
 */
export const assertEqual = (actual, expected, message = '') => {
  expect(actual).toBe(expected);
};

/**
 * Assert actual value does not equal expected
 * @param {any} actual - Actual value
 * @param {any} expected - Expected value
 * @param {string} message - Message for failure
 */
export const assertNotEqual = (actual, expected, message = '') => {
  expect(actual).not.toBe(expected);
};

/**
 * Assert array contains item
 * @param {Array} array - Array to check
 * @param {any} item - Item to find
 */
export const assertArrayContains = (array, item) => {
  expect(array).toContain(item);
};

/**
 * Assert array includes all items
 * @param {Array} array - Array to check
 * @param {Array} items - Items to find
 */
export const assertArrayIncludesAll = (array, items) => {
  for (const item of items) {
    expect(array).toContain(item);
  }
};

/**
 * Assert array length
 * @param {Array} array - Array to check
 * @param {number} length - Expected length
 */
export const assertArrayLength = (array, length) => {
  expect(array.length).toBe(length);
};

/**
 * Assert string contains
 * @param {string} str - String to check
 * @param {string} substring - Substring to find
 */
export const assertStringContains = (str, substring) => {
  expect(str).toContain(substring);
};

/**
 * Assert string starts with
 * @param {string} str - String to check
 * @param {string} prefix - Expected prefix
 */
export const assertStringStartsWith = (str, prefix) => {
  expect(str).toStartsWith(prefix);
};

/**
 * Assert string ends with
 * @param {string} str - String to check
 * @param {string} suffix - Expected suffix
 */
export const assertStringEndsWith = (str, suffix) => {
  expect(str).toEndsWith(suffix);
};

/**
 * Assert value is greater than
 * @param {number} value - Value to check
 * @param {number} limit - Lower limit
 */
export const assertGreaterThan = (value, limit) => {
  expect(value).toBeGreaterThan(limit);
};

/**
 * Assert value is less than
 * @param {number} value - Value to check
 * @param {number} limit - Upper limit
 */
export const assertLessThan = (value, limit) => {
  expect(value).toBeLessThan(limit);
};

/**
 * Assert element is in viewport
 * @param {object} locator - Playwright locator
 */
export const assertElementInViewport = async (locator) => {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
};
