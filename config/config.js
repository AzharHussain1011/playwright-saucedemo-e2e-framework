/**
 * Environment Configuration
 * Manages environment-specific settings
 */

const config = {
  // Base URL
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com/',

  // Browser configuration
  browser: process.env.BROWSER || 'chromium', // chromium, firefox, webkit

  // Headless mode
  headless: process.env.HEADLESS !== 'false', // Set to 'false' for headed mode

  // Viewport size
  viewport: {
    width: parseInt(process.env.VIEWPORT_WIDTH || '1920'),
    height: parseInt(process.env.VIEWPORT_HEIGHT || '1080'),
  },

  // Timeout settings (in milliseconds)
  timeouts: {
    page: parseInt(process.env.PAGE_TIMEOUT || '30000'),
    action: parseInt(process.env.ACTION_TIMEOUT || '10000'),
    wait: parseInt(process.env.WAIT_TIMEOUT || '5000'),
    expect: parseInt(process.env.EXPECT_TIMEOUT || '5000'),
  },

  // Retry settings
  retries: {
    max: parseInt(process.env.MAX_RETRIES || '2'),
    delay: parseInt(process.env.RETRY_DELAY || '1000'),
  },

  // Parallel execution
  workers: process.env.WORKERS || undefined, // undefined = auto, '1' = serial

  // Reporting
  reporting: {
    html: process.env.HTML_REPORT !== 'false',
    json: process.env.JSON_REPORT !== 'false',
    junit: process.env.JUNIT_REPORT !== 'false',
  },

  // Screenshots
  screenshots: {
    onFailure: process.env.SCREENSHOT_ON_FAILURE !== 'false',
    onSuccess: process.env.SCREENSHOT_ON_SUCCESS === 'true',
    folder: './reports/screenshots',
  },

  // Video recording
  video: {
    onFailure: process.env.VIDEO_ON_FAILURE !== 'false',
    folder: './test-results',
  },

  // Trace
  trace: {
    onFailure: process.env.TRACE_ON_FAILURE !== 'false',
  },

  // Logging
  logging: {
    enabled: process.env.LOGGING_ENABLED !== 'false',
    level: process.env.LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
  },

  // Test tags
  tags: {
    smoke: '@smoke',
    regression: '@regression',
    e2e: '@e2e',
  },

  // API configuration (if needed for API testing)
  api: {
    baseURL: process.env.API_BASE_URL || 'https://api.saucedemo.com/',
    timeout: parseInt(process.env.API_TIMEOUT || '10000'),
  },

  // Security settings
  security: {
    ignoreHTTPSErrors: process.env.IGNORE_HTTPS !== 'false',
  },

  /**
   * Get environment-specific configuration
   * @param {string} env - Environment name (dev, staging, prod)
   */
  getEnvironmentConfig(env = process.env.ENV || 'dev') {
    const envConfigs = {
      dev: {
        baseURL: 'http://localhost:3000/',
        logging: true,
      },
      staging: {
        baseURL: 'https://staging.saucedemo.com/',
        retries: { max: 1 },
      },
      prod: {
        baseURL: 'https://www.saucedemo.com/',
        retries: { max: 3 },
      },
    };

    return {
      ...config,
      ...envConfigs[env],
    };
  },
};

export default config;
