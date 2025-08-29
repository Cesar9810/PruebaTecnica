const { expect } = require('@playwright/test');

class ForgotPasswordPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) { this.page = page; }

  async requestReset(email) {
    await this.page.getByLabel('E-Mail Address').fill(email);
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async expectConfirmation() {
    await expect(this.page.locator('.alert-success, .alert-danger, .alert-warning')).toBeVisible();
  }
}
module.exports = { ForgotPasswordPage };
