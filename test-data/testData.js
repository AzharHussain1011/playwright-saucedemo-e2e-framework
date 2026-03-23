/**
 * Test Data - User credentials and test data
 */

export const USERS = {
  STANDARD_USER: {
    username: 'standard_user',
    password: 'secret_sauce',
    role: 'standard',
  },
  LOCKED_OUT_USER: {
    username: 'locked_out_user',
    password: 'secret_sauce',
    role: 'locked',
  },
  PROBLEM_USER: {
    username: 'problem_user',
    password: 'secret_sauce',
    role: 'problem',
  },
  PERFORMANCE_GLITCH_USER: {
    username: 'performance_glitch_user',
    password: 'secret_sauce',
    role: 'performance_glitch',
  },
};

export const INVALID_CREDENTIALS = {
  WRONG_PASSWORD: {
    username: 'standard_user',
    password: 'wrong_password',
  },
  NON_EXISTENT_USER: {
    username: 'non_existent_user',
    password: 'secret_sauce',
  },
  EMPTY_CREDENTIALS: {
    username: '',
    password: '',
  },
};

export const PRODUCTS = {
  BACKPACK: 'Sauce Labs Backpack',
  BIKE_LIGHT: 'Sauce Labs Bike Light',
  BOLT_TSHIRT: 'Sauce Labs Bolt T-Shirt',
  FLEECE_JACKET: 'Sauce Labs Fleece Jacket',
  ONESIE: 'Sauce Labs Onesie',
  TEST_ALL_THINGS_TSHIRT: 'Test.allTheThings() T-Shirt (Red)',
};

export const PRODUCT_PRICES = {
  'Sauce Labs Backpack': '$29.99',
  'Sauce Labs Bike Light': '$9.99',
  'Sauce Labs Bolt T-Shirt': '$15.99',
  'Sauce Labs Fleece Jacket': '$49.99',
  'Sauce Labs Onesie': '$7.99',
  'Test.allTheThings() T-Shirt (Red)': '$15.99',
};

export const CHECKOUT_DATA = {
  VALID: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '12345',
  },
  VALID_ALTERNATIVE: {
    firstName: 'Jane',
    lastName: 'Smith',
    postalCode: '54321',
  },
  VALID_SPECIAL_CHARS: {
    firstName: "O'Brien",
    lastName: 'García-López',
    postalCode: '12345-6789',
  },
  EMPTY: {
    firstName: '',
    lastName: '',
    postalCode: '',
  },
  MISSING_FIRSTNAME: {
    firstName: '',
    lastName: 'Doe',
    postalCode: '12345',
  },
  MISSING_LASTNAME: {
    firstName: 'John',
    lastName: '',
    postalCode: '12345',
  },
  MISSING_POSTAL_CODE: {
    firstName: 'John',
    lastName: 'Doe',
    postalCode: '',
  },
};

export const SORT_OPTIONS = {
  AZ: 'az', // A to Z
  ZA: 'za', // Z to A
  LOW_TO_HIGH: 'lohi', // Price (low to high)
  HIGH_TO_LOW: 'hilo', // Price (high to low)
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Epic sadface: Username and password do not match any user in this service',
  LOCKED_OUT_USER: 'Epic sadface: Sorry, this user has been locked out.',
  REQUIRED_FIRST_NAME: 'Error: First Name is required',
  REQUIRED_LAST_NAME: 'Error: Last Name is required',
  REQUIRED_POSTAL_CODE: 'Error: Postal Code is required',
};

export const EXPECTED_PRODUCTS_COUNT = 6;

export const TEST_TIMEOUT = 30000; // 30 seconds
export const ELEMENT_WAIT_TIMEOUT = 5000; // 5 seconds
export const PAGE_LOAD_TIMEOUT = 10000; // 10 seconds

// Frequently used test scenarios
export const TEST_SCENARIOS = {
  LOGIN_AND_BROWSE: {
    name: 'Login and browse inventory',
    user: USERS.STANDARD_USER,
    description: 'Test user login and product browsing',
  },
  LOGIN_AND_PURCHASE: {
    name: 'Complete purchase flow',
    user: USERS.STANDARD_USER,
    description: 'Test complete checkout flow',
  },
  INVALID_LOGIN: {
    name: 'Invalid login credentials',
    user: INVALID_CREDENTIALS.WRONG_PASSWORD,
    description: 'Test error handling for invalid credentials',
  },
};
