# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
npx playwright install
```

### 2. Run Your First Test
```bash
npm test
```

### 3. View Test Report
```bash
npm run report
```

---

## 📝 Example: Writing Your First Test

### Using Page Objects (Recommended)
```javascript
import { test, expect } from '../fixtures/testFixtures.js';
import { USERS, PRODUCTS } from '../test-data/testData.js';

test('Add product to cart', async ({ loginPage, inventoryPage }) => {
  // Navigate and login
  await loginPage.goto('');
  await loginPage.login(USERS.STANDARD_USER.username, USERS.STANDARD_USER.password);

  // Add product
  await inventoryPage.addProductToCart(PRODUCTS.BACKPACK);

  // Assert
  expect(await inventoryPage.getCartCount()).toBe(1);
});
```

### Using Helper Classes
```javascript
import { test } from '../fixtures/testFixtures.js';
import { E2EFlowHelper } from '../utils/testHelpers.js';

test('Complete purchase', async ({ pages, testData }) => {
  const helper = new E2EFlowHelper(pages, testData);
  
  const summary = await helper.executePurchaseFlow({
    user: testData.validUsers.standardUser,
    products: [testData.products.backpack, testData.products.bikeLight],
    checkout: testData.checkoutData.valid,
  });

  console.log('Order Summary:', summary);
});
```

---

## 🎯 Test Naming Convention

Follow this pattern for test IDs and names:

```
TC-XXX: Descriptive test name
```

**Examples:**
- `TC-001: User can login with valid credentials`
- `TC-102: Product can be added to cart`
- `TC-201: Complete checkout with valid information`

---

## 📊 Important Files

| File | Purpose |
|------|---------|
| `playwright.config.js` | Test configuration |
| `config/config.js` | Environment settings |
| `test-data/testData.js` | Test data and constants |
| `pages/BasePage.js` | Common page methods |
| `utils/testHelpers.js` | Test flow helpers |
| `fixtures/testFixtures.js` | Custom test fixtures |

---

## 🔧 Common Commands

```bash
# Run all tests
npm test

# Run with UI
npm run test:ui

# Run specific file
npx playwright test tests/login.spec.js

# Run specific test
npx playwright test -g "Add product to cart"

# Debug mode
npm run test:debug

# See browser (headed)
npm run test:headed

# Run on specific browser
npm run test:chrome
npm run test:firefox
npm run test:webkit

# Run serially (one test at a time)
npm run test:serial

# View HTML report
npm run report
```

---

## 💡 Pro Tips

1. **Use Page Objects** - Keep selectors in page classes, not in tests
2. **Reuse Helpers** - Use E2EFlowHelper for common flows
3. **Test Data** - Always use testData, never hardcode
4. **Logging** - Use Logger class for debugging
5. **Assertions** - Use custom assertion utilities
6. **Wait Smart** - Use waitForElement, not hardcoded delays

---

## 🐛 Debugging Tips

### Enable Logging
```javascript
import Logger from '../utils/loggerUtils.js';

const logger = new Logger('MyTest');
logger.info('This is logged');
logger.debug('Debug information');
logger.error('Error occurred');
```

### Take Screenshot
```javascript
await page.screenshot({ path: 'screenshot.png' });
```

### Use Debug Mode
```bash
npm run test:debug
```

### View Trace
Open the HTML report to see trace files for failed tests.

---

## 🏗️ Adding New Tests

1. Create test file in `tests/` folder: `myfeature.spec.js`
2. Import fixtures and test data
3. Use page objects for interactions
4. Write clear assertions
5. Run: `npx playwright test`

---

## 📦 Project Structure Summary

```
Pract_Playwright_MCP/
├── pages/              # Page objects (no business logic)
├── tests/              # Test files (*.spec.js)
├── fixtures/           # Fixtures and setup
├── config/             # Configuration
├── test-data/          # Test data constants
├── utils/              # Helper utilities
├── reports/            # Generated reports
└── playwright.config.js# Main configuration
```

---

**Need help? Check the main README.md for detailed documentation!**
