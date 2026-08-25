import type { Locator, Page } from '@playwright/test';

export class AboutPage {
  readonly heading: Locator;

  constructor(readonly page: Page) {
    this.heading = page.getByRole('heading', { name: 'About', level: 1 });
  }

  async goto() {
    await this.page.goto('/about');
  }
}
