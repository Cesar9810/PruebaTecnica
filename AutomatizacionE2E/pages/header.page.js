const { expect } = require('@playwright/test');

class Header {
  constructor(page) {
    this.page = page;
    this.accountToggle = page.locator('#top-links .dropdown:nth-child(2) a[title="My Account"]');
    this.accountMenu   = page.locator('#top-links .dropdown:nth-child(2) .dropdown-menu');
  }

  async openMyAccount() {
    await this.accountToggle.click();
    await expect(this.accountMenu).toBeVisible();
  }

  async isLoggedIn() {
    await this.openMyAccount().catch(() => {});
    const logoutLink = this.page.getByRole('link', { name: /^Logout$/i });
    return await logoutLink.isVisible().catch(() => false);
  }

  async logout() {
    const sidebarLogout = this.page.locator('a.list-group-item', { hasText: 'Logout' });
    if (await sidebarLogout.isVisible().catch(() => false)) {
      await sidebarLogout.click();
    } else {
      await this.openMyAccount().catch(() => {});
      const logoutLink = this.page.getByRole('link', { name: /^Logout$/i });
      if (await logoutLink.isVisible().catch(() => false)) {
        await logoutLink.click();
      }
    }
      const contBtn = this.page.getByRole('link', { name: 'Continue' }).or(
        this.page.getByRole('button', { name: 'Continue' })
      );
      if (await contBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
        await contBtn.click();
    }
  }

  async goToLogin() {
    if (await this.isLoggedIn()) {
      await this.logout();
    }
    await this.openMyAccount().catch(() => {});
    const loginLink = this.page.getByRole('link', { name: /^Login$/i });
    if (await loginLink.isVisible().catch(() => false)) {
      await loginLink.click();
    } else {
      await this.page.goto('/index.php?route=account/login');
    }
  }

  async goToRegister() {
    await this.openMyAccount().catch(() => {});
    const registerLink = this.page.getByRole('link', { name: /^Register$/i });
    if (await registerLink.isVisible().catch(() => false)) {
      await registerLink.click();
    } else {
      await this.page.goto('/index.php?route=account/register');
    }
  }

  async goToForgottenPassword() {
    await this.goToLogin();
    const forgot = this.page.getByRole('link', { name: /Forgotten Password/i });
    if (await forgot.isVisible().catch(() => false)) return forgot.click();
    await this.page.goto('/index.php?route=account/forgotten');
  }

  async openLaptopsAndNotebooksAll() {
    const menuItem = this.page.locator('#menu .nav > li', { hasText: 'Laptops & Notebooks' }).first();
    await menuItem.hover();

    const showAll = this.page.getByRole('link', { name: /Show All Laptops & Notebooks/i });
    if (await showAll.isVisible().catch(() => false)) {
      await showAll.click();
    } else {
      await this.page.goto('/index.php?route=product/category&path=18');
    }
  }

  async search(query) {
    const input = this.page.getByPlaceholder('Search');
    await expect(input).toBeVisible({ timeout: 5000 });
    await input.fill(query);

    const searchBtn = this.page.locator('#search button[type="button"], button[title="Search"]');
    await expect(searchBtn).toBeVisible({ timeout: 5000 });
    await searchBtn.click();
  }

  async openCartDropdown() {
    const cartBtn = this.page.locator('#cart > button');
    await expect(cartBtn).toBeVisible({ timeout: 5000 });
    await cartBtn.click();
    const dropdown = this.page.locator('#cart .dropdown-menu');
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    return dropdown;
  }

  async goToViewCart() {
    const dropdown = await this.openCartDropdown().catch(() => null);
    if (dropdown) {
      const viewCart = dropdown.getByRole('link', { name: /View Cart/i })
        .or(this.page.locator('#cart .text-right a[href*="route=checkout/cart"]'));
      if (await viewCart.first().isVisible().catch(() => false)) {
        await Promise.all([
          this.page.waitForLoadState('load').catch(() => {}),
          viewCart.first().click()
        ]);
      }
    }
    if (!this.page.url().includes('route=checkout/cart')) {
      await this.page.goto('/index.php?route=checkout/cart', { waitUntil: 'load' });
    }
  }

}

module.exports = { Header };