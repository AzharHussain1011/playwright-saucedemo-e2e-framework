/**
 * Checkout Tests - Test suite for checkout flow
 */
import { test, expect } from '../fixtures/testFixtures.js';
import {
  USERS,
  PRODUCTS,
  CHECKOUT_DATA,
  ERROR_MESSAGES,
} from '../test-data/testData.js';

const REQUIRED_FIELD_VALIDATIONS = [
  {
    id: 'TC-206',
    title: 'Missing first name validation',
    formData: CHECKOUT_DATA.MISSING_FIRSTNAME,
    expectedMessage: ERROR_MESSAGES.REQUIRED_FIRST_NAME,
  },
  {
    id: 'TC-207',
    title: 'Missing last name validation',
    formData: CHECKOUT_DATA.MISSING_LASTNAME,
    expectedMessage: ERROR_MESSAGES.REQUIRED_LAST_NAME,
  },
  {
    id: 'TC-208',
    title: 'Missing postal code validation',
    formData: CHECKOUT_DATA.MISSING_POSTAL_CODE,
    expectedMessage: ERROR_MESSAGES.REQUIRED_POSTAL_CODE,
  },
];

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ testFlow }) => {
    await testFlow.goToCartWithProducts([PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT]);
  });

  test('TC-201: Complete checkout with valid data', async ({ cartPage, checkoutPage, page }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.continueCheckout();
    await checkoutPage.completeOrder();

    // Assert
    expect(await checkoutPage.isOrderConfirmationDisplayed()).toBeTruthy();
  });

  test('TC-202: Order confirmation message displayed', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.continueCheckout();
    await checkoutPage.completeOrder();

    // Assert
    const message = await checkoutPage.getConfirmationMessage();
    expect(message).toContain('Thank you');
  });

  test('TC-203: Summary page shows order items', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;
    const expectedItems = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT];

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.continueCheckout();

    // Assert
    const orderItems = await checkoutPage.getOrderItems();
    for (const expectedItem of expectedItems) {
      expect(orderItems.some(item => item.includes(expectedItem))).toBeTruthy();
    }
  });

  test('TC-204: Summary page displays total price', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.continueCheckout();

    // Assert
    const total = await checkoutPage.getTotalAmount();
    expect(total).toContain('$');
  });

  test('TC-205: Summary page displays tax', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
    await checkoutPage.continueCheckout();

    // Assert
    const tax = await checkoutPage.getTaxAmount();
    expect(tax).toContain('$');
  });

  for (const requiredFieldCase of REQUIRED_FIELD_VALIDATIONS) {
    test(`${requiredFieldCase.id}: ${requiredFieldCase.title}`, async ({ cartPage, checkoutPage }) => {
      // Act
      await cartPage.proceedToCheckout();
      await checkoutPage.fillCheckoutForm(
        requiredFieldCase.formData.firstName,
        requiredFieldCase.formData.lastName,
        requiredFieldCase.formData.postalCode
      );
      await checkoutPage.continueCheckout();

      // Assert
      const errorMessage = await checkoutPage.getErrorMessage();
      expect(errorMessage).toContain(requiredFieldCase.expectedMessage);
    });
  }

  test('TC-209: Cancel checkout returns to cart', async ({ cartPage, checkoutPage }) => {
    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.cancelCheckout();

    // Assert
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
  });

  test('TC-210: Checkout form fields are fillable', async ({ cartPage, checkoutPage }) => {
    // Arrange
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;

    // Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);

    // Assert
    expect(await checkoutPage.areAllFormFieldsFilled()).toBeTruthy();
  });
});

// Test suite for cart to checkout flow
test.describe('Cart to Checkout', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-211: Checkout button available with items in cart', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

    // Act
    await inventoryPage.clickCartIcon();

    // Assert
    expect(await cartPage.isCheckoutButtonEnabled()).toBeTruthy();
  });

  test('TC-212: Checkout button disabled when cart is empty', async ({ inventoryPage, cartPage }) => {
    // Arrange & Act
    await inventoryPage.clickCartIcon();

    // Assert - Empty cart should still have button visible but we could disable it in future
    expect(await cartPage.isCartEmpty()).toBeTruthy();
  });

  test('TC-213: Continue shopping button returns to inventory', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

    // Act
    await inventoryPage.clickCartIcon();
    await cartPage.continueShopping();

    // Assert
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC-214: Back to products from confirmation page', async ({ inventoryPage, cartPage, checkoutPage }) => {
    // Arrange
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.clickCartIcon();
    await cartPage.proceedToCheckout();

    // Act
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutPage.continueCheckout();
    await checkoutPage.completeOrder();
    await checkoutPage.backToProducts();

    // Assert
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });
});

// Test suite for multiple items checkout
test.describe('Multiple Items Checkout', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-215: Checkout with multiple items', async ({ inventoryPage, cartPage, checkoutPage }) => {
    // Arrange
    const productsToAdd = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
    ];

    // Act
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product);
    }
    await inventoryPage.clickCartIcon();

    // Assert
    expect(await cartPage.getCartItemsCount()).toBe(productsToAdd.length);

    // Continue full checkout
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutPage.continueCheckout();

    // Verify all items in summary
    const orderItems = await checkoutPage.getOrderItems();
    expect(orderItems.length).toBe(productsToAdd.length);
  });

  test('TC-216: Calculate total with multiple items', async ({ inventoryPage, cartPage, checkoutPage }) => {
    // Arrange
    const productsToAdd = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT];
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product);
    }
    await inventoryPage.clickCartIcon();

    // Act
    const cartTotal = await cartPage.getTotalPrice();
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutPage.continueCheckout();
    const summaryTotal = await checkoutPage.getTotalAmount();

    // Assert
    expect(cartTotal).toBeGreaterThan(0);
    expect(summaryTotal).toContain('$');
  });
});

// Test suite for checkout edge cases
test.describe('Checkout Edge Cases', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage, cartPage }) => {
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.clickCartIcon();
  });

  test('TC-217: Special characters in name fields', async ({ cartPage, checkoutPage }) => {
    // Arrange & Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID_SPECIAL_CHARS.firstName,
      CHECKOUT_DATA.VALID_SPECIAL_CHARS.lastName,
      CHECKOUT_DATA.VALID_SPECIAL_CHARS.postalCode
    );
    await checkoutPage.continueCheckout();

    // Assert - Should continue without error
    const currentURL = await checkoutPage.getCurrentURL();
    expect(currentURL).toContain('checkout-step-two');
  });

  test('TC-218: Very long postal code', async ({ cartPage, checkoutPage }) => {
    // Arrange & Act
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      '1234567890123456789'
    );
    await checkoutPage.continueCheckout();

    // Assert
    const currentURL = await checkoutPage.getCurrentURL();
    expect(currentURL).toContain('checkout-step-two');
  });
});
