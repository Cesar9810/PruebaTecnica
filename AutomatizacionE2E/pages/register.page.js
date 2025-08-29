const { expect } = require('@playwright/test');

class RegisterPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) { this.page = page; }

  async fillForm({ firstName, lastName, email, telephone, password }) {
    await this.page.waitForURL(/route=account\/register/i, { timeout: 10000 });
    await expect(this.page.locator('#input-firstname')).toBeVisible({ timeout: 10000 });

    await this.page.locator('#input-firstname').fill(firstName);
    await this.page.locator('#input-lastname').fill(lastName);
    await this.page.locator('#input-email').fill(email);
    await this.page.locator('#input-telephone').fill(telephone);
    await this.page.locator('#input-password').fill(password);
    await this.page.locator('#input-confirm').fill(password);

    await this.page.locator('input[type="checkbox"][name="agree"]').check();
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }

  async expectSuccess() {
    await this.page.waitForURL(/route=account\/success/i, { timeout: 10000 });
    await expect(
      this.page.locator('#content').getByText(/successfully created/i, { exact: false })
      ).toBeVisible({ timeout: 10000 });
    await expect(
        this.page.getByRole('button', { name: /Continue/i }).or(
          this.page.getByRole('link', { name: /Continue/i })
        )
      ).toBeVisible();
  }
}
module.exports = { RegisterPage };