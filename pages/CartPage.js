/**
 * CartPage - Page Object for Shopping Cart
 * Handles all shopping cart interactions and checkout navigation
 */
import BasePage from './BasePage.js';

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    
    // Initialize locators using Playwright's locator API
    this.cartContainerLocator = page.locator('.cart_list');
    this.cartItemLocator = page.locator('.cart_item');
    this.cartItemNameLocator = page.locator('.inventory_item_name');
    this.checkoutButtonLocator = page.locator('#checkout');
    this.continueShoppingButtonLocator = page.locator('#continue-shopping');
    
    // String selectors for backward compatibility with BasePage methods
    this.cartContainer = '.cart_list';
    this.cartItem = '.cart_item';
    this.cartItemName = '.inventory_item_name';
    this.cartItemPrice = '.inventory_item_price';
    this.cartItemQuantity = '.cart_quantity';
    this.removeButton = 'button[data-test^="remove"]';
    this.checkoutButton = '#checkout';
    this.continueShoppingButton = '#continue-shopping';
    this.cartBadge = '.shopping_cart_badge';
    this.cartItemsCount = '.cart_item';
  }

  /**
   * Navigate to cart page
   * Loads the base URL cart endpoint and waits for cart container
   */
  async navigate() {
    await this.goto('/cart.html');
    await this.waitForElement(this.cartContainer);
  }

  /**
   * Check if cart page is displayed
   * Atomic method - only checks cart container visibility
   * @returns {boolean} - True if cart page is visible
   */
  async isCartPageDisplayed() {
    return await this.isVisible(this.cartContainer);
  }

  /**
   * Get all items in cart
   * Atomic method - retrieves all item names from cart
   * @returns {Array<string>} - Array of item names
   */
  async getAllCartItems() {
    return await this.getAllTexts(this.cartItemName);
  }

  /**
   * Get cart items count
   * Atomic method - returns number of items without calculating total
   * @returns {number} - Number of items in cart
   */
  async getCartItemsCount() {
    return await this.getElementCount(this.cartItemsCount);
  }

  /**
   * Get total price of all items in cart
   * Calculates sum of all individual item prices
   * @returns {number} - Total price as decimal number
   */
  async getTotalPrice() {
    const prices = await this.page.locator(this.cartItemPrice).allTextContents();
    let total = 0;
    for (const price of prices) {
      const cleanPrice = parseFloat(price.replace('$', ''));
      total += cleanPrice;
    }
    return parseFloat(total.toFixed(2));
  }

  /**
   * Remove specific item from cart by name
   * Searches for item in cart and clicks remove button
   * @param {string} itemName - The exact name of the item to remove
   * @throws {Error} If item is not found in cart
   */
  async removeItemFromCart(itemName) {
    const items = await this.page.locator(this.cartItem).all();
    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name.trim() === itemName) {
        await item.locator(this.removeButton).click();
        return;
      }
    }
    throw new Error(`Item "${itemName}" not found in cart`);
  }

  /**
   * Get price of specific item in cart
   * Atomic method - retrieves price for single item
   * @param {string} itemName - The name of the item
   * @returns {string} - The item price with dollar sign (e.g., "$29.99")
   */
  async getItemPrice(itemName) {
    const items = await this.page.locator(this.cartItem).all();
    for (const item of items) {
      const name = await item.locator(this.cartItemName).textContent();
      if (name.trim() === itemName) {
        return await item.locator(this.cartItemPrice).textContent();
      }
    }
    return '';
  }

  /**
   * Proceed to checkout
   * Atomically clicks checkout button and waits for page load
   */
  async proceedToCheckout() {
    await this.click(this.checkoutButton);
    await this.waitForPageLoad();
  }

  /**
   * Continue shopping
   * Returns user to inventory page without modifying cart
   * Atomic method - just navigation
   */
  async continueShopping() {
    await this.click(this.continueShoppingButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if checkout button is enabled
   * Atomic method - only checks button state
   * @returns {boolean} - True if button is enabled and clickable
   */
  async isCheckoutButtonEnabled() {
    return await this.isEnabled(this.checkoutButton);
  }

  /**
   * Check if continue shopping button is enabled
   * Atomic method - only checks button state
   * @returns {boolean} - True if button is enabled and clickable
   */
  async isContinueShoppingButtonEnabled() {
    return await this.isEnabled(this.continueShoppingButton);
  }

  /**
   * Check if cart is empty
   * Atomic method - no items present in cart
   * @returns {boolean} - True if cart contains no items
   */
  async isCartEmpty() {
    const count = await this.getCartItemsCount();
    return count === 0;
  }

  /**
   * Remove all items from cart
   * Iterates through all items and removes each one
   */
  async removeAllItemsFromCart() {
    const itemNames = await this.getAllCartItems();
    for (const itemName of itemNames) {
      await this.removeItemFromCart(itemName);
    }
  }
}

export default CartPage;
