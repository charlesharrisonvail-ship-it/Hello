import type { Locator, Page } from '@playwright/test';

/** Page object for the home page — keeps selectors out of the specs. */
export class HomePage {
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly greeting: Locator;
  readonly error: Locator;
  readonly count: Locator;
  readonly increment: Locator;
  readonly decrement: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'Hello World', level: 1 });
    this.nameInput = page.getByLabel('Your name');
    this.submitButton = page.getByRole('button', { name: 'Say hello' });
    this.greeting = page.locator('#greeting');
    this.error = page.getByRole('alert');
    this.count = page.getByRole('status').or(page.locator('output'));
    this.increment = page.getByRole('button', { name: 'Increment' });
    this.decrement = page.getByRole('button', { name: 'Decrement' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async greet(name: string) {
    await this.nameInput.fill(name);
    await this.submitButton.click();
  }
}
