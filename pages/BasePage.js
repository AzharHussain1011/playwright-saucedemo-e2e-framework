/**
 * BasePage - Parent class for all page objects
 * Provides common methods and utilities for page interactions
 */
class BasePage {
  constructor(page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param {string} path - The path to navigate to (relative or absolute)
   */
  async goto(path = '') {
    await this.page.goto(path);
  }

  /**
   * Click on an element
   * @param {string} selector - The CSS selector or Playwright locator
   */
  async click(selector) {
    await this.page.click(selector);
  }

  /**
   * Fill input field with text
   * @param {string} selector - The CSS selector of the input field
   * @param {string} data - The text to fill in
   */
  async fill(selector, data) {
    await this.page.fill(selector, data);
  }

  /**
   * Get text from an element
   * @param {string} selector - The CSS selector
   * @returns {string} - The text content
   */
  async getText(selector) {
    return await this.page.textContent(selector);
  }

  /**
   * Get all text from elements matching selector
   * @param {string} selector - The CSS selector
   * @returns {Array<string>} - Array of text contents
   */
  async getAllTexts(selector) {
    return await this.page.locator(selector).allTextContents();
  }

  /**
   * Check if element is visible
   * @param {string} selector - The CSS selector
   * @returns {boolean} - True if element is visible
   */
  async isVisible(selector) {
    return await this.page.locator(selector).isVisible();
  }

  /**
   * Check if element exists in the DOM
   * @param {string} selector - The CSS selector
   * @returns {boolean} - True if element exists
   */
  async isPresent(selector) {
    const count = await this.page.locator(selector).count();
    return count > 0;
  }

  /**
   * Wait for an element to be visible
   * @param {string} selector - The CSS selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElement(selector, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to disappear
   * @param {string} selector - The CSS selector
   * @param {number} timeout - Timeout in milliseconds
   */
  async waitForElementToDisappear(selector, timeout = 5000) {
    await this.page.locator(selector).waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get attribute value from an element
   * @param {string} selector - The CSS selector
   * @param {string} attribute - The attribute name
   * @returns {string} - The attribute value
   */
  async getAttribute(selector, attribute) {
    return await this.page.getAttribute(selector, attribute);
  }

  /**
   * Clear input field
   * @param {string} selector - The CSS selector of the input field
   */
  async clear(selector) {
    await this.page.fill(selector, '');
  }

  /**
   * Double click on an element
   * @param {string} selector - The CSS selector
   */
  async doubleClick(selector) {
    await this.page.dblclick(selector);
  }

  /**
   * Right click on an element
   * @param {string} selector - The CSS selector
   */
  async rightClick(selector) {
    await this.page.click(selector, { button: 'right' });
  }

  /**
   * Hover over an element
   * @param {string} selector - The CSS selector
   */
  async hover(selector) {
    await this.page.hover(selector);
  }

  /**
   * Press a key
   * @param {string} key - The key to press (e.g., 'Enter', 'Tab', 'Escape')
   */
  async pressKey(key) {
    await this.page.press('body', key);
  }

  /**
   * Get count of elements matching selector
   * @param {string} selector - The CSS selector
   * @returns {number} - Count of matching elements
   */
  async getElementCount(selector) {
    return await this.page.locator(selector).count();
  }

  /**
   * Execute JavaScript on the page
   * @param {string} script - The JavaScript code to execute
   * @param {any} arg - Optional argument to pass to the script
   * @returns {any} - The result of the script execution
   */
  async evaluateScript(script, arg = null) {
    return await this.page.evaluate(({ script: s, arg: a }) => {
      // eslint-disable-next-line no-eval
      return eval(s);
    }, { script, arg });
  }

  /**
   * Wait for page load
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for DOM content loaded
   */
  async waitForDOM() {
    await this.page.waitForLoadState('domcontentloaded');
  }

  /**
   * Get the current page title
   * @returns {string} - The page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Get the current page URL
   * @returns {string} - The current URL
   */
  async getCurrentURL() {
    return this.page.url();
  }

  /**
   * Scroll to element
   * @param {string} selector - The CSS selector
   */
  async scrollToElement(selector) {
    await this.page.locator(selector).scrollIntoViewIfNeeded();
  }

  /**
   * Take screenshot
   * @param {string} fileName - The file name for the screenshot
   */
  async takeScreenshot(fileName) {
    await this.page.screenshot({ path: `./reports/screenshots/${fileName}.png` });
  }

  /**
   * Check if element is enabled
   * @param {string} selector - The CSS selector
   * @returns {boolean} - True if element is enabled
   */
  async isEnabled(selector) {
    return await this.page.locator(selector).isEnabled();
  }

  /**
   * Check if element is disabled
   * @param {string} selector - The CSS selector
   * @returns {boolean} - True if element is disabled
   */
  async isDisabled(selector) {
    return await this.page.locator(selector).isDisabled();
  }

  /**
   * Select option from dropdown by value
   * @param {string} selector - The CSS selector of the select element
   * @param {string} value - The value to select
   */
  async selectDropdownByValue(selector, value) {
    await this.page.selectOption(selector, value);
  }

  /**
   * Select option from dropdown by label
   * @param {string} selector - The CSS selector of the select element
   * @param {string} label - The label text to select
   */
  async selectDropdownByLabel(selector, label) {
    await this.page.selectOption(selector, { label });
  }

  /**
   * Get selected value from dropdown
   * @param {string} selector - The CSS selector of the select element
   * @returns {string} - The selected value
   */
  async getSelectedDropdownValue(selector) {
    const element = await this.page.locator(selector);
    return await element.inputValue();
  }

  /**
   * Type text with delay (useful for testing inputs with validation)
   * @param {string} selector - The CSS selector
   * @param {string} text - The text to type
   * @param {number} delay - Delay between characters in milliseconds
   */
  async typeText(selector, text, delay = 50) {
    await this.page.locator(selector).click();
    await this.page.locator(selector).type(text, { delay });
  }

  /**
   * Get the value of an input element
   * @param {string} selector - The CSS selector
   * @returns {string} - The input value
   */
  async getInputValue(selector) {
    return await this.page.inputValue(selector);
  }

  /**
   * Check if checkbox is checked
   * @param {string} selector - The CSS selector
   * @returns {boolean} - True if checked
   */
  async isCheckboxChecked(selector) {
    return await this.page.locator(selector).isChecked();
  }

  /**
   * Check a checkbox
   * @param {string} selector - The CSS selector
   */
  async checkCheckbox(selector) {
    await this.page.locator(selector).check();
  }

  /**
   * Uncheck a checkbox
   * @param {string} selector - The CSS selector
   */
  async uncheckCheckbox(selector) {
    await this.page.locator(selector).uncheck();
  }

  /**
   * Reload page
   */
  async reloadPage() {
    await this.page.reload();
  }

  /**
   * Go back in browser history
   */
  async goBack() {
    await this.page.goBack();
  }

  /**
   * Go forward in browser history
   */
  async goForward() {
    await this.page.goForward();
  }

  /**
   * Wait for a specific timeout
   * @param {number} ms - Milliseconds to wait
   */
  async wait(ms = 1000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default BasePage;
