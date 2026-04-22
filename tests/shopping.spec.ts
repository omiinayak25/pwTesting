// Import test and expect from custom fixture (with logging hooks)
import { test, expect } from '../fixtures/baseFixture';
// Import LoginPage object for authentication
import { LoginPage } from '../pages/LoginPage';
// Import InventoryPage object for product interactions
import { InventoryPage } from '../pages/InventoryPage';
// Import CartPage object for cart interactions
import { CartPage } from '../pages/CartPage';
// Import factory function to get test user data
import { getTestUser } from '../test-data/users';
// Import product constants for test data
import { PRODUCTS } from '../test-data/products';
// Import logger for test output
import { logger } from '../utils/logger';

/**
 * Shopping Flow Tests
 * Comprehensive tests for add to cart, remove from cart, and cart management
 * Tests verify shopping cart functionality and product management
 */
test.describe('Shopping Cart Tests @regression', () => {
  // Declare page objects that will be initialized in beforeEach
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  /**
   * Setup before each test
   * Logs in user and verifies inventory page is loaded
   */
  test.beforeEach(async ({ page }) => {
    // Initialize page objects with the current page context
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    // Navigate to login page
    await loginPage.navigate();
    // Get test user credentials from factory function
    const user = getTestUser('VALID_USER');
    // Perform login with test user credentials
    await loginPage.login(user.username, user.password);

    // After login, verify we're on inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();
  });

  /**
   * Test: Add single product to cart
   * Verifies that one product can be added and cart badge updates
   */
  test('should add single product to cart', async ({ page }) => {
    // Log test start
    logger.info('Test: Add single product to cart');

    // Get product ID for backpack
    const productId = PRODUCTS.BACKPACK.id;
    // Click add to cart button for the product
    await inventoryPage.addProductToCart(productId);

    // Get the cart item count from the badge
    const cartCount = await inventoryPage.getCartItemCount();
    // Assert that cart shows exactly 1 item
    expect(cartCount).toBe(1);
    // Log test success
    logger.pass('Single product added to cart successfully');
  });

  /**
   * Test: Add multiple products to cart
   * Verifies that multiple products can be added and cart count is accurate
   */
  test('should add multiple products to cart', async ({ page }) => {
    // Log test start
    logger.info('Test: Add multiple products to cart');

    // Define array of product IDs to add (backpack, bike light, bolt shirt)
    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id, PRODUCTS.BOLT_SHIRT.id];

    // Loop through each product and add to cart
    for (const productId of productIds) {
      // Add current product to cart
      await inventoryPage.addProductToCart(productId);
    }

    // Get the final cart count
    const cartCount = await inventoryPage.getCartItemCount();
    // Assert cart shows correct number of items (3 in this case)
    expect(cartCount).toBe(productIds.length);
    // Log test success with product count
    logger.pass(`${productIds.length} products added to cart successfully`);
  });

  /**
   * Test: Remove product from cart
   * Verifies that products can be removed from cart and count decreases
   */
  test('should remove product from cart', async ({ page }) => {
    // Log test start
    logger.info('Test: Remove product from cart');

    // Get product ID for backpack
    const productId = PRODUCTS.BACKPACK.id;

    // Add product to cart first
    await inventoryPage.addProductToCart(productId);
    // Verify cart now has 1 item
    let cartCount = await inventoryPage.getCartItemCount();
    expect(cartCount).toBe(1);

    // Remove the product from cart
    await inventoryPage.removeProductFromCart(productId);
    // Get updated cart count
    cartCount = await inventoryPage.getCartItemCount();
    // Assert cart is now empty (count = 0)
    expect(cartCount).toBe(0);
    // Log test success
    logger.pass('Product removed from cart successfully');
  });

  /**
   * Test: Navigate to cart and verify items
   * Verifies that products added to cart appear on cart page
   */
  test('should navigate to cart and verify items', async ({ page }) => {
    // Log test start
    logger.info('Test: Navigate to cart and verify items');

    // Define products to add (backpack and bike light)
    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id];

    // Add each product to cart
    for (const productId of productIds) {
      // Add current product to cart
      await inventoryPage.addProductToCart(productId);
    }

    // Click cart link to navigate to cart page
    await inventoryPage.goToCart();
    // Verify cart page is loaded
    await cartPage.verifyCartPageIsLoaded();

    // Verify each product appears in cart
    for (const productId of productIds) {
      // Assert product is visible on cart page
      await cartPage.verifyProductInCart(productId);
    }

    // Log test success
    logger.pass('All products verified in cart');
  });

  /**
   * Test: Remove product from cart page
   * Verifies that products can be removed directly from the cart page
   */
  test('should remove product from cart page', async ({ page }) => {
    // Log test start
    logger.info('Test: Remove product from cart page');

    // Get product ID for backpack
    const productId = PRODUCTS.BACKPACK.id;

    // Add product to cart
    await inventoryPage.addProductToCart(productId);

    // Navigate to cart page
    await inventoryPage.goToCart();
    // Verify cart page is loaded
    await cartPage.verifyCartPageIsLoaded();

    // Remove product from cart page
    await cartPage.removeProductFromCart(productId);

    // Verify cart is now empty
    await cartPage.verifyCartIsEmpty();
    // Log test success
    logger.pass('Product removed from cart page successfully');
  });

  /**
   * Test: Continue shopping from cart
   * Verifies that user can navigate back to inventory from cart page
   */
  test('should continue shopping from cart', async ({ page }) => {
    // Log test start
    logger.info('Test: Continue shopping from cart');

    // Add product to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);

    // Navigate to cart page
    await inventoryPage.goToCart();
    // Verify cart page is loaded
    await cartPage.verifyCartPageIsLoaded();

    // Click continue shopping button
    await cartPage.clickContinueShopping();

    // Verify we're back on inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();
    // Log test success
    logger.pass('Successfully returned to inventory from cart');
  });

  /**
   * Test: Cart count persists across navigation
   * Verifies that cart items remain when navigating between pages
   */
  test('should maintain cart count across navigation', async ({ page }) => {
    // Log test start
    logger.info('Test: Cart count persists across navigation');

    // Define products to add (backpack, bike light, bolt shirt)
    const productIds = [PRODUCTS.BACKPACK.id, PRODUCTS.BIKE_LIGHT.id, PRODUCTS.BOLT_SHIRT.id];

    // Add multiple products to cart
    for (const productId of productIds) {
      // Add current product to cart
      await inventoryPage.addProductToCart(productId);
    }

    // Navigate to cart page
    await inventoryPage.goToCart();
    // Get cart item count on cart page
    const cartCount = await cartPage.getCartItemCount();
    // Assert cart has all 3 items
    expect(cartCount).toBe(productIds.length);

    // Click continue shopping to return to inventory
    await cartPage.clickContinueShopping();

    // Get cart count on inventory page (via badge)
    const updatedCartCount = await inventoryPage.getCartItemCount();
    // Assert cart still shows all 3 items
    expect(updatedCartCount).toBe(productIds.length);
    // Log test success
    logger.pass('Cart count maintained across navigation');
  });
});

/**
 * Inventory Tests
 * Tests for product listing and display functionality
 */
test.describe('Inventory Tests @smoke', () => {
  // Declare page objects that will be initialized in beforeEach
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  /**
   * Setup before each test
   * Logs in user and verifies inventory page is loaded
   */
  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    // Navigate to login page
    await loginPage.navigate();
    // Get test user credentials
    const user = getTestUser('VALID_USER');
    // Perform login
    await loginPage.login(user.username, user.password);

    // Verify inventory page is loaded after login
    await inventoryPage.verifyInventoryPageIsLoaded();
  });

  /**
   * Test: Display all products
   * Verifies that products are displayed on inventory page
   */
  test('should display all products on inventory page', async ({ page }) => {
    // Log test start
    logger.info('Test: Verify all products displayed');

    // Get total number of products on page
    const productCount = await inventoryPage.getProductCount();
    // Assert at least one product is displayed
    expect(productCount).toBeGreaterThan(0);
    // Log test success with product count
    logger.pass(`${productCount} products displayed on inventory page`);
  });

  /**
   * Test: Get all product names
   * Verifies that all product names can be retrieved
   */
  test('should get all product names', async ({ page }) => {
    // Log test start
    logger.info('Test: Get all product names');

    // Get array of all product names displayed
    const productNames = await inventoryPage.getAllProductNames();
    // Assert at least one product name is found
    expect(productNames.length).toBeGreaterThan(0);

    // Log info about each product found
    logger.info(`Found ${productNames.length} products:`);
    // Loop through all product names and log them
    productNames.forEach((name) => {
      // Log individual product name
      logger.info(`  - ${name}`);
    });

    // Log test success
    logger.pass('All product names retrieved successfully');
  });
});
