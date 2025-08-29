const { expect } = require('@playwright/test');

class ProductPage {
  constructor(page) { this.page = page; }

  async addToCart(times = 1) {
    const addBtn = this.page.locator('#button-cart, button#button-cart, [id="button-cart"]');
    await expect(addBtn).toBeVisible({ timeout: 10000 });

    for (let i = 0; i < times; i++) {
      await addBtn.click();
      await expect(this.page.locator('.alert-success')).toContainText(/Success|agregado/i);
    }
  }

  async addToCartFromListingByName(name) {
    const card = this.page.locator('.product-layout').filter({ hasText: new RegExp(name, 'i') }).first();
    await expect(card).toBeVisible();

    const addBtn = card.locator('button:has(i.fa-shopping-cart), button[onclick*="cart.add"]');
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    await expect(this.page.locator('.alert-success')).toContainText(/Success|agregado/i);
  }
}

module.exports = { ProductPage };