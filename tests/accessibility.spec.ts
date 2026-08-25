import { test, expect } from './fixtures/test';

/**
 * Structural accessibility checks that need no extra dependencies. For a full
 * audit, add `@axe-core/playwright` and assert on its violations here.
 */
test.describe('accessibility basics', () => {
  for (const path of ['/', '/about']) {
    test(`${path} has one h1, a lang attribute, and a labelled nav`, async ({ page }) => {
      await page.goto(path);

      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible();
    });
  }

  test('the name field is keyboard reachable and submits with Enter', async ({ page, homePage }) => {
    await homePage.goto();

    await homePage.nameInput.focus();
    await expect(homePage.nameInput).toBeFocused();

    await page.keyboard.type('Grace');
    await page.keyboard.press('Enter');
    await expect(homePage.greeting).toHaveText('Hello, Grace!');
  });
});
