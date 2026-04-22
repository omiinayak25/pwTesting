import { test, expect } from '../fixtures/baseFixture';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { getTestUser } from '../test-data/users';
import { PRODUCTS } from '../test-data/products';
import { logger } from '../utils/logger';

/**
 * Shopping Flow Tests
 * Comprehensive tests for add to cart, remove from cart, and cart management
 */
test.describe('Shopping Cart Tests @regression', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Login
    await loginPage.navigate();
    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, user.password);

    // Verify inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();
  });

  test('should add single product to cart', async ({ page }) => {
    logger.info('Test: Add single product to cart');

    const productId = PRODUCTS.BACKPACK.id;
    await inventoryPage.addProductToCart(productId);

    // Verify cart badge shows 1 item
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);
    logger.pass('Single product added to cart successfully');
  });

  test('should add multiple products to cart', async ({ page }) => {
    logger.info('Test: Add multiple products to cart');

    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id, PRODUCTS.BOLT_SHIRT.id];

    for (const productId of productIds) {
      await inventoryPage.addProductToCart(productId);
    }

    // Verify cart badge shows correct count
    const cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(productIds.length);
    logger.pass(`${productIds.length} products added to cart successfully`);
  });

  test('should remove product from cart', async ({ page }) => {
    logger.info('Test: Remove product from cart');

    const productId = PRODUCTS.BACKPACK.id;

    // Add to cart
    await inventoryPage.addProductToCart(productId);
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Remove from cart
    await inventoryPage.removeProductFromCart(productId);
    cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(0);
    logger.pass('Product removed from cart successfully');
  });

  test('should navigate to cart and verify items', async ({ page }) => {
    logger.info('Test: Navigate to cart and verify items');

    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id];

    // Add products to cart
    for (const productId of productIds) {
      await inventoryPage.addProductToCart(productId);
    }

    // Navigate to cart
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageIsLoaded();

    // Verify products in cart
    for (const productId of productIds) {
      await cartPage.verifyProductInCart(productId);
    }

    logger.pass('All products verified in cart');
  });

  test('should remove product from cart page', async ({ page }) => {
    logger.info('Test: Remove product from cart page');

    const productId = PRODUCTS.BACKPACK.id;

    // Add to cart
    await inventoryPage.addProductToCart(productId);

    // Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageIsLoaded();

    // Remove from cart
    await cartPage.removeProductFromCart(productId);

    // Verify empty cart
    await cartPage.verifyCartIsEmpty();
    logger.pass('Product removed from cart page successfully');
  });

  test('should continue shopping from cart', async ({ page }) => {
    logger.info('Test: Continue shopping from cart');

    // Add product to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);

    // Go to cart
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageIsLoaded();

    // Continue shopping
    await cartPage.clickContinueShopping();

    // Verify back on inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();
    logger.pass('Successfully returned to inventory from cart');
  });

  test('should maintain cart count across navigation', async ({ page }) => {
    logger.info('Test: Cart count persists across navigation');

    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id, PRODUCTS.BOLT_SHIRT.id];

    // Add multiple products
    for (const productId of productIds) {
      await inventoryPage.addProductToCart(productId);
    }

    // Navigate to cart
    await inventoryPage.goToCart();
    const cartCount = await cartPage.getCartItemCount();
    expect(cartCount).toBe(productIds.length);

    // Go back to inventory
    await cartPage.clickContinueShopping();

    // Check cart count still shows correct number
    const updatedCartCount = await inventoryPage.getCartItemCount();
    expect(updatedCartCount).toBe(productIds.length);
    logger.pass('Cart count maintained across navigation');
  });
});

test.describe('Inventory Tests @smoke', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Login
    await loginPage.navigate();
    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, user.password);

    // Verify inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();
  });

  test('should display all products on inventory page', async ({ page }) => {
    logger.info('Test: Verify all products displayed');

    const productCount = await inventoryPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
    logger.pass(`${productCount} products displayed on inventory page`);
  });

  test('should get all product names', async ({ page }) => {
    logger.info('Test: Get all product names');

    const productNames = await inventoryPage.getAllProductNames();
    expect(productNames.length).toBeGreaterThan(0);

    logger.info(`Found ${productNames.length} products:`);
    productNames.forEach((name) => {
      logger.info(`  - ${name}`);
    });

    logger.pass('All product names retrieved successfully');
  });
});
