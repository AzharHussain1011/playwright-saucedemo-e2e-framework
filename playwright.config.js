// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  
  /* Global test timeout - 30 seconds */
  timeout: 30 * 1000,
  
  /* Global expect timeout - 5 seconds */
  expect: {
    timeout: 5000,
  },

  /* Parallel execution */
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  /* Fail on test.only in CI */
  forbidOnly: !!process.env.CI,

  /* Retry configuration */
  retries: process.env.CI ? 2 : 0,

  /* Multiple reporters for comprehensive reporting */
  reporter: [
    ['html', { outputFolder: './reports/html' }],
    ['list'],
    ['json', { outputFile: './reports/results.json' }],
    ['junit', { outputFile: './reports/junit.xml' }],
  ],

  /* Shared settings for all projects */
  use: {
    /* Base URL for all navigations */
    baseURL: 'https://www.saucedemo.com/',

    /* Collect screenshots on failure */
    screenshot: 'only-on-failure',

    /* Collect video on failure */
    video: 'retain-on-failure',

    /* Collect trace on failure */
    trace: 'on-first-retry',

    /* Action timeout */
    actionTimeout: 10 * 1000,

    /* Navigation timeout */
    navigationTimeout: 30 * 1000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchArgs: ['--disable-blink-features=AutomationControlled'],
      },
    },

    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Output folder for test artifacts */
  outputDir: './test-results',

  /* Webserver configuration (if needed) */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'https://www.saucedemo.com/',
  //   reuseExistingServer: !process.env.CI,
  // },
});

