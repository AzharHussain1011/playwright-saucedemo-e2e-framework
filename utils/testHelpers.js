/**
 * Test Helper Utilities - Advanced helper functions for common test scenarios
 */
import Logger from './loggerUtils.js';
import { waitFor, retryOperation } from './waitUtils.js';
import { extractPrice, calculateTotal } from './dataUtils.js';

/**
 * Login Helper - Simplifies login operations
 */
export class LoginHelper {
  constructor(loginPage, logger = null) {
    this.loginPage = loginPage;
    this.logger = logger || new Logger('LoginHelper');
  }

  /**
   * Perform login and wait for inventory page
   * @param {object} credentials - { username, password }
   * @param {object} inventoryPage - InventoryPage instance
   */
  async loginAndNavigate(credentials, inventoryPage) {
    this.logger.info(`Logging in as ${credentials.username}`);
    
    await this.loginPage.login(credentials.username, credentials.password);
    
    // Verify successful login
    if (await this.loginPage.isErrorDisplayed()) {
      const error = await this.loginPage.getErrorMessage();
      this.logger.error(`Login failed: ${error}`);
      throw new Error(`Login failed: ${error}`);
    }
    
    // Verify inventory page is displayed
    if (!(await inventoryPage.isInventoryPageDisplayed())) {
      this.logger.error('Inventory page not displayed after login');
      throw new Error('Invalid login state');
    }
    
    this.logger.info('Login successful');
    return true;
  }

  /**
   * Login with retry logic
   * @param {object} credentials - { username, password }
   * @param {object} inventoryPage - InventoryPage instance
   * @param {number} maxRetries - Maximum retry attempts
   */
  async loginWithRetry(credentials, inventoryPage, maxRetries = 3) {
    return await retryOperation(
      () => this.loginAndNavigate(credentials, inventoryPage),
      maxRetries,
      1000
    );
  }
}

/**
 * Shopping Helper - Simplifies shopping operations
 */
export class ShoppingHelper {
  constructor(inventoryPage, cartPage, logger = null) {
    this.inventoryPage = inventoryPage;
    this.cartPage = cartPage;
    this.logger = logger || new Logger('ShoppingHelper');
  }

  /**
   * Add products to cart and verify
   * @param {Array<string>} products - Product names to add
   */
  async addProductsAndVerify(products) {
    this.logger.info(`Adding ${products.length} products to cart`);
    
    for (const product of products) {
      await this.inventoryPage.addProductToCart(product);
      const isInCart = await this.inventoryPage.isProductInCart(product);
      
      if (!isInCart) {
        this.logger.error(`Failed to add ${product} to cart`);
        throw new Error(`Product not added: ${product}`);
      }
      
      this.logger.debug(`Added: ${product}`);
    }
    
    // Verify cart count
    const cartCount = await this.inventoryPage.getCartCount();
    if (cartCount !== products.length) {
      this.logger.error(`Cart count mismatch. Expected: ${products.length}, Got: ${cartCount}`);
      throw new Error('Cart count verification failed');
    }
    
    this.logger.info('All products added successfully');
    return true;
  }

  /**
   * Get order summary
   * @returns {object} - Order summary with items and total
   */
  async getOrderSummary() {
    this.logger.info('Calculating order summary');
    
    const items = await this.cartPage.getAllCartItems();
    const totalPrice = await this.cartPage.getTotalPrice();
    
    const summary = {
      items,
      itemCount: items.length,
      totalPrice,
    };
    
    this.logger.info(`Order summary: ${JSON.stringify(summary)}`);
    return summary;
  }

  /**
   * Proceed to checkout
   */
  async proceedToCheckout() {
    this.logger.info('Proceeding to checkout');
    await this.inventoryPage.clickCartIcon();
    await this.cartPage.proceedToCheckout();
    this.logger.info('Checkout initiated');
  }
}

/**
 * Checkout Helper - Simplifies checkout operations
 */
export class CheckoutHelper {
  constructor(checkoutPage, logger = null) {
    this.checkoutPage = checkoutPage;
    this.logger = logger || new Logger('CheckoutHelper');
  }

  /**
   * Complete checkout process
   * @param {object} checkoutData - { firstName, lastName, postalCode }
   */
  async completeCheckoutFlow(checkoutData) {
    this.logger.info('Starting checkout flow');
    
    // Fill form
    this.logger.debug('Filling checkout form');
    await this.checkoutPage.fillCheckoutForm(
      checkoutData.firstName,
      checkoutData.lastName,
      checkoutData.postalCode
    );
    
    // Verify form is filled
    if (!(await this.checkoutPage.areAllFormFieldsFilled())) {
      this.logger.error('Checkout form not properly filled');
      throw new Error('Form validation failed');
    }
    
    this.logger.debug('Form filled, continuing to summary');
    
    // Continue to summary
    await this.checkoutPage.continueCheckout();
    
    this.logger.debug('Review order summary');
    
    // Complete order
    if (!(await this.checkoutPage.isFinishButtonEnabled())) {
      this.logger.error('Finish button not enabled');
      throw new Error('Cannot complete order');
    }
    
    await this.checkoutPage.completeOrder();
    
    // Verify confirmation
    if (!(await this.checkoutPage.isOrderConfirmationDisplayed())) {
      this.logger.error('Order confirmation not displayed');
      throw new Error('Order completion verification failed');
    }
    
    this.logger.info('Checkout completed successfully');
    return true;
  }

  /**
   * Validate order total
   * @param {number} expectedTotal - Expected order total
   */
  async validateOrderTotal(expectedTotal) {
    this.logger.info(`Validating order total. Expected: $${expectedTotal}`);
    
    const totalText = await this.checkoutPage.getTotalAmount();
    const actualTotal = extractPrice(totalText);
    
    if (Math.abs(actualTotal - expectedTotal) > 0.01) {
      this.logger.error(`Total mismatch. Expected: $${expectedTotal}, Got: $${actualTotal}`);
      throw new Error('Order total validation failed');
    }
    
    this.logger.info(`Order total validated: $${actualTotal}`);
    return true;
  }
}

/**
 * End-to-End Flow Helper - Complete purchase journey
 */
export class E2EFlowHelper {
  constructor(pages, testData, logger = null) {
    this.loginPage = pages.loginPage;
    this.inventoryPage = pages.inventoryPage;
    this.cartPage = pages.cartPage;
    this.checkoutPage = pages.checkoutPage;
    this.testData = testData;
    this.logger = logger || new Logger('E2EFlowHelper');
    
    this.loginHelper = new LoginHelper(this.loginPage, this.logger);
    this.shoppingHelper = new ShoppingHelper(this.inventoryPage, this.cartPage, this.logger);
    this.checkoutHelper = new CheckoutHelper(this.checkoutPage, this.logger);
  }

  /**
   * Execute complete purchase flow
   * @param {object} options - { user, products, checkout }
   */
  async executePurchaseFlow(options = {}) {
    this.logger.info('Starting end-to-end purchase flow');
    
    const {
      user = this.testData.validUsers.standardUser,
      products = [this.testData.products.backpack],
      checkout = this.testData.checkoutData.valid,
    } = options;
    
    try {
      // Step 1: Login
      this.logger.info('Step 1: User Authentication');
      await this.loginHelper.loginAndNavigate(user, this.inventoryPage);
      
      // Step 2: Shopping
      this.logger.info('Step 2: Product Selection');
      await this.shoppingHelper.addProductsAndVerify(products);
      
      // Step 3: Review Cart
      this.logger.info('Step 3: Cart Review');
      const summary = await this.shoppingHelper.getOrderSummary();
      
      // Step 4: Proceed to Checkout
      this.logger.info('Step 4: Initiate Checkout');
      await this.shoppingHelper.proceedToCheckout();
      
      // Step 5: Complete Checkout
      this.logger.info('Step 5: Complete Checkout');
      await this.checkoutHelper.completeCheckoutFlow(checkout);
      
      this.logger.info('End-to-end purchase flow completed successfully');
      return summary;
    } catch (error) {
      this.logger.error('End-to-end flow failed', error);
      throw error;
    }
  }

  /**
   * Execute flow with detailed logging
   */
  async executePurchaseFlowWithLogging(options = {}) {
    const startTime = Date.now();
    this.logger.info('='.repeat(50));
    this.logger.info('E2E PURCHASE FLOW STARTED');
    this.logger.info('='.repeat(50));
    
    try {
      const result = await this.executePurchaseFlow(options);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.logger.info('='.repeat(50));
      this.logger.info(`E2E PURCHASE FLOW COMPLETED (${duration}s)`);
      this.logger.info('='.repeat(50));
      
      return result;
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      this.logger.error('='.repeat(50));
      this.logger.error(`E2E PURCHASE FLOW FAILED (${duration}s)`, error);
      this.logger.error('='.repeat(50));
      throw error;
    }
  }

  /**
   * Get execution logs
   */
  getLogs() {
    return this.logger.getLogs();
  }

  /**
   * Save logs to file
   */
  saveLogs(filename) {
    this.logger.saveLogs(filename);
  }
}

/**
 * Performance Helper - Measure and log performance metrics
 */
export class PerformanceHelper {
  constructor(page, logger = null) {
    this.page = page;
    this.logger = logger || new Logger('PerformanceHelper');
    this.metrics = {};
  }

  /**
   * Measure page load time
   */
  async measurePageLoadTime(url) {
    const startTime = Date.now();
    
    this.logger.info(`Loading page: ${url}`);
    await this.page.goto(url);
    
    const loadTime = Date.now() - startTime;
    this.metrics.pageLoadTime = loadTime;
    
    this.logger.info(`Page loaded in ${loadTime}ms`);
    return loadTime;
  }

  /**
   * Measure action time
   * @param {string} actionName - Name of action
   * @param {Function} action - Action to measure
   */
  async measureAction(actionName, action) {
    const startTime = Date.now();
    
    this.logger.debug(`Starting action: ${actionName}`);
    const result = await action();
    
    const duration = Date.now() - startTime;
    this.metrics[actionName] = duration;
    
    this.logger.debug(`Action '${actionName}' completed in ${duration}ms`);
    return result;
  }

  /**
   * Get all metrics
   */
  getMetrics() {
    this.logger.info(`Performance Metrics: ${JSON.stringify(this.metrics)}`);
    return this.metrics;
  }
}

export default {
  LoginHelper,
  ShoppingHelper,
  CheckoutHelper,
  E2EFlowHelper,
  PerformanceHelper,
};
