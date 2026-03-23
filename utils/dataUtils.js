/**
 * Data Utilities - Helper functions for data manipulation and validation
 */

/**
 * Extract numeric value from string
 * @param {string} str - String containing numbers
 * @returns {number} - Extracted number
 */
export const extractNumber = (str) => {
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

/**
 * Extract price from string
 * @param {string} str - String containing price (e.g., "$29.99")
 * @returns {number} - Extracted price
 */
export const extractPrice = (str) => {
  const match = str.match(/\$?([\d]+\.[\d]{2})/);
  return match ? parseFloat(match[1]) : 0;
};

/**
 * Format price to string
 * @param {number} price - Price as number
 * @returns {string} - Formatted price (e.g., "$29.99")
 */
export const formatPrice = (price) => {
  return `$${parseFloat(price).toFixed(2)}`;
};

/**
 * Calculate total from prices
 * @param {Array<string|number>} prices - Array of price strings or numbers
 * @returns {number} - Total sum
 */
export const calculateTotal = (prices) => {
  return prices.reduce((sum, price) => {
    const value = typeof price === 'string' ? extractPrice(price) : price;
    return sum + value;
  }, 0);
};

/**
 * Generate random string for test data
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
export const generateRandomString = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Generate random email
 * @returns {string} - Random email address
 */
export const generateRandomEmail = () => {
  return `user_${generateRandomString(8)}@test.com`;
};

/**
 * Get current timestamp
 * @returns {string} - Current timestamp in format YYYY-MM-DD HH:MM:SS
 */
export const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is valid
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Compare two objects for equality
 * @param {object} obj1 - First object
 * @param {object} obj2 - Second object
 * @returns {boolean} - True if objects are equal
 */
export const areObjectsEqual = (obj1, obj2) => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Deep clone an object
 * @param {object} obj - Object to clone
 * @returns {object} - Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Merge multiple objects
 * @param {...object} objects - Objects to merge
 * @returns {object} - Merged object
 */
export const mergeObjects = (...objects) => {
  return Object.assign({}, ...objects);
};

/**
 * Get unique values from array
 * @param {Array} array - Input array
 * @returns {Array} - Array with unique values
 */
export const getUniqueValues = (array) => {
  return [...new Set(array)];
};

/**
 * Sort array of objects by property
 * @param {Array} array - Array of objects
 * @param {string} property - Property to sort by
 * @param {string} order - Sort order: 'asc' or 'desc'
 * @returns {Array} - Sorted array
 */
export const sortByProperty = (array, property, order = 'asc') => {
  return array.sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (order === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
};

/**
 * Delay execution (for testing purposes)
 * @param {number} ms - Milliseconds to delay
 */
export const delay = (ms = 1000) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
