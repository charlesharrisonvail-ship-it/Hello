import { test, expect } from './fixtures/test';

test.describe('navigation', () => {
  test('moves between home and about @smoke', async ({ page, homePage, aboutPage }) => {
    await homePage.goto();

    await page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(aboutPage.heading).toBeVisible();

    await page.getByRole('link', { name: 'Hello World' }).click();
    await expect(homePage.heading).toBeVisible();
  });

  test('marks the active nav item', async ({ page, aboutPage }) => {
    await aboutPage.goto();

    const about = page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name: 'About' });
    await expect(about).toHaveAttribute('aria-current', 'page');
  });

  test.describe('missing routes', () => {
    // The browser logs a console error for the 404 response itself; that's the
    // behaviour under test, not a regression.
    test.use({ allowConsoleErrors: [/Failed to load resource.*404/] });

    test('serves a 404 page for unknown routes', async ({ page }) => {
      const response = await page.goto('/definitely-not-a-page');

      expect(response?.status()).toBe(404);
      await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
    });
  });
});
