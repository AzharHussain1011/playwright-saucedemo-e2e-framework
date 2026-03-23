# Sauce Demo - Playwright Test Automation Framework

A production-level, scalable End-to-End test automation framework built with **Playwright Test** and **JavaScript**, following the **Page Object Model (POM)** design pattern.

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Organization](#test-organization)
- [Page Objects](#page-objects)
- [Utilities](#utilities)
- [Fixtures](#fixtures)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

## 🎯 Overview

This framework is designed to test the **Sauce Demo** e-commerce application (https://www.saucedemo.com/). It demonstrates professional test automation practices including:

- **Page Object Model (POM)** architecture
- **Modular folder structure** for maintainability
- **Reusable components** and utilities
- **Configuration management** for different environments
- **Comprehensive reporting** (HTML, JSON, JUnit)
- **Built-in retry logic** and smart waits
- **Detailed test data** management
- **Custom fixtures** for test setup

## ✨ Features

✅ **Modular Architecture** - Organized folder structure with clear separation of concerns
✅ **Page Object Model** - Reusable page objects for maintainability
✅ **No Hardcoded Values** - Environment-based configuration
✅ **Parallel Execution** - Support for running tests in parallel across multiple browsers
✅ **Multiple Reporters** - HTML, JSON, and JUnit XML reports
✅ **Screenshot on Failure** - Automatic visual debugging
✅ **Video Recording** - Record test execution
✅ **Trace Files** - Detailed trace for debugging
✅ **Custom Fixtures** - Reusable test setup components
✅ **Comprehensive Test Data** - Centralized test data management
✅ **Clean Code** - Proper async/await, best practices
✅ **Rich Assertions** - Custom assertion utilities

## 📁 Project Structure

```
Pract_Playwright_MCP/
├── pages/                      # Page Object Model classes
│   ├── BasePage.js            # Base class with common methods
│   ├── LoginPage.js           # Login page object
│   ├── InventoryPage.js       # Product inventory page object
│   ├── CartPage.js            # Shopping cart page object
│   └── CheckoutPage.js        # Checkout process page object
│
├── tests/                      # Test files
│   ├── login.spec.js          # Login test suite
│   ├── inventory.spec.js      # Inventory/product tests
│   ├── checkout.spec.js       # Checkout flow tests
│   └── e2e.spec.js            # End-to-end journey tests
│
├── fixtures/                   # Playwright fixtures
│   └── testFixtures.js        # Custom fixtures for setup/teardown
│
├── config/                     # Configuration files
│   └── config.js              # Environment and test configuration
│
├── test-data/                  # Test data and constants
│   └── testData.js            # User credentials, products, test data
│
├── utils/                      # Utility helper functions
│   ├── waitUtils.js           # Wait and timeout utilities
│   ├── dataUtils.js           # Data manipulation utilities
│   ├── assertionUtils.js      # Custom assertion helpers
│   └── loggerUtils.js         # Logging utilities
│
├── reports/                    # Generated test reports
│   ├── html/                  # HTML report
│   ├── screenshots/           # Screenshot artifacts
│   └── results.json           # JSON results
│
├── playwright.config.js        # Playwright configuration
├── package.json               # Project dependencies
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## 🚀 Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

### Setup

1. **Clone/Download the project**
```bash
cd Pract_Playwright_MCP
```

2. **Install dependencies**
```bash
npm install
```

3. **Install Playwright browsers**
```bash
npx playwright install
```

4. **Create environment file** (optional)
```bash
cp .env.example .env
# Edit .env with your settings
```

## ⚙️ Configuration

### Playwright Configuration (`playwright.config.js`)

The framework includes comprehensive configuration:

- **Multiple Browser Support** - Chromium, Firefox, WebKit
- **Custom Timeouts** - Page, action, expect timeouts
- **Retry Logic** - Automatic retry on CI
- **Screenshots** - On failure
- **Video Recording** - On failure
- **Trace Files** - On first retry
- **Multiple Reporters** - HTML, JSON, JUnit XML
- **Base URL** - Set to Sauce Demo URL

### Test Configuration (`config/config.js`)

Control test behavior via environment variables:

```javascript
// Browser
BROWSER=chromium
HEADLESS=true

// Timeouts
PAGE_TIMEOUT=30000
ACTION_TIMEOUT=10000

// Retry
MAX_RETRIES=2
RETRY_DELAY=1000

// Reporting
HTML_REPORT=true
SCREENSHOT_ON_FAILURE=true

// Environment
ENV=dev  // dev, staging, prod
```

## ▶️ Running Tests

### All Tests
```bash
npm test
```

### Run with UI Mode
```bash
npm run test:ui
```

### Debug Mode
```bash
npm run test:debug
```

### Headed Mode (see browser)
```bash
npm run test:headed
```

### Specific Browser
```bash
npm run test:chrome    # Chromium
npm run test:firefox   # Firefox
npm run test:webkit    # WebKit
```

### Serial Execution (one test at a time)
```bash
npm run test:serial
```

### Specific Test File
```bash
npx playwright test tests/login.spec.js
```

### Specific Test Suite
```bash
npx playwright test --grep "Login Functionality"
```

### Specific Test Case
```bash
npx playwright test --grep "Successful login with valid credentials"
```

### View HTML Report
```bash
npm run report
```

### Run with Tags
```bash
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

## 📋 Test Organization

### Login Tests (`tests/login.spec.js`)
- **TC-001**: Successful login with valid credentials
- **TC-002**: Failed login with invalid password
- **TC-003**: Failed login with non-existent user
- **TC-004**: Locked out user cannot login
- **TC-005**: Error message cleared on retry
- **TC-006-010**: Additional login edge cases

### Inventory Tests (`tests/inventory.spec.js`)
- **TC-101**: Display all products
- **TC-102**: Product names are correct
- **TC-103-105**: Add/remove products
- **TC-106**: Cart count accuracy
- **TC-107-108**: Product sorting (A-Z, Z-A, price)
- **TC-109-110**: Product info display
- **TC-111-116**: Cart navigation and edge cases

### Checkout Tests (`tests/checkout.spec.js`)
- **TC-201**: Complete checkout with valid data
- **TC-202-205**: Verify checkout summary
- **TC-206-208**: Form validation
- **TC-209-216**: Cart to checkout flow
- **TC-217-218**: Checkout edge cases

### End-to-End Tests (`tests/e2e.spec.js`)
- **TC-301**: Complete purchase flow
- **TC-302**: Browse without purchase
- **TC-303**: Add, modify, and checkout
- **TC-304**: Sort and purchase
- **TC-305-308**: Complex user journeys

## 🏗️ Page Objects

### BasePage Class
Base class providing common methods for all pages:

```javascript
// Navigation
await page.goto(url);
await page.reloadPage();
await page.goBack();

// Element interaction
await page.click(selector);
await page.fill(selector, text);
await page.getText(selector);
await page.hover(selector);
await page.doubleClick(selector);

// Status checks
await page.isVisible(selector);
await page.isEnabled(selector);
await page.isPresent(selector);

// Waits
await page.waitForElement(selector);
await page.waitForElementToDisappear(selector);
await page.waitForPageLoad();

// And many more...
```

### LoginPage
```javascript
await loginPage.login(username, password);
await loginPage.getErrorMessage();
await loginPage.isErrorDisplayed();
await loginPage.isLoginPageDisplayed();
await loginPage.clearLoginForm();
```

### InventoryPage
```javascript
await inventoryPage.getAllProductNames();
await inventoryPage.getProductCount();
await inventoryPage.addProductToCart(productName);
await inventoryPage.removeProductFromCart(productName);
await inventoryPage.getCartCount();
await inventoryPage.sortProducts(sortOption);
await inventoryPage.clickCartIcon();
```

### CartPage
```javascript
await cartPage.getAllCartItems();
await cartPage.getCartItemsCount();
await cartPage.getTotalPrice();
await cartPage.removeItemFromCart(itemName);
await cartPage.proceedToCheckout();
await cartPage.continueShopping();
```

### CheckoutPage
```javascript
await checkoutPage.fillCheckoutForm(firstName, lastName, postalCode);
await checkoutPage.continueCheckout();
await checkoutPage.completeOrder();
await checkoutPage.getItemTotal();
await checkoutPage.getTaxAmount();
await checkoutPage.getTotalAmount();
await checkoutPage.isOrderConfirmationDisplayed();
```

## 🛠️ Utilities

### Wait Utilities (`utils/waitUtils.js`)
```javascript
import { waitFor, waitForCondition, retryOperation } from '../utils/waitUtils.js';

await waitFor(2000);  // Wait 2 seconds
await waitForCondition(() => element.isVisible(), 5000);
await retryOperation(asyncFunction, 3, 1000);
```

### Data Utilities (`utils/dataUtils.js`)
```javascript
import { extractPrice, calculateTotal, generateRandomEmail } from '../utils/dataUtils.js';

const price = extractPrice('$29.99');  // Returns 29.99
const total = calculateTotal(['$10.00', '$20.00']);  // Returns 30.00
const email = generateRandomEmail();  // Returns 'user_abc123@test.com'
```

### Assertion Utilities (`utils/assertionUtils.js`)
```javascript
import { assertTextPresent, assertElementVisible } from '../utils/assertionUtils.js';

await assertTextPresent(locator, 'Expected Text');
await assertElementVisible(locator);
await assertURLMatches(page, 'https://example.com');
```

### Logger Utilities (`utils/loggerUtils.js`)
```javascript
import Logger from '../utils/loggerUtils.js';

const logger = new Logger('Test Name');
logger.info('Test started');
logger.warn('Retrying operation');
logger.error('Test failed', error);
logger.debug('Variable value: ', value);
```

## 🔧 Fixtures

Custom fixtures provide reusable setup/teardown:

```javascript
// Use in tests
test('test name', async ({ loginPage, inventoryPage, testData }) => {
  // loginPage, inventoryPage automatically initialized
  // testData contains users, products, checkout data
});
```

Available fixtures:
- `loginPage` - LoginPage instance
- `inventoryPage` - InventoryPage instance
- `cartPage` - CartPage instance
- `checkoutPage` - CheckoutPage instance
- `pages` - All page objects
- `testData` - Test data and constants
- `authenticatedPage` - Auto-logged-in page
- `contextData` - Browser cookies/storage
- `screenshotHelper` - Screenshot utilities

## 📊 Test Data

Test data is centralized in `test-data/testData.js`:

```javascript
// Users
const user = USERS.STANDARD_USER;  // { username: 'standard_user', password: 'secret_sauce' }

// Products
const product = PRODUCTS.BACKPACK;  // 'Sauce Labs Backpack'

// Checkout data
const checkout = CHECKOUT_DATA.VALID;  // { firstName, lastName, postalCode }

// Sort options
const sortOption = SORT_OPTIONS.LOW_TO_HIGH;  // 'lohi'
```

## 🎯 Best Practices

### 1. Use Page Objects
✅ Don't hardcode selectors in tests
❌ `await page.click('#add-to-cart');`
✅ `await inventoryPage.addProductToCart(productName);`

### 2. No Hardcoded Test Data
✅ Use centralized test data
✅ `const user = USERS.STANDARD_USER;`
❌ `await loginPage.login('standard_user', 'secret_sauce');`

### 3. Meaningful Test Names
✅ `test('TC-101: User can successfully login with valid credentials', ...)`
❌ `test('login test', ...)`

### 4. Proper Async/Await
✅ `await action();`
❌ `action();` // Missing await

### 5. Clean Assertions
✅ `expect(result).toBeTruthy();`
❌ `if (!result) throw new Error('Failed');`

### 6. Wait Smartly
✅ `await page.waitForElement(selector);`
❌ `await page.wait(5000);` // Hardcoded wait

### 7. Modular Tests
✅ Each test is independent
✅ Can run in any order
❌ Tests should not depend on each other

### 8. Meaningful Error Messages
✅ Clear assertion messages
✅ `expect(count).toBe(expected, 'Cart should contain expected items');`

### 9. Use Fixtures
✅ `test('test', async ({ loginPage, testData }) => {...})`
❌ Creating page objects in each test

### 10. DRY Principle
✅ Reuse methods in page objects
❌ Repeating code in multiple tests

## 🐛 Troubleshooting

### Tests not starting
```bash
# Install browsers
npx playwright install

# Clear cache
rm -rf node_modules
npm install
```

### Timeout errors
- Increase timeout in `playwright.config.js`
- Check network connectivity
- Verify selectors are correct

### Element not found
- Verify selector is correct
- Check if element is within iframe
- Add explicit waits

### Flaky tests
- Use intelligent waits instead of hardcoded delays
- Wait for network idle
- Avoid race conditions
- Use proper locator strategies

### Screenshots not captured
- Ensure `reports/screenshots` folder exists
- Check disk space
- Verify write permissions

## 🔄 CI/CD Integration

### GitHub Actions Example
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v2
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

### Jenkins Example
```groovy
stage('Test') {
  steps {
    sh 'npm install'
    sh 'npx playwright install'
    sh 'npm test'
  }
  post {
    always {
      junit 'reports/junit.xml'
      archiveArtifacts artifacts: 'reports/**'
    }
  }
}
```

## 📚 Additional Resources

- [Playwright Official Docs](https://playwright.dev/)
- [Playwright Test Documentation](https://playwright.dev/docs/test-intro)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)

## 📞 Support

For issues or questions:
1. Check Playwright documentation
2. Review test logs and screenshots
3. Run tests in debug mode: `npm run test:debug`
4. Check CI/CD logs if running in pipeline

## 📝 License

This project is provided as-is for testing purposes.

---

**Happy Testing! 🎉**
