import { test, expect } from '../fixtures/baseFixture';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import {
  CheckoutYourInfoPage,
  CheckoutOverviewPage,
  CheckoutCompletePage,
} from '../pages/CheckoutPage';
import { getTestUser } from '../test-data/users';
import { PRODUCTS } from '../test-data/products';
import { logger } from '../utils/logger';

/**
 * Checkout Flow Tests
 * Comprehensive end-to-end checkout tests
 */
test.describe('Checkout Flow Tests @regression', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutYourInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutYourInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    // Login
    await loginPage.navigate();
    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, user.password);

    // Verify inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();

    // Add products to cart
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT.id);

    // Navigate to cart
    await inventoryPage.goToCart();
    await cartPage.verifyCartPageIsLoaded();
  });

  test('should complete full checkout flow successfully', async ({ page }) => {
    logger.info('Test: Complete full checkout flow');

    // Click checkout
    await cartPage.clickCheckout();
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Fill checkout info
    await checkoutInfoPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutInfoPage.clickContinue();

    // Verify overview page
    await checkoutOverviewPage.verifyCheckoutOverviewPageIsLoaded();
    const itemCount = await checkoutOverviewPage.getItemCount();
    expect(itemCount).toBe(2);

    // Click finish
    await checkoutOverviewPage.clickFinish();

    // Verify order complete
    await checkoutCompletePage.verifyCheckoutIsComplete();
    const successMessage = await checkoutCompletePage.getSuccessMessage();
    expect(successMessage).toContain('Thank you');

    logger.pass('Full checkout flow completed successfully');
  });

  test('should display correct totals in overview', async ({ page }) => {
    logger.info('Test: Verify checkout totals');

    // Click checkout
    await cartPage.clickCheckout();
    await checkoutInfoPage.fillCheckoutInfo('Jane', 'Smith', '54321');
    await checkoutInfoPage.clickContinue();

    // Get totals
    const subtotal = await checkoutOverviewPage.getSubtotal();
    const tax = await checkoutOverviewPage.getTaxAmount();
    const total = await checkoutOverviewPage.getTotalAmount();

    logger.info(`Subtotal: $${subtotal}`);
    logger.info(`Tax: $${tax}`);
    logger.info(`Total: $${total}`);

    // Verify numbers are valid
    expect(parseFloat(subtotal)).toBeGreaterThan(0);
    expect(parseFloat(tax)).toBeGreaterThanOrEqual(0);
    expect(parseFloat(total)).toBeGreaterThan(0);

    logger.pass('Checkout totals verified successfully');
  });

  test('should handle checkout cancellation at info page', async ({ page }) => {
    logger.info('Test: Cancel checkout at info page');

    // Click checkout
    await cartPage.clickCheckout();
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Click cancel
    await checkoutInfoPage.clickCancel();

    // Verify back at cart
    await cartPage.verifyCartPageIsLoaded();
    const itemCount = await cartPage.getCartItemCount();
    expect(itemCount).toBe(2);

    logger.pass('Checkout cancelled successfully at info page');
  });

  test('should handle checkout cancellation at overview page', async ({ page }) => {
    logger.info('Test: Cancel checkout at overview page');

    // Click checkout
    await cartPage.clickCheckout();
    await checkoutInfoPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutInfoPage.clickContinue();

    // Verify overview page
    await checkoutOverviewPage.verifyCheckoutOverviewPageIsLoaded();

    // Click cancel
    await checkoutOverviewPage.clickCancel();

    // Verify back at inventory
    await inventoryPage.verifyInventoryPageIsLoaded();

    logger.pass('Checkout cancelled successfully at overview page');
  });

  test('should validate required fields in checkout info', async ({ page }) => {
    logger.info('Test: Validate required fields at checkout');

    // Click checkout
    await cartPage.clickCheckout();
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Try to continue without filling info
    await checkoutInfoPage.clickContinue();

    // Verify error message
    await checkoutInfoPage.verifyErrorMessageIsDisplayed();
    const errorMsg = await checkoutInfoPage.getErrorMessage();
    expect(errorMsg).toContain('required');

    logger.pass('Required field validation working correctly');
  });
});

test.describe('Checkout Info Page Tests @smoke', () => {
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutYourInfoPage;

  test.beforeEach(async ({ page }) => {
    // Login and add items, navigate to checkout
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    await loginPage.navigate();
    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, user.password);

    await inventoryPage.verifyInventoryPageIsLoaded();
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);
    await inventoryPage.goToCart();

    cartPage = new CartPage(page);
    await cartPage.verifyCartPageIsLoaded();
    await cartPage.clickCheckout();

    checkoutInfoPage = new CheckoutYourInfoPage(page);
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();
  });

  test('should display all required fields', async ({ page }) => {
    logger.info('Test: Verify all checkout fields visible');

    const firstNameVisible = await page.locator('[data-test="firstName"]').isVisible();
    const lastNameVisible = await page.locator('[data-test="lastName"]').isVisible();
    const zipCodeVisible = await page.locator('[data-test="postalCode"]').isVisible();

    expect(firstNameVisible).toBe(true);
    expect(lastNameVisible).toBe(true);
    expect(zipCodeVisible).toBe(true);

    logger.pass('All checkout info fields are visible');
  });
});
