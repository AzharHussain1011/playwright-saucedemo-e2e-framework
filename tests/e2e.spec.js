/**
 * End-to-End Tests - Complete user journey tests
 */
import { test, expect } from '../fixtures/testFixtures.js';
import { USERS, PRODUCTS, CHECKOUT_DATA } from '../test-data/testData.js';

test.describe('Complete User Journey', () => {
  test('TC-301: Complete purchase flow - Login to Order Completion', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // === STEP 1: Navigate to application ===
    await page.goto('');
    expect(await loginPage.isLoginPageDisplayed()).toBeTruthy();

    // === STEP 2: Login with valid credentials ===
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();

    // === STEP 3: Browse and verify products ===
    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBe(6);

    // === STEP 4: Add products to cart ===
    const productsToAdd = [PRODUCTS.BACKPACK, PRODUCTS.BIKE_LIGHT, PRODUCTS.BOLT_TSHIRT];
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    expect(await inventoryPage.getCartCount()).toBe(productsToAdd.length);

    // === STEP 5: Navigate to cart ===
    await inventoryPage.clickCartIcon();
    expect(await cartPage.isCartPageDisplayed()).toBeTruthy();

    // === STEP 6: Verify cart items ===
    const cartItems = await cartPage.getAllCartItems();
    expect(cartItems.length).toBe(productsToAdd.length);

    // === STEP 7: Proceed to checkout ===
    await cartPage.proceedToCheckout();
    expect(await checkoutPage.isCheckoutPageDisplayed()).toBeTruthy();

    // === STEP 8: Fill checkout information ===
    const { firstName, lastName, postalCode } = CHECKOUT_DATA.VALID;
    await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);

    // === STEP 9: Continue to summary page ===
    await checkoutPage.continueCheckout();

    // === STEP 10: Verify order summary ===
    const summaryItems = await checkoutPage.getOrderItems();
    expect(summaryItems.length).toBe(productsToAdd.length);

    // === STEP 11: Complete order ===
    await checkoutPage.completeOrder();

    // === STEP 12: Verify order confirmation ===
    expect(await checkoutPage.isOrderConfirmationDisplayed()).toBeTruthy();
    const confirmationMessage = await checkoutPage.getConfirmationMessage();
    expect(confirmationMessage).toContain('Thank you');

    // === STEP 13: Return to products ===
    await checkoutPage.backToProducts();
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC-302: Browse products without purchase', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // === STEP 1: Login ===
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();

    // === STEP 2: View product details ===
    const productName = PRODUCTS.BACKPACK;
    const productPrice = await inventoryPage.getProductPrice(productName);
    const productDesc = await inventoryPage.getProductDescription(productName);

    // === STEP 3: Verify product information ===
    expect(productPrice).toContain('$');
    expect(productDesc).toBeTruthy();

    // === STEP 4: Verify no items in cart ===
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(0);
  });

  test('TC-303: Add to cart, modify, and checkout', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // === STEP 1-2: Login and view inventory ===
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();

    // === STEP 3: Add multiple items ===
    const productsToAdd = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
    ];
    await inventoryPage.addMultipleProductsToCart(productsToAdd);
    expect(await inventoryPage.getCartCount()).toBe(productsToAdd.length);

    // === STEP 4: Go to cart ===
    await inventoryPage.clickCartIcon();

    // === STEP 5: Remove one item ===
    await cartPage.removeItemFromCart(PRODUCTS.FLEECE_JACKET);
    expect(await cartPage.getCartItemsCount()).toBe(productsToAdd.length - 1);

    // === STEP 6: Continue shopping ===
    await cartPage.continueShopping();
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();

    // === STEP 7: Add another item ===
    await inventoryPage.addProductToCart(PRODUCTS.ONESIE);

    // === STEP 8: Go to cart again ===
    await inventoryPage.clickCartIcon();

    // === STEP 9: Verify final cart items ===
    const finalCartCount = await cartPage.getCartItemsCount();
    expect(finalCartCount).toBe(productsToAdd.length); // 3 + 1 = 4

    // === STEP 10: Complete checkout ===
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutPage.continueCheckout();
    await checkoutPage.completeOrder();

    // === STEP 11: Verify successful completion ===
    expect(await checkoutPage.isOrderConfirmationDisplayed()).toBeTruthy();
  });

  test('TC-304: Sort products and add to cart', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // === STEP 1-2: Login and prepare ===
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

    // === STEP 3: Get original product names ===
    const originalNames = await inventoryPage.getAllProductNames();

    // === STEP 4: Sort Z to A ===
    await inventoryPage.sortProducts('za');
    const sortedNames = await inventoryPage.getAllProductNames();

    // === STEP 5: Verify sorting ===
    const expectedSorted = [...originalNames].sort().reverse();
    expect(sortedNames).toEqual(expectedSorted);

    // === STEP 6: Add products and verify cart ===
    await inventoryPage.addProductToCart(sortedNames[0]);
    expect(await inventoryPage.isProductInCart(sortedNames[0])).toBeTruthy();
  });

  test('TC-305: Failed login and then successful login', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    // === STEP 1: Navigate to login ===
    await page.goto('');

    // === STEP 2: Attempt login with wrong password ===
    await loginPage.login(
      USERS.STANDARD_USER.username,
      'wrong_password'
    );
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();

    // === STEP 3: Clear form ===
    await loginPage.clearLoginForm();

    // === STEP 4: Login with correct credentials ===
    await loginPage.login(
      USERS.STANDARD_USER.username,
      USERS.STANDARD_USER.password
    );

    // === STEP 5: Verify successful login ===
    expect(await inventoryPage.isInventoryPageDisplayed()).toBeTruthy();
  });

  test('TC-306: High-volume cart and checkout', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    // === STEP 1-2: Login ===
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

    // === STEP 3: Add all available products ===
    const allProducts = [
      PRODUCTS.BACKPACK,
      PRODUCTS.BIKE_LIGHT,
      PRODUCTS.BOLT_TSHIRT,
      PRODUCTS.FLEECE_JACKET,
      PRODUCTS.ONESIE,
      PRODUCTS.TEST_ALL_THINGS_TSHIRT,
    ];

    for (const product of allProducts) {
      await inventoryPage.addProductToCart(product);
    }

    // === STEP 4: Verify cart count ===
    const cartCount = await inventoryPage.getCartCount();
    expect(cartCount).toBe(allProducts.length);

    // === STEP 5: Navigate to cart and verify ===
    await inventoryPage.clickCartIcon();
    expect(await cartPage.getCartItemsCount()).toBe(allProducts.length);

    // === STEP 6: Calculate total ===
    const totalPrice = await cartPage.getTotalPrice();
    expect(totalPrice).toBeGreaterThan(0);

    // === STEP 7: Proceed to checkout ===
    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutForm(
      CHECKOUT_DATA.VALID.firstName,
      CHECKOUT_DATA.VALID.lastName,
      CHECKOUT_DATA.VALID.postalCode
    );
    await checkoutPage.continueCheckout();

    // === STEP 8: Verify summary with all items ===
    const summaryItems = await checkoutPage.getOrderItems();
    expect(summaryItems.length).toBe(allProducts.length);

    // === STEP 9: Complete order ===
    await checkoutPage.completeOrder();
    expect(await checkoutPage.isOrderConfirmationDisplayed()).toBeTruthy();
  });

  test('TC-307: Locked user cannot login', async ({ page, loginPage }) => {
    // === STEP 1: Navigate to login ===
    await page.goto('');

    // === STEP 2: Try locked user login ===
    await loginPage.login(
      USERS.LOCKED_OUT_USER.username,
      USERS.LOCKED_OUT_USER.password
    );

    // === STEP 3: Verify error message ===
    expect(await loginPage.isErrorDisplayed()).toBeTruthy();
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('TC-308: Cart persistence across navigation', async ({
    page,
    loginPage,
    inventoryPage,
    cartPage,
  }) => {
    // === STEP 1-2: Login ===
    await page.goto('');
    await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

    // === STEP 3: Add items ===
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT);

    // === STEP 4: Go to cart ===
    await inventoryPage.clickCartIcon();
    let itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(2);

    // === STEP 5: Continue shopping ===
    await cartPage.continueShopping();

    // === STEP 6: Go back to cart ===
    await inventoryPage.clickCartIcon();

    // === STEP 7: Verify items still there ===
    itemCount = await cartPage.getCartItemsCount();
    expect(itemCount).toBe(2);
  });
});
