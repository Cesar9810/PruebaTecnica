const { test, expect } = require('@playwright/test');
const { Header } = require('../pages/header.page');
const { CategoryPage } = require('../pages/category.page');
const { ProductPage } = require('../pages/product.page');
const { CartPage } = require('../pages/cart.page');
const { CheckoutPage } = require('../pages/checkout.page');
const { products, user, address } = require('../utils/data');
const { uniqueEmail } = require('../utils/helpers');

test.describe('Flujo de compra end-to-end', () => {
  test('Navega, agrega, ajusta carrito y compra', async ({ page }) => {
    const header = new Header(page);
    const category = new CategoryPage(page);
    const product = new ProductPage(page);
    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await page.goto('/');
    await header.openLaptopsAndNotebooksAll();
    await category.expectOnLaptopsCategory();
    await category.openProductByName(products.macbookPro);
    await expect(page.getByRole('heading', { name: /MacBook Pro/i })).toBeVisible();
    await product.addToCart();

    await header.search('Samsung Galaxy');
    await page.getByRole('link', { name: products.samsungTablet }).first().click();
    await expect(page.getByRole('heading', { name: /Samsung Galaxy Tab/i })).toBeVisible();
    await product.addToCart();

    await header.goToViewCart();
    await cart.removeProductByName(products.macbookPro, { id: '45' });

    await cart.setQtyByProductId('49', 2);

    await cart.proceedToCheckout();

    await checkout.guestCheckoutFlow({
      ...address,
      email: uniqueEmail('guest'),
      telephone: user.telephone
    });

    await checkout.expectOrderConfirmed();
  });
}); 