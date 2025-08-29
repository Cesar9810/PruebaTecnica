const { expect } = require('@playwright/test');

class BasePage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  async expectTitleContains(text) {
    await expect(this.page).toHaveTitle(new RegExp(text, 'i'));
  }
}
module.exports = { BasePage };
