/**
 * Test Fixtures - Setup and teardown for tests
 */
import { test as base, expect } from '@playwright/test';
import LoginPage from '../pages/LoginPage.js';
import InventoryPage from '../pages/InventoryPage.js';
import CartPage from '../pages/CartPage.js';
import CheckoutPage from '../pages/CheckoutPage.js';
import { USERS, CHECKOUT_DATA, PRODUCTS } from '../test-data/testData.js';

/**
 * Extend Playwright test with custom fixtures
 */
export const test = base.extend({
  /**
   * Login page fixture
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  /**
   * Inventory page fixture
   */
  inventoryPage: async ({ page }, use) => {
    const inventoryPage = new InventoryPage(page);
    await use(inventoryPage);
  },

  /**
   * Cart page fixture
   */
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await use(cartPage);
  },

  /**
   * Checkout page fixture
   */
  checkoutPage: async ({ page }, use) => {
    const checkoutPage = new CheckoutPage(page);
    await use(checkoutPage);
  },

  /**
   * Authenticated user fixture - Logs in before each test
   */
  authenticatedPage: async ({ page, loginPage }, use) => {
    await loginPage.navigate();
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    
    // Wait for inventory page to load
    await page.waitForLoadState('networkidle');
    
    // Use the authenticated page in test
    await use(page);
    
    // Logout after test
    await page.goto('/');
  },

  /**
   * Reusable flow fixture for auth/cart/checkout setup
   */
  testFlow: async ({ loginPage, inventoryPage, cartPage }, use) => {
    const testFlow = {
      loginAsStandardUser: async () => {
        await loginPage.navigate();
        await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
        await inventoryPage.waitForPageLoad();
      },

      goToCartWithProducts: async (productNames = [PRODUCTS.BACKPACK]) => {
        await loginPage.navigate();
        await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
        await inventoryPage.waitForPageLoad();

        for (const productName of productNames) {
          await inventoryPage.addProductToCart(productName);
        }

        await inventoryPage.clickCartIcon();
      },

      goToCheckoutStepOne: async (productNames = [PRODUCTS.BACKPACK]) => {
        await loginPage.navigate();
        await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
        await inventoryPage.waitForPageLoad();

        for (const productName of productNames) {
          await inventoryPage.addProductToCart(productName);
        }

        await inventoryPage.clickCartIcon();
        await cartPage.proceedToCheckout();
      },
    };

    await use(testFlow);
  },

  /**
   * All page objects fixture - Provides access to all page objects
   */
  pages: async ({ page }, use) => {
    const pages = {
      loginPage: new LoginPage(page),
      inventoryPage: new InventoryPage(page),
      cartPage: new CartPage(page),
      checkoutPage: new CheckoutPage(page),
    };
    
    await use(pages);
  },

  /**
   * Test data fixture - Common test data
   */
  testData: async ({}, use) => {
    const testData = {
      validUsers: {
        standardUser: {
          username: USERS.STANDARD_USER.username,
          password: USERS.STANDARD_USER.password,
        },
        lockedUser: {
          username: USERS.LOCKED_OUT_USER.username,
          password: USERS.LOCKED_OUT_USER.password,
        },
        problemUser: {
          username: USERS.PROBLEM_USER.username,
          password: USERS.PROBLEM_USER.password,
        },
      },
      invalidCredentials: {
        wrongPassword: {
          username: USERS.STANDARD_USER.username,
          password: 'wrong_password',
        },
        nonExistentUser: {
          username: 'non_existent_user',
          password: USERS.STANDARD_USER.password,
        },
      },
      checkoutData: {
        valid: {
          firstName: CHECKOUT_DATA.VALID.firstName,
          lastName: CHECKOUT_DATA.VALID.lastName,
          postalCode: CHECKOUT_DATA.VALID.postalCode,
        },
        alternativeValid: {
          firstName: CHECKOUT_DATA.VALID_ALTERNATIVE.firstName,
          lastName: CHECKOUT_DATA.VALID_ALTERNATIVE.lastName,
          postalCode: CHECKOUT_DATA.VALID_ALTERNATIVE.postalCode,
        },
      },
      products: {
        backpack: PRODUCTS.BACKPACK,
        bikeLight: PRODUCTS.BIKE_LIGHT,
        boltTShirt: PRODUCTS.BOLT_TSHIRT,
        fleeceJacket: PRODUCTS.FLEECE_JACKET,
        onesie: PRODUCTS.ONESIE,
        testAllTheThings: PRODUCTS.TEST_ALL_THINGS_TSHIRT,
      },
    };
    
    await use(testData);
  },

  /**
   * Browser context data fixture - For cookies/storage operations
   */
  contextData: async ({ page }, use) => {
    const contextData = {
      /**
       * Save cookies to storage
       */
      saveCookies: async (filename) => {
        const cookies = await page.context().cookies();
        require('fs').writeFileSync(`./fixtures/cookies/${filename}.json`, JSON.stringify(cookies));
      },

      /**
       * Load cookies from storage
       */
      loadCookies: async (filename) => {
        const cookies = JSON.parse(require('fs').readFileSync(`./fixtures/cookies/${filename}.json`));
        await page.context().addCookies(cookies);
      },

      /**
       * Get local storage
       */
      getLocalStorage: async () => {
        return await page.evaluate(() => JSON.stringify(localStorage));
      },

      /**
       * Clear browser data
       */
      clearBrowserData: async () => {
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());
        await page.evaluate(() => sessionStorage.clear());
      },
    };
    
    await use(contextData);
  },

  /**
   * Screenshot fixture - For easy screenshot operations
   */
  screenshotHelper: async ({ page }, use) => {
    const screenshotHelper = {
      /**
       * Take screenshot with timestamp
       */
      takeTimestampedScreenshot: async (name = 'screenshot') => {
        const timestamp = new Date().getTime();
        const filename = `./reports/screenshots/${name}_${timestamp}.png`;
        await page.screenshot({ path: filename });
        return filename;
      },

      /**
       * Take screenshot of element
       */
      takeElementScreenshot: async (selector, name) => {
        const locator = page.locator(selector);
        await locator.screenshot({ path: `./reports/screenshots/${name}.png` });
      },

      /**
       * Take full page screenshot
       */
      takeFullPageScreenshot: async (name = 'full-page') => {
        await page.screenshot({ 
          path: `./reports/screenshots/${name}.png`,
          fullPage: true 
        });
      },
    };
    
    await use(screenshotHelper);
  },
});

// Re-export expect for convenience
export { expect };
