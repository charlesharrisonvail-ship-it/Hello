import { test, expect } from './fixtures/test';

/**
 * Runs on every configured project, so the same assertions cover the desktop
 * and Pixel 7 viewports declared in playwright.config.ts.
 */
test.describe('layout', () => {
  test('main content never overflows the viewport horizontally', async ({ page, homePage }) => {
    await homePage.goto();

    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth + 1,
    );
    expect(overflows, 'page should not scroll horizontally').toBe(false);
  });

  test('form controls stay reachable and tappable', async ({ homePage }) => {
    await homePage.goto();

    await expect(homePage.nameInput).toBeVisible();
    const box = await homePage.submitButton.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
  });
});
