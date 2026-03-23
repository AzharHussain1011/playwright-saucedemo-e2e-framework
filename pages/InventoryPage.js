/**
 * InventoryPage - Page Object for Product Inventory
 * Handles all product browsing and cart management interactions
 */
import BasePage from './BasePage.js';

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize locators using Playwright's locator API
    this.inventoryContainerLocator = page.locator('.inventory_container');
    this.productItemLocator = page.locator('.inventory_item');
    this.productNameLocator = page.locator('.inventory_item_name');
    this.cartIconLocator = page.locator('.shopping_cart_link');
    this.sortDropdownLocator = page.locator('[data-test="product_sort_container"], .product_sort_container');
    
    // String selectors for backward compatibility with BasePage methods
    this.inventoryContainer = '.inventory_container';
    this.productItem = '.inventory_item';
    this.productName = '.inventory_item_name';
    this.productPrice = '.inventory_item_price';
    this.productDescription = '.inventory_item_desc';
    this.addToCartButton = 'button[data-test^="add-to-cart"]';
    this.removeButton = 'button[data-test^="remove"]';
    this.cartBadge = '.shopping_cart_badge';
    this.cartIcon = '.shopping_cart_link';
    this.appLogo = '.app_logo';
    this.sortDropdown = '[data-test="product_sort_container"], .product_sort_container';
    this.footerLink = 'a';
    this.burgerMenu = '#react-burger-menu-btn';
  }

  /**
   * Navigate to inventory page
   * Loads the base URL and waits for inventory container to be visible
   * Useful for testing after login or after navigation
   */
  async navigate() {
    await this.goto('');
    await this.waitForElement(this.inventoryContainer);
  }

  /**
   * Check if inventory page is displayed
   * @returns {boolean} - True if inventory page is visible
   */
  async isInventoryPageDisplayed() {
    return await this.isVisible(this.inventoryContainer);
  }

  /**
   * Get all product names
   * @returns {Array<string>} - Array of product names
   */
  async getAllProductNames() {
    return await this.getAllTexts(this.productName);
  }

  /**
   * Get product count
   * @returns {number} - Number of products displayed
   */
  async getProductCount() {
    return await this.getElementCount(this.productItem);
  }

  /**
   * Add product to cart by name
   * @param {string} productName - The name of the product to add
   */
  async addProductToCart(productName) {
    const products = await this.page.locator(this.productItem).all();
    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name.trim() === productName) {
        await product.locator(this.addToCartButton).click();
        return;
      }
    }
    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Remove product from cart by name
   * @param {string} productName - The name of the product to remove
   */
  async removeProductFromCart(productName) {
    const products = await this.page.locator(this.productItem).all();
    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name.trim() === productName) {
        await product.locator(this.removeButton).click();
        return;
      }
    }
    throw new Error(`Product "${productName}" not found`);
  }

  /**
   * Get cart count
   * @returns {number} - Number of items in cart
   */
  async getCartCount() {
    if (await this.isVisible(this.cartBadge)) {
      const count = await this.getText(this.cartBadge);
      return parseInt(count);
    }
    return 0;
  }

  /**
   * Click on cart icon
   */
  async clickCartIcon() {
    await this.click(this.cartIcon);
    await this.waitForPageLoad();
  }

  /**
   * Get product price by name
   * @param {string} productName - The name of the product
   * @returns {string} - The product price
   */
  async getProductPrice(productName) {
    const products = await this.page.locator(this.productItem).all();
    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name.trim() === productName) {
        return await product.locator(this.productPrice).textContent();
      }
    }
    return '';
  }

  /**
   * Get product description by name
   * @param {string} productName - The name of the product
   * @returns {string} - The product description
   */
  async getProductDescription(productName) {
    const products = await this.page.locator(this.productItem).all();
    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name.trim() === productName) {
        return await product.locator(this.productDescription).textContent();
      }
    }
    return '';
  }

  /**
   * Sort products by option
   * @param {string} sortOption - The sort option (e.g., 'az', 'za', 'lohi', 'hilo')
   */
  async sortProducts(sortOption) {
    await this.waitForElement(this.sortDropdown, 10000);
    await this.selectDropdownByValue(this.sortDropdown, sortOption);
    await this.page.locator(this.productItem).first().waitFor({ state: 'visible' });
  }

  /**
   * Check if product is in cart (button text changes)
   * @param {string} productName - The name of the product
   * @returns {boolean} - True if product is in cart
   */
  async isProductInCart(productName) {
    const products = await this.page.locator(this.productItem).all();
    for (const product of products) {
      const name = await product.locator(this.productName).textContent();
      if (name.trim() === productName) {
        const button = await product.locator(this.removeButton);
        return button.isVisible();
      }
    }
    return false;
  }

  /**
   * Add multiple products to cart
   * @param {Array<string>} productNames - Array of product names
   */
  async addMultipleProductsToCart(productNames) {
    for (const productName of productNames) {
      await this.addProductToCart(productName);
    }
  }

  /**
   * Open burger menu
   */
  async openBurgerMenu() {
    await this.click(this.burgerMenu);
    await this.page.locator('#react-burger-cross-btn').waitFor({ state: 'visible' });
  }
}

export default InventoryPage;
