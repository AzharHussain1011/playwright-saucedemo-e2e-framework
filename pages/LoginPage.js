/**
 * LoginPage - Page Object for Login functionality
 * Handles all login-related interactions on Sauce Demo
 */
import BasePage from './BasePage.js';

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize locators using Playwright's locator API
    this.usernameInputLocator = page.locator('#user-name');
    this.passwordInputLocator = page.locator('#password');
    this.loginButtonLocator = page.locator('#login-button');
    this.errorMessageLocator = page.locator('[data-test="error"]');
    this.pageTitleLocator = page.locator('.login_logo');
    
    // String selectors for backward compatibility with BasePage methods
    this.usernameInput = '#user-name';
    this.passwordInput = '#password';
    this.loginButton = '#login-button';
    this.errorMessage = '[data-test="error"]';
    this.pageTitle = '.login_logo';
  }

  /**
   * Navigate to login page
   * Loads the base URL which should display the login page
   */
  async navigate() {
    await this.goto('');
    await this.waitForElement(this.usernameInput);
  }

  /**
   * Perform login with credentials
   * Fills username, password, and clicks login button
   * @param {string} username - The username to log in with
   * @param {string} password - The password to log in with
   * @throws {Error} If login fields are not visible
   */
  async login(username, password) {
    // Validate inputs
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // Fill login form
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
    
    // Submit login form
    await this.click(this.loginButton);
    
    // Wait for navigation to complete after login
    await this.waitForPageLoad();
  }

  /**
   * Get login error message text
   * Returns empty string if no error is displayed
   * @returns {string} - The error message text or empty string
   */
  async getErrorMessage() {
    if (await this.isVisible(this.errorMessage)) {
      return await this.getText(this.errorMessage);
    }
    return '';
  }

  /**
   * Check if error message is displayed
   * Atomic method - only checks visibility
   * @returns {boolean} - True if error message is visible
   */
  async isErrorDisplayed() {
    return await this.isVisible(this.errorMessage);
  }

  /**
   * Check if login page is fully displayed
   * Verifies all essential login elements are visible
   * @returns {boolean} - True if all login elements are visible
   */
  async isLoginPageDisplayed() {
    return (await this.isVisible(this.usernameInput)) && 
           (await this.isVisible(this.passwordInput)) &&
           (await this.isVisible(this.loginButton));
  }

  /**
   * Clear all login form fields
   * Atomic method - clears both username and password
   */
  async clearLoginForm() {
    await this.clear(this.usernameInput);
    await this.clear(this.passwordInput);
  }

  /**
   * Check if login button is enabled
   * Atomic method - only checks button state
   * @returns {boolean} - True if button is enabled
   */
  async isLoginButtonEnabled() {
    return await this.isEnabled(this.loginButton);
  }
}

export default LoginPage;
