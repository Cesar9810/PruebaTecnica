const { test } = require('@playwright/test');
const { Header } = require('../pages/header.page');
const { ForgotPasswordPage } = require('../pages/forgot.page');

test.describe('Restablecimiento de contraseña', () => {
  test('Solicita reset y valida confirmación', async ({ page }) => {
    const header = new Header(page);
    const forgot = new ForgotPasswordPage(page);

    await page.goto('/');
    await header.goToForgottenPassword();
    await forgot.requestReset('no.existe@example.com');
    await forgot.expectConfirmation();
  });
});
