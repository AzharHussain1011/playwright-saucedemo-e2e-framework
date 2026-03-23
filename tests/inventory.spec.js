/**
 * Inventory Tests - Test suite for product browsing and cart management
 */
import { test, expect } from '../fixtures/testFixtures.js';
import { USERS, PRODUCTS, SORT_OPTIONS, EXPECTED_PRODUCTS_COUNT } from '../test-data/testData.js';

test.describe('Inventory Page', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
    // Navigate and login before each test
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-101: Inventory page displays all products', async ({ inventoryPage }) => {
    // Arrange & Act
    const productCount = await inventoryPage.getProductCount();

    // Assert
    expect(productCount).toBe(EXPECTED_PRODUCTS_COUNT);
  });

  test('TC-102: Product names are displayed correctly', async ({ inventoryPage }) => {
    // Arrange & Act
    const productNames = await inventoryPage.getAllProductNames();

    // Assert
    expect(productNames.length).toBe(EXPECTED_PRODUCTS_COUNT);
    expect(productNames).toContain(PRODUCTS.BACKPACK);
    expect(productNames).toContain(PRODUCTS.BIKE_LIGHT);
  });

  test('TC-103: Add single product to cart', async ({ inventoryPage }) => {
    // Arrange
    const productName = PRODUCTS.BACKPACK;
    const initialCount = await inventoryPage.getCartCount();

    // Act
    await inventoryPage.addProductToCart(productName);

    // Assert
    const newCount = await inventoryPage.getCartCount();
    expect(newCount).toBe(initialCount + 1);
    expect(await inventoryPage.isProductInCart(productName)).toBeTruthy();
  });

  test('TC-104: Add multiple products to cart', async ({ inventoryPage }) => {
    // Arrange
    const productsToAdd = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];

    // Act
    await inventoryPage.addMultipleProductsToCart(productsToAdd);

    // Assert
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(productsToAdd.length);

    for (const product of productsToAdd) {
      expect(await inventoryPage.isProductInCart(product)).toBeTruthy();
    }
  });

  test('TC-105: Remove product from cart', async ({ inventoryPage }) => {
    // Arrange
    const productName = PRODUCTS.BACKPACK;
    await inventoryPage.addProductToCart(productName);
    let cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(1);

    // Act
    await inventoryPage.removeProductFromCart(productName);

    // Assert
    cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(0);
    expect(await inventoryPage.isProductInCart(productName)).toBeFalsy();
  });

  test('TC-106: Cart count reflects correct number of items', async ({ inventoryPage }) => {
    // Arrange
    const productsToAdd = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
    ];

    // Act
    for (const product of productsToAdd) {
      await inventoryPage.addProductToCart(product);
      const count = await inventoryPage.getCartCount();
      expect(count).toBe(productsToAdd.indexOf(product) + 1);
    }

    // Assert
    const finalCount = await inventoryPage.getCartCount();
    expect(finalCount).toBe(productsToAdd.length);
  });

  test('TC-107: Sort products A to Z', async ({ inventoryPage }) => {
    // Arrange & Act
    await inventoryPage.sortProducts(SORT_OPTIONS.AZ);

    // Assert
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort();
    expect(productNames).toEqual(sortedNames);
  });

  test('TC-108: Sort products Z to A', async ({ inventoryPage }) => {
    // Arrange & Act
    await inventoryPage.sortProducts(SORT_OPTIONS.ZA);

    // Assert
    const productNames = await inventoryPage.getAllProductNames();
    const sortedNames = [...productNames].sort().reverse();
    expect(productNames).toEqual(sortedNames);
  });

  test('TC-109: Product prices are displayed', async ({ inventoryPage }) => {
    // Arrange & Act
    const backpackPrice = await inventoryPage.getProductPrice(PRODUCTS.BACKPACK);

    // Assert
    expect(backpackPrice).toContain('$');
    expect(backpackPrice).toBeTruthy();
  });

  test('TC-110: Product descriptions are visible', async ({ inventoryPage }) => {
    // Arrange & Act
    const description = await inventoryPage.getProductDescription(PRODUCTS.BACKPACK);

    // Assert
    expect(description).toBeTruthy();
    expect(description.length).toBeGreaterThan(0);
  });
});

// Test suite for cart icon navigation
test.describe('Cart Navigation', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-111: Cart icon navigation', async ({ inventoryPage, cartPage }) => {
    // Arrange
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

    // Act
    await inventoryPage.clickCartIcon();

    // Assert
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();
  });

  test('TC-112: Empty cart shows zero items', async ({ inventoryPage, cartPage }) => {
    // Arrange & Act
    await inventoryPage.clickCartIcon();

    // Assert
    expect(await cartPage.isCartEmpty()).toBeTruthy();
  });

  test('TC-113: Cart displays added items', async ({ inventoryPage, cartPage }) => {
    // Arrange
    const product = PRODUCTS.BACKPACK;
    await inventoryPage.addProductToCart(product);

    // Act
    await inventoryPage.clickCartIcon();

    // Assert
    const cartItems = await cartPage.getAllCartItems();
    expect(cartItems).toContain(product);
  });
});

// Test suite for edge cases
test.describe('Inventory Edge Cases', () => {
  test.beforeEach(async ({ page, loginPage, inventoryPage }) => {
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    await inventoryPage.waitForPageLoad();
  });

  test('TC-114: Add and remove same product multiple times', async ({ inventoryPage }) => {
    // Arrange
    const product = PRODUCTS.BACKPACK;

    // Act & Assert
    for (let i = 0; i < 3; i++) {
      await inventoryPage.addProductToCart(product);
      expect(await inventoryPage.isProductInCart(product)).toBeTruthy();

      await inventoryPage.removeProductFromCart(product);
      expect(await inventoryPage.isProductInCart(product)).toBeFalsy();
    }
  });

  test('TC-115: Add all products and verify count', async ({ inventoryPage }) => {
    // Arrange
    const allProducts = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
      PRODUCTS.ONESIE,
      PRODUCTS.TEST_ALL_THINGS_TSHIRT,
    ];

    // Act
    await inventoryPage.addMultipleProductsToCart(allProducts);

    // Assert
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(allProducts.length);
  });

  test('TC-116: Remove all products one by one', async ({ inventoryPage }) => {
    // Arrange
    const productsToAdd = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];
    await inventoryPage.addMultipleProductsToCart(productsToAdd);

    // Act & Assert
    for (const product of productsToAdd) {
      await inventoryPage.removeProductFromCart(product);
      const cartCount = await inventoryPage.getCartCount();
      expect(cartCount).toBe(productsToAdd.indexOf(product));
    }
  });
});
