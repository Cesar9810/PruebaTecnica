const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) { this.page = page; }

  async login(email, password) {
    await this.page.getByLabel('E-Mail Address').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }

  async expectLoggedIn() {
    await this.page.waitForURL(/route=account\/account/i, { timeout: 10000 });
    const contentHeading = this.page.locator('#content').getByRole('heading', { name: /My Account/i }).first();
    await expect(contentHeading).toBeVisible();
  }

  async expectError() {
    await expect(this.page.locator('.alert-danger')).toBeVisible();
  }
}

module.exports = { LoginPage };
