import { test, expect } from './fixtures/test';

test.describe('home page', () => {
  test.beforeEach(async ({ homePage }) => {
    await homePage.goto();
  });

  test('renders the hero @smoke', async ({ page, homePage }) => {
    await expect(page).toHaveTitle('Hello World');
    await expect(homePage.heading).toBeVisible();
  });

  test('greets a visitor by name', async ({ homePage }) => {
    await homePage.greet('Ada');

    await expect(homePage.greeting).toBeVisible();
    await expect(homePage.greeting).toHaveText('Hello, Ada!');
    await expect(homePage.error).toBeEmpty();
  });

  test('rejects a name that is too short', async ({ homePage }) => {
    await homePage.greet('A');

    await expect(homePage.error).toHaveText('Please enter at least 2 characters.');
    await expect(homePage.greeting).toBeHidden();
    await expect(homePage.nameInput).toHaveAttribute('aria-invalid', 'true');
  });

  test('recovers after a validation error', async ({ homePage }) => {
    await homePage.greet('A');
    await expect(homePage.error).not.toBeEmpty();

    await homePage.greet('Ada Lovelace');
    await expect(homePage.greeting).toHaveText('Hello, Ada Lovelace!');
    await expect(homePage.nameInput).not.toHaveAttribute('aria-invalid');
  });

  test('counter increments and decrements', async ({ homePage }) => {
    await expect(homePage.count).toHaveText('0');

    await homePage.increment.click();
    await homePage.increment.click();
    await expect(homePage.count).toHaveText('2');

    await homePage.decrement.click();
    await expect(homePage.count).toHaveText('1');
  });
});
