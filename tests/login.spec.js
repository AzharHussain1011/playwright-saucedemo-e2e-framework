/**
 * Login Tests - Test suite for login functionality
 */
import { test, expect } from '../fixtures/testFixtures.js';
import { USERS, INVALID_CREDENTIALS, ERROR_MESSAGES } from '../test-data/testData.js';

test.describe('Login Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto('');
  });

  test('TC-001: Successful login with valid credentials', async ({ loginPage, inventoryPage }) => {
    // Arrange
    const { username, password } = USERS.STANDARD_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC-002: Failed login with invalid password', async ({ loginPage, page }) => {
    // Arrange
    const { username, password } = INVALID_CREDENTIALS.WRONG_PASSWORD;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });

  test('TC-003: Failed login with non-existent user', async ({ loginPage, page }) => {
    // Arrange
    const { username, password } = INVALID_CREDENTIALS.NON_EXISTENT_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('TC-004: Locked out user cannot login', async ({ loginPage, page }) => {
    // Arrange
    const { username, password } = USERS.LOCKED_OUT_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('this user has been locked out');
  });

  test('TC-005: Error message cleared on retry', async ({ loginPage, page }) => {
    // Arrange
    const invalidUser = INVALID_CREDENTIALS.WRONG_PASSWORD;
    const validUser = USERS.STANDARD_USER;

    // Act - First invalid login
    await loginPage.login(invalidUser.username, invalidUser.password);
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();

    // Act - Clear and retry with valid credentials
    await loginPage.clearLoginForm();
    await loginPage.login(validUser.username, validUser.password);

    // Assert
    const errorPresent = await loginPage.isErrorDisplayed();
    expect(!errorPresent).toBeTruthy();
  });

  test('TC-006: Login button functionality', async ({ loginPage, page }) => {
    // Arrange & Act
    const isEnabled = await loginPage.isLoginButtonEnabled();

    // Assert
    expect(isEnabled).toBeTruthy();
  });

  test('TC-007: Page elements are visible on load', async ({ loginPage }) => {
    // Assert
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();
  });

  test('TC-008: Login page title is correct', async ({ loginPage, page }) => {
    // Assert
    const title = await loginPage.getPageTitle();
    expect(title).toContain('Swag Labs');
  });

  test('TC-009: Multiple failed logins', async ({ loginPage, page }) => {
    // Arrange
    const invalidUser = INVALID_CREDENTIALS.WRONG_PASSWORD;

    // Act & Assert
    for (let i = 0; i < 3; i++) {
      await loginPage.login(invalidUser.username, invalidUser.password);
      expect(await loginPage.isErrorDisplayed()).toBeTruthy();
      await loginPage.clearLoginForm();
    }
  });

  test('TC-010: Performance glitch user login', async ({ loginPage, inventoryPage }) => {
    // Note: This user might have UI issues but should still login
    const { username, password } = USERS.PERFORMANCE_GLITCH_USER;

    // Act
    await loginPage.login(username, password);

    // Assert
    // Wait a bit longer due to performance issues
    await loginPage.wait(2000);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });
});

// Test suite for login edge cases
test.describe('Login Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('TC-011: Empty username', async ({ loginPage, page }) => {
    // Arrange & Act
    await loginPage.fill('#user-name', '');
    await loginPage.fill('#password', 'secret_sauce');
    await loginPage.click('#login-button');

    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  });

  test('TC-012: Empty password', async ({ loginPage, page }) => {
    // Arrange & Act
    await loginPage.fill('#user-name', 'standard_user');
    await loginPage.fill('#password', '');
    await loginPage.click('#login-button');

    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  });

  test('TC-013: Special characters in password field', async ({ loginPage, page }) => {
    // Arrange & Act
    await loginPage.fill('#user-name', 'standard_user');
    await loginPage.fill('#password', '!@#$%^&*()');
    await loginPage.click('#login-button');

    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  });

  test('TC-014: SQL injection attempt in username', async ({ loginPage, page }) => {
    // Arrange & Act
    await loginPage.fill('#user-name', "' OR '1'='1");
    await loginPage.fill('#password', 'secret_sauce');
    await loginPage.click('#login-button');

    // Assert - Should fail and not allow login
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  });

  test('TC-015: Very long input in username field', async ({ loginPage, page }) => {
    // Arrange
    const longString = 'a'.repeat(1000);

    // Act
    await loginPage.fill('#user-name', longString);
    await loginPage.fill('#password', 'secret_sauce');
    await loginPage.click('#login-button');

    // Assert
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
  });
});
