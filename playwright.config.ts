import { defineConfig, devices } from '@playwright/test';

/**
 * Base URL the suite runs against. Point it at a deployed environment to run
 * the same specs there: `BASE_URL=https://staging.example.com npm test`.
 */
const baseURL = process.env.BASE_URL ?? 'http://127.0.0.1:4173';

/** Only start the bundled demo server when we're testing locally. */
const isLocal = baseURL.includes('127.0.0.1') || baseURL.includes('localhost');

export default defineConfig({
  testDir: './tests',
  /* Snapshots live next to the spec that produced them. */
  snapshotPathTemplate: '{testDir}/__screenshots__/{testFilePath}/{arg}{ext}',
  /* Fail the build if someone commits test.only. */
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }], ['list']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
    },
    /*
     * This environment only ships Chromium (see /opt/pw-browsers). Uncomment
     * these after running `npx playwright install firefox webkit` somewhere
     * that allows browser downloads.
     *
     * { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
     * { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
     */
  ],

  webServer: isLocal
    ? {
        command: 'npm run serve',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000,
        stdout: 'ignore',
        stderr: 'pipe',
      }
    : undefined,
});
