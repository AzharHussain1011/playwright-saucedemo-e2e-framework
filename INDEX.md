# Framework Index & Navigation Guide

## 📚 Documentation Files

### Getting Started
- **[QUICKSTART.md](QUICKSTART.md)** - 5-minute setup guide
- **[README.md](README.md)** - Complete documentation (600+ lines)
- **[FRAMEWORK_SUMMARY.md](FRAMEWORK_SUMMARY.md)** - Delivery summary

### Configuration
- **[.env.example](.env.example)** - Environment variables template

---

## 📁 Core Framework Files

### Page Objects (`pages/`)
| File | Purpose | Key Methods |
|------|---------|-------------|
| [BasePage.js](pages/BasePage.js) | Base class with 50+ common methods | click, fill, getText, waitForElement, etc. |
| [LoginPage.js](pages/LoginPage.js) | Login page object | login(), getErrorMessage(), isErrorDisplayed() |
| [InventoryPage.js](pages/InventoryPage.js) | Product inventory page | addProductToCart(), getAllProductNames(), sortProducts() |
| [CartPage.js](pages/CartPage.js) | Shopping cart page | proceedToCheckout(), getTotalPrice(), removeItemFromCart() |
| [CheckoutPage.js](pages/CheckoutPage.js) | Checkout pages | fillCheckoutForm(), completeOrder(), getOrderItems() |

### Test Suites (`tests/`)
| File | Tests | Coverage |
|------|-------|----------|
| [login.spec.js](tests/login.spec.js) | 15 tests | TC-001 to TC-015 |
| [inventory.spec.js](tests/inventory.spec.js) | 16 tests | TC-101 to TC-116 |
| [checkout.spec.js](tests/checkout.spec.js) | 18 tests | TC-201 to TC-218 |
| [e2e.spec.js](tests/e2e.spec.js) | 8 tests | TC-301 to TC-308 |

**Total: 57+ test cases**

### Utilities (`utils/`)
| File | Provides |
|------|----------|
| [waitUtils.js](utils/waitUtils.js) | waitFor(), retryOperation(), waitForCondition() |
| [dataUtils.js](utils/dataUtils.js) | extractPrice(), calculateTotal(), generateRandomEmail() |
| [assertionUtils.js](utils/assertionUtils.js) | 30+ custom assertion methods |
| [loggerUtils.js](utils/loggerUtils.js) | Logger class with info(), error(), debug() |
| [testHelpers.js](utils/testHelpers.js) | LoginHelper, ShoppingHelper, CheckoutHelper, E2EFlowHelper |

### Configuration (`config/`)
| File | Purpose |
|------|---------|
| [config.js](config/config.js) | Environment settings & configuration management |

### Test Data (`test-data/`)
| File | Contains |
|------|----------|
| [testData.js](test-data/testData.js) | Users, products, checkout data, test constants |

### Fixtures (`fixtures/`)
| File | Provides |
|------|----------|
| [testFixtures.js](fixtures/testFixtures.js) | 8 custom test fixtures |

---

## 🚀 Quick Commands

```bash
# Setup
npm install
npx playwright install

# Run Tests
npm test                    # All tests
npm run test:ui            # With UI
npm run test:debug         # Debug mode
npm run test:headed        # See browser
npm run test:chrome        # Chrome only
npm run test:serial        # One at a time

# Reports
npm run report             # View HTML report
```

---

## 📖 Test Coverage Map

### Login Testing
```
TC-001: Valid credentials ✓
TC-002-004: Invalid credentials ✓
TC-005: Error handling ✓
TC-006-015: Edge cases ✓
```

### Inventory Testing
```
TC-101-102: Product display ✓
TC-103-105: Add/remove to cart ✓
TC-106: Cart count ✓
TC-107-108: Sorting ✓
TC-109-110: Product details ✓
TC-111-116: Navigation & edge cases ✓
```

### Checkout Testing
```
TC-201: Complete flow ✓
TC-202-205: Summary & verification ✓
TC-206-208: Form validation ✓
TC-209-216: Cart to checkout ✓
TC-217-218: Edge cases ✓
```

### End-to-End Testing
```
TC-301: Complete purchase ✓
TC-302: Browse only ✓
TC-303: Modify & checkout ✓
TC-304-308: Complex journeys ✓
```

---

## 🔧 Page Object Methods Reference

### LoginPage
```javascript
await loginPage.login(username, password)
await loginPage.getErrorMessage()
await loginPage.isErrorDisplayed()
await loginPage.isLoginPageDisplayed()
await loginPage.clearLoginForm()
await loginPage.isLoginButtonEnabled()
```

### InventoryPage
```javascript
await inventoryPage.isInventoryPageDisplayed()
await inventoryPage.getAllProductNames()
await inventoryPage.getProductCount()
await inventoryPage.addProductToCart(productName)
await inventoryPage.removeProductFromCart(productName)
await inventoryPage.getCartCount()
await inventoryPage.clickCartIcon()
await inventoryPage.sortProducts(sortOption)
await inventoryPage.getProductPrice(productName)
await inventoryPage.getProductDescription(productName)
await inventoryPage.isProductInCart(productName)
await inventoryPage.addMultipleProductsToCart(productNames)
```

### CartPage
```javascript
await cartPage.isCartPageDisplayed()
await cartPage.getAllCartItems()
await cartPage.getCartItemsCount()
await cartPage.getTotalPrice()
await cartPage.removeItemFromCart(itemName)
await cartPage.proceedToCheckout()
await cartPage.continueShopping()
await cartPage.isCheckoutButtonEnabled()
await cartPage.isCartEmpty()
await cartPage.removeAllItemsFromCart()
```

### CheckoutPage
```javascript
await checkoutPage.isCheckoutPageDisplayed()
await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode)
await checkoutPage.continueCheckout()
await checkoutPage.cancelCheckout()
await checkoutPage.completeOrder()
await checkoutPage.getItemTotal()
await checkoutPage.getTaxAmount()
await checkoutPage.getTotalAmount()
await checkoutPage.isOrderConfirmationDisplayed()
await checkoutPage.getConfirmationMessage()
await checkoutPage.backToProducts()
await checkoutPage.getOrderItems()
await checkoutPage.areAllFormFieldsFilled()
await checkoutPage.getErrorMessage()
```

---

## 🛠️ Utility Functions Reference

### Wait Utilities
```javascript
import { waitFor, waitForCondition, retryOperation } from './utils/waitUtils.js';

await waitFor(2000);
await waitForCondition(() => condition, timeout)
await retryOperation(asyncFn, maxRetries, delay)
```

### Data Utilities
```javascript
import { extractPrice, calculateTotal, generateRandomEmail } from './utils/dataUtils.js';

extractPrice('$29.99')  // Returns 29.99
calculateTotal(['$10.00', '$20.00'])  // Returns 30.00
generateRandomEmail()  // Returns 'user_xxx@test.com'
```

### Assertion Utilities
```javascript
import { assertTextPresent, assertElementVisible, assertURLMatches } from './utils/assertionUtils.js';

await assertTextPresent(locator, 'text')
await assertElementVisible(locator)
await assertURLMatches(page, 'https://...')
```

### Logger
```javascript
import Logger from './utils/loggerUtils.js';

const logger = new Logger('TestName');
logger.info('message')
logger.error('error', error)
logger.debug('debug info')
```

### Test Helpers
```javascript
import { E2EFlowHelper } from './utils/testHelpers.js';

const helper = new E2EFlowHelper(pages, testData);
await helper.executePurchaseFlow({ user, products, checkout })
```

---

## 📊 Test Data Reference

### Users
```javascript
USERS.STANDARD_USER           // { username: 'standard_user', password: 'secret_sauce' }
USERS.LOCKED_OUT_USER         // { username: 'locked_out_user', password: 'secret_sauce' }
USERS.PROBLEM_USER            // { username: 'problem_user', password: 'secret_sauce' }
USERS.PERFORMANCE_GLITCH_USER // { username: 'performance_glitch_user', password: 'secret_sauce' }
```

### Products
```javascript
PRODUCTS.BACKPACK
PRODUCTS.BIKE_LIGHT
PRODUCTS.BOLT_TSHIRT
PRODUCTS.FLEECE_JACKET
PRODUCTS.ONESIE
PRODUCTS.TEST_ALL_THINGS_TSHIRT
```

### Checkout Data
```javascript
CHECKOUT_DATA.VALID              // { firstName: 'John', lastName: 'Doe', postalCode: '12345' }
CHECKOUT_DATA.VALID_ALTERNATIVE  // { firstName: 'Jane', lastName: 'Smith', postalCode: '54321' }
CHECKOUT_DATA.EMPTY              // { firstName: '', lastName: '', postalCode: '' }
CHECKOUT_DATA.MISSING_FIRSTNAME  // Missing first name
CHECKOUT_DATA.MISSING_LASTNAME   // Missing last name
CHECKOUT_DATA.MISSING_POSTAL_CODE // Missing postal code
```

### Sort Options
```javascript
SORT_OPTIONS.AZ          // 'az' (A to Z)
SORT_OPTIONS.ZA          // 'za' (Z to A)
SORT_OPTIONS.LOW_TO_HIGH // 'lohi'
SORT_OPTIONS.HIGH_TO_LOW // 'hilo'
```

---

## 🎯 Fixtures Reference

```javascript
test('test name', async ({
  loginPage,         // LoginPage instance
  inventoryPage,     // InventoryPage instance
  cartPage,          // CartPage instance
  checkoutPage,      // CheckoutPage instance
  pages,             // All page objects
  testData,          // Test data fixture
  authenticatedPage, // Auto-authenticated page
  contextData,       // Browser cookie/storage management
  screenshotHelper   // Screenshot utilities
}) => {
  // Your test code
});
```

---

## 📋 Configuration Options

### Environment Variables (.env)
```
BASE_URL=https://www.saucedemo.com/
BROWSER=chromium
HEADLESS=true
VIEWPORT_WIDTH=1920
PAGE_TIMEOUT=30000
ACTION_TIMEOUT=10000
WORKERS=
HTML_REPORT=true
SCREENSHOT_ON_FAILURE=true
LOGGING_ENABLED=true
LOG_LEVEL=info
```

### Playwright Config
- Multiple browsers (Chromium, Firefox, WebKit)
- Parallel execution
- Auto-retry logic
- Screenshots on failure
- Video recording
- Trace files
- HTML/JSON/JUnit reports

---

## 🚢 Deployment & CI/CD

### GitHub Actions
See [README.md](README.md#cicd-integration) for YAML configuration

### Jenkins
See [README.md](README.md#cicd-integration) for Groovy configuration

---

## 💡 Pro Tips

1. ✅ Always use page objects - never hardcode selectors in tests
2. ✅ Reuse test data from `test-data/testData.js`
3. ✅ Use fixtures instead of creating objects in tests
4. ✅ Use custom assertions from `utils/assertionUtils.js`
5. ✅ Use helpers for complex flows (E2EFlowHelper, etc.)
6. ✅ Enable logging for debugging
7. ✅ Run tests in debug mode when stuck: `npm run test:debug`
8. ✅ View HTML reports: `npm run report`
9. ✅ Use intelligent waits, not hardcoded delays
10. ✅ Keep tests independent - they can run in any order

---

## 📞 Support Resources

- **Playwright Docs**: https://playwright.dev/
- **Best Practices**: https://playwright.dev/docs/best-practices
- **Locators**: https://playwright.dev/docs/locators
- **Assertions**: https://playwright.dev/docs/test-assertions

---

## 🎉 Quick Start

```bash
# 1. Install
npm install
npx playwright install

# 2. Run Tests
npm test

# 3. View Report
npm run report

# 4. Debug
npm run test:debug
```

---

**Framework Complete & Ready to Use! 🚀**

For detailed documentation, see [README.md](README.md) or [QUICKSTART.md](QUICKSTART.md)
