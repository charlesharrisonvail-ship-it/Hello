import { test as base, expect } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { AboutPage } from '../pages/about.page';

type Options = {
  /**
   * Console/page errors matching any of these patterns are tolerated. Set it
   * per file or per test with `test.use({ allowConsoleErrors: [/…/] })` when a
   * test deliberately provokes an error (e.g. navigating to a 404).
   */
  allowConsoleErrors: RegExp[];
};

type Fixtures = {
  homePage: HomePage;
  aboutPage: AboutPage;
};

/**
 * Extended `test` used by every spec. It injects the page objects and fails any
 * test whose page logged a console error or threw an uncaught exception —
 * cheap insurance against silent regressions.
 */
export const test = base.extend<Options & Fixtures>({
  allowConsoleErrors: [[], { option: true }],

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  aboutPage: async ({ page }, use) => {
    await use(new AboutPage(page));
  },
  page: async ({ page, allowConsoleErrors }, use) => {
    const problems: string[] = [];
    const record = (message: string) => {
      if (!allowConsoleErrors.some((pattern) => pattern.test(message))) problems.push(message);
    };

    page.on('console', (msg) => {
      if (msg.type() === 'error') record(`console.error: ${msg.text()}`);
    });
    page.on('pageerror', (err) => record(`pageerror: ${err.message}`));

    await use(page);

    expect(problems, 'page should not report console errors').toEqual([]);
  },
});

export { expect };
