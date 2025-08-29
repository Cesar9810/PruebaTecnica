const { test } = require('@playwright/test');
const { Header } = require('../pages/header.page');
const { RegisterPage } = require('../pages/register.page');
const { LoginPage } = require('../pages/login.page');
const { uniqueEmail } = require('../utils/helpers');
const { user } = require('../utils/data');

test.describe('Registro e inicio de sesión', () => {
  test('Completa el registro y valida login', async ({ page }) => {
    const header = new Header(page);
    const register = new RegisterPage(page);
    const login = new LoginPage(page);
    const email = uniqueEmail('cesar');

    await page.goto('/');
    await header.goToRegister();
    await register.fillForm({ 
      firstName: user.firstName, lastName: user.lastName,
      email, telephone: user.telephone, password: user.password
    });
    await register.submit();
    await register.expectSuccess();
    await header.logout();
    await header.goToLogin();
    await login.login(email, user.password);
    await login.expectLoggedIn();

  });
});
