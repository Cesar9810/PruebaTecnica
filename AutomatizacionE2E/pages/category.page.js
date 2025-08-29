const { expect } = require('@playwright/test');

class CategoryPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) { this.page = page; }

  async expectOnLaptopsCategory() {
    await expect(this.page.getByRole('heading', { name: /laptops/i })).toBeVisible();
  }

  async openProductByName(name) {
    const card = this.page.locator('.product-layout').filter({ hasText: name }).first();
    await expect(card).toBeVisible();
    await card.getByRole('link', { name }).first().click();
  }
}
module.exports = { CategoryPage };