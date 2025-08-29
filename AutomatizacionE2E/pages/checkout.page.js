const { expect } = require('@playwright/test');

class CheckoutPage {
  constructor(page) { this.page = page; }

  async guestCheckoutFlow(data) {

    if (!this.page.url().includes('route=checkout/checkout')) {
      await this.page.goto('/index.php?route=checkout/checkout', { waitUntil: 'load' });
    }

    const step1Panel = this.page.locator('#collapse-checkout-option');
    if (await step1Panel.evaluate(el => !el.classList.contains('in')).catch(() => true)) {
      await this.page.locator('a[href="#collapse-checkout-option"]').click().catch(() => {});
    }

    const guestRadio =
      this.page.getByLabel(/Guest Checkout/i)
        .or(this.page.locator('#collapse-checkout-option input[type="radio"][value="guest"]'));
    if (await guestRadio.isVisible().catch(() => false)) {
      await guestRadio.check();
    }

    const cont1 = this.page.locator(
      '#button-account, #collapse-checkout-option button:has-text("Continue"), #collapse-checkout-option input[type="button"][value*="Continue"]'
    );
    if (await cont1.isVisible().catch(() => false)) {
      await Promise.all([
        this.page.waitForLoadState('networkidle').catch(() => {}),
        cont1.first().click()
      ]);
    }

    const step2Panel = this.page.locator('#collapse-payment-address');

    if (await step2Panel.evaluate(el => !el.classList.contains('in')).catch(() => true)) {
      await this.page.locator('a[href="#collapse-payment-address"]').click().catch(() => {});
    }

    await expect(step2Panel).toBeVisible({ timeout: 10000 });

    await this.page.locator('#input-payment-firstname').fill(data.firstName);
    await this.page.locator('#input-payment-lastname').fill(data.lastName);
    await this.page.locator('#input-payment-email').fill(data.email);
    await this.page.locator('#input-payment-telephone').fill(data.telephone);
    await this.page.locator('#input-payment-address-1').fill(data.address1);
    await this.page.locator('#input-payment-city').fill(data.city);
    await this.page.locator('#input-payment-postcode').fill(data.postcode);

    await this.page.locator('#input-payment-country').selectOption({ label: data.country });
    await this.page.waitForTimeout(300);
    await this.page.locator('#input-payment-zone').selectOption({ label: data.region });

    const cont2 = this.page.locator('#button-guest, #collapse-payment-address button:has-text("Continue")');
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      cont2.first().click()
    ]);

    const shippingPanel = this.page.locator('#collapse-shipping-method');

    if (await shippingPanel.count()) {
      if (await shippingPanel.evaluate(el => !el.classList.contains('in')).catch(() => true)) {
        await this.page.locator('a[href="#collapse-shipping-method"]').click().catch(() => {});
      }
      const cont3 = shippingPanel.locator('#button-shipping-method, button:has-text("Continue")');
      if (await cont3.first().isVisible().catch(() => false)) {
        await Promise.all([
          this.page.waitForLoadState('networkidle').catch(() => {}),
          cont3.first().click()
        ]);
      }
    } else {
      const cont3 = this.page.locator('#button-shipping-method, #collapse-shipping-method button:has-text("Continue")');
      if (await cont3.first().isVisible().catch(() => false)) {
        await Promise.all([
          this.page.waitForLoadState('networkidle').catch(() => {}),
          cont3.first().click()
        ]);
      }
    }

    const paymentPanel = this.page.locator('#collapse-payment-method');

    if (await paymentPanel.evaluate(el => !el.classList.contains('in')).catch(() => true)) {
      await this.page.locator('a[href="#collapse-payment-method"]').click().catch(() => {});
    }
    await expect(paymentPanel).toBeVisible({ timeout: 10000 });

    const anyPaymentRadio = paymentPanel.locator('input[type="radio"][name="payment_method"]').first();
    if (await anyPaymentRadio.isVisible().catch(() => false)) {
      await anyPaymentRadio.check();
    }

    const agree = paymentPanel.locator('input[name="agree"], input[type="checkbox"][name="agree"]');
    if (await agree.isVisible().catch(() => false)) {
      await agree.check();
    }

    const cont4 = paymentPanel.locator('#button-payment-method, button:has-text("Continue")');
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {}),
      cont4.first().click()
    ]);

    const confirmBtn = this.page.locator('#button-confirm, button:has-text("Confirm Order")');
    await confirmBtn.first().click();

  }

  async expectOrderConfirmed() {
    await expect(this.page.getByRole('heading', { name: /Your order has been placed!/i }))
      .toBeVisible({ timeout: 15000 });
  }
}

module.exports = { CheckoutPage };
