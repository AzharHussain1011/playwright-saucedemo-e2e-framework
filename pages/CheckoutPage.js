/**
 * CheckoutPage - Page Object for Checkout process
 */
import BasePage from './BasePage.js';

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    // Selectors - Checkout Step One
    this.firstNameInput = '#first-name';
    this.lastNameInput = '#last-name';
    this.postalCodeInput = '#postal-code';
    this.continueButton = '#continue';
    this.cancelButton = '#cancel';
    
    // Checkout Step Two / Summary
    this.paymentInformation = '.summary_info_label';
    this.itemTotal = '[data-test="subtotal-label"]';
    this.tax = '[data-test="tax-label"]';
    this.total = '[data-test="total-label"]';
    this.finishButton = '#finish';
    this.cartItems = '.cart_item';
    
    // Order completion
    this.orderConfirmation = '.complete-header';
    this.backHomeButton = '#back-to-products';
    this.checkoutContent = '.checkout_info';
  }

  /**
   * Check if checkout page is displayed
   * @returns {boolean} - True if checkout page is visible
   */
  async isCheckoutPageDisplayed() {
    return await this.isVisible(this.checkoutContent);
  }

  /**
   * Fill checkout form (Step One)
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} postalCode - Postal code
   */
  async fillCheckoutForm(firstName, lastName, postalCode) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postalCodeInput, postalCode);
  }

  /**
   * Continue to checkout step two
   */
  async continueCheckout() {
    await this.click(this.continueButton);
    await this.waitForPageLoad();
  }

  /**
   * Cancel checkout and go back
   */
  async cancelCheckout() {
    await this.click(this.cancelButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if continue button is enabled
   * @returns {boolean} - True if button is enabled
   */
  async isContinueButtonEnabled() {
    return await this.isEnabled(this.continueButton);
  }

  /**
   * Complete the order (proceed from summary to confirmation)
   */
  async completeOrder() {
    await this.click(this.finishButton);
    await this.waitForPageLoad();
  }

  /**
   * Check if finish button is enabled
   * @returns {boolean} - True if button is enabled
   */
  async isFinishButtonEnabled() {
    return await this.isEnabled(this.finishButton);
  }

  /**
   * Get item total from summary
   * @returns {string} - Item total
   */
  async getItemTotal() {
    return await this.getText(this.itemTotal);
  }

  /**
   * Get tax from summary
   * @returns {string} - Tax amount
   */
  async getTaxAmount() {
    return await this.getText(this.tax);
  }

  /**
   * Get total from summary
   * @returns {string} - Total amount
   */
  async getTotalAmount() {
    return await this.getText(this.total);
  }

  /**
   * Check if order confirmation is displayed
   * @returns {boolean} - True if confirmation is visible
   */
  async isOrderConfirmationDisplayed() {
    return await this.isVisible(this.orderConfirmation);
  }

  /**
   * Get order confirmation message
   * @returns {string} - Confirmation message text
   */
  async getConfirmationMessage() {
    return await this.getText(this.orderConfirmation);
  }

  /**
   * Click back to products button
   */
  async backToProducts() {
    await this.click(this.backHomeButton);
    await this.waitForPageLoad();
  }

  /**
   * Get all items in checkout summary
   * @returns {Array<string>} - Array of item names
   */
  async getOrderItems() {
    const items = await this.page.locator(this.cartItems).all();
    const itemNames = [];
    for (const item of items) {
      const name = await item.locator('.inventory_item_name').textContent();
      itemNames.push(name.trim());
    }
    return itemNames;
  }

  /**
   * Check if all form fields are filled
   * @returns {boolean} - True if all fields have values
   */
  async areAllFormFieldsFilled() {
    const firstName = await this.getInputValue(this.firstNameInput);
    const lastName = await this.getInputValue(this.lastNameInput);
    const postalCode = await this.getInputValue(this.postalCodeInput);
    return firstName !== '' && lastName !== '' && postalCode !== '';
  }

  /**
   * Get error message if form validation fails
   * @returns {string} - Error message
   */
  async getErrorMessage() {
    const errorSelector = '[data-test="error"]';
    if (await this.isVisible(errorSelector)) {
      return await this.getText(errorSelector);
    }
    return '';
  }
}

export default CheckoutPage;
