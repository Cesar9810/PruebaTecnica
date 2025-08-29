const { expect } = require('@playwright/test');

class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async ensureOnViewCart() {
    if (!this.page.url().includes('route=checkout/cart')) {
      await this.page.goto('/index.php?route=checkout/cart', { waitUntil: 'load' });
    }

    const productTbody = this.page
      .locator('#content table tbody')
      .filter({ has: this.page.locator('input[name*="quantity"], button[formaction*="edit"], button[onclick*="cart.remove"]') })
      .first();
  
    await expect(productTbody).toBeVisible({ timeout: 10000 });
    return productTbody;
  }

  async postRefreshNormalizeProtocol() {
    await this.page.waitForLoadState('load').catch(() => {});
    if (this.page.url().startsWith('https://opencart.abstracta.us')) {
      const httpUrl = this.page.url().replace('https://', 'http://');
      await this.page.goto(httpUrl, { waitUntil: 'load' });
    }
  }

  async rowByProductId(productId) {
    const productTbody = await this.ensureOnViewCart();
    const link = this.page.locator(`a[href*="product_id=${productId}"]`);
    return productTbody.locator('tr', { has: link }).first();
  }

  async rowByProduct(name, opts = {}, timeout = 9000) {
    const productTbody = await this.ensureOnViewCart();
  
    if (opts.id) {
      const byId = await this.rowByProductId(opts.id);
      if (await byId.count()) return byId;
    }
  
    const byLink = productTbody.locator('tr', {
      has: this.page.getByRole('link', { name: new RegExp(name, 'i') })
    }).first();
    if (await byLink.count()) return byLink;
  
    const partial = typeof name === 'string' ? name.replace(/\s+10\.?1/i, '') : 'Samsung Galaxy Tab';
    const byText = productTbody.locator('tr', { hasText: new RegExp(partial, 'i') }).first();
    if (await byText.count()) return byText;

    const byXpath = productTbody.locator(`xpath=.//tr[.//a[contains(normalize-space(.), "${partial}")]]`).first();
    if (await byXpath.count()) return byXpath;
  
    return this.page.locator('#content tbody tr.__not_found__');
  }

  async setQtyByProductId(productId, qty) {
    await this.ensureOnViewCart();

    let row = await this.rowByProductId(productId);
    await expect(row).toBeVisible({ timeout: 10000 });

    let qtyInput = row.locator('input[name*="quantity"]');
    await expect(qtyInput).toBeVisible();
    await qtyInput.fill(String(qty));

    const updateBtn = row.locator(
      'button[formaction*="edit"], button[data-original-title*="Update"], button.btn-primary:has(i.fa-refresh)'
    );
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      updateBtn.first().click()
    ]);

    await this.postRefreshNormalizeProtocol();

    row = await this.rowByProductId(productId);
    await expect(row).toBeVisible({ timeout: 10000 });

    qtyInput = row.locator('input[name*="quantity"]');
    await expect(qtyInput).toHaveValue(String(qty), { timeout: 10000 });
  }

  async increaseQtyByName(name, qty, opts = {}) {
    await this.ensureOnViewCart();

    let row = await this.rowByProduct(name, opts);
    await expect(row).toBeVisible({ timeout: 9000 });

    let qtyInput = row.locator('input[name*="quantity"]');
    await expect(qtyInput).toBeVisible();
    await qtyInput.fill(String(qty));

    const updateBtn = row.locator(
      'button[formaction*="edit"], button[data-original-title*="Update"], button.btn-primary:has(i.fa-refresh)'
    );
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      updateBtn.first().click()
    ]);

    await this.postRefreshNormalizeProtocol();

    row = await this.rowByProduct(name, opts, 10000);
    await expect(row).toBeVisible({ timeout: 10000 });

    qtyInput = row.locator('input[name*="quantity"]');
    await expect(qtyInput).toHaveValue(String(qty), { timeout: 10000 });
  }

  async expectQty(name, expected, opts = {}) {
    const row = await this.rowByProduct(name, opts);
    await expect(row).toBeVisible();
    const qtyInput = row.locator('input[name*="quantity"]');
    await expect(qtyInput).toHaveValue(String(expected));
  }

  async removeProductByName(name, opts = {}) {
    await this.ensureOnViewCart();

    const row = await this.rowByProduct(name, opts);
    await expect(row).toBeVisible();

    const removeBtn = row.locator(
      'button[onclick*="cart.remove"], button[data-original-title*="Remove"], button.btn-danger'
    );
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      removeBtn.first().click()
    ]);

    await this.postRefreshNormalizeProtocol();

    await expect(row).toBeHidden({ timeout: 6000 }).catch(async () => {
      await expect(this.page.locator('.alert-success')).toContainText(/Success|modified/i);
    });
  }

  async proceedToCheckout() {
    await this.ensureOnViewCart();

    const contentCheckout = this.page.locator(
      '#content a.btn.btn-primary[href*="checkout/checkout"]'
    );

    if (await contentCheckout.isVisible().catch(() => false)) {
      await Promise.all([
        this.page.waitForLoadState('load').catch(() => {}),
        contentCheckout.click()
      ]);
      return;
    }

    await this.page.locator(
      'a[title="Checkout"], #top a[href*="checkout/checkout"]'
    ).first().click();
  }

  async expectMiniCartQtyByProductId(productId, expectedQty) {
    const menu = this.page.locator('#cart .dropdown-menu');
    await expect(menu).toBeVisible();

    const row = menu.locator('tr', {
      has: this.page.locator(`a[href*="product_id=${productId}"]`)
    }).first();
    await expect(row).toBeVisible();

    const qtyCell = row.locator('td').nth(2);
    await expect(qtyCell).toContainText(new RegExp(`x\\s*${expectedQty}\\b`));
  }
}

module.exports = { CartPage };