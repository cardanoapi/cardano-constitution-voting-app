import { defineConfig, devices } from '@playwright/test';
import { testPlanFilter } from 'allure-playwright/dist/testplan';
import { config } from 'dotenv';
import environments from './lib/constants/environments';

config();

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!environments.ci,
  /* Retry on CI only */
  retries: environments.ci ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? parseInt(process.env.TEST_WORKERS || '1') : 1,
  /*use Allure Playwright's testPlanFilter() to determine the grep parameter*/
  grep: testPlanFilter(),
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: environments.ci ? [['line'], ['allure-playwright']] : [['line']],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: environments.baseUrl,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'auth setup',
      testMatch: '**/auth.setup.ts',
    },
    {
      name: 'loggedin (desktop)',
      use: { ...devices['Desktop Chrome'] },
      testMatch: '**/*.loggedin.spec.ts',
      dependencies: environments.ci ? ['auth setup'] : [],
    },
    {
      name: 'independent (desktop)',
      use: { ...devices['Desktop Chrome'] },
      testIgnore:['**/*.loggedin.spec.ts'],
    },

    {
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
      testIgnore:['**/*.loggedin.spec.ts'],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
