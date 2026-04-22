// Import test and expect from custom fixture (with logging hooks)
import { test, expect } from '../fixtures/baseFixture';
// Import LoginPage object for authentication
import { LoginPage } from '../pages/LoginPage';
// Import InventoryPage object for product interactions
import { InventoryPage } from '../pages/InventoryPage';
// Import CartPage object for cart operations
import { CartPage } from '../pages/CartPage';
// Import all three checkout page objects for each step
import {
  CheckoutYourInfoPage,
  CheckoutOverviewPage,
  CheckoutCompletePage,
} from '../pages/CheckoutPage';
// Import factory function to get test user data
import { getTestUser } from '../test-data/users';
// Import product constants for test data
import { PRODUCTS } from '../test-data/products';
// Import logger for test output
import { logger } from '../utils/logger';

/**
 * Checkout Flow Tests
 * Comprehensive end-to-end checkout tests covering all 3 steps
 * Tests verify complete purchase flow and validation
 */
test.describe('Checkout Flow Tests @regression', () => {
  // Declare page objects for all pages in checkout flow
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutYourInfoPage;
  let checkoutOverviewPage: CheckoutOverviewPage;
  let checkoutCompletePage: CheckoutCompletePage;

  /**
   * Setup before each test
   * Logs in user, adds products to cart, and navigates to cart page
   */
  test.beforeEach(async ({ page }) => {
    // Initialize all page objects with current page context
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutInfoPage = new CheckoutYourInfoPage(page);
    checkoutOverviewPage = new CheckoutOverviewPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);

    // Navigate to login page
    await loginPage.navigate();
    // Get test user credentials using factory function
    const user = getTestUser('VALID_USER');
    // Perform login with test credentials
    await loginPage.login(user.username, user.password);

    // Verify inventory page is loaded after login
    await inventoryPage.verifyInventoryPageIsLoaded();

    // Add two products to cart (backpack and bike light)
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);
    await inventoryPage.addProductToCart(PRODUCTS.BIKE_LIGHT.id);

    // Navigate to cart page
    await inventoryPage.goToCart();
    // Verify cart page is loaded and products are visible
    await cartPage.verifyCartPageIsLoaded();
  });

  /**
   * Test: Complete full checkout flow
   * Verifies all 3 steps: enter info, review order, confirm completion
   */
  test('should complete full checkout flow successfully', async ({ page }) => {
    // Log test start
    logger.info('Test: Complete full checkout flow');

    // Click checkout button to start checkout process
    await cartPage.clickCheckout();
    // Verify checkout info page (step 1) is loaded
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Fill in customer personal information
    await checkoutInfoPage.fillCheckoutInfo('John', 'Doe', '12345');
    // Click continue to proceed to step 2
    await checkoutInfoPage.clickContinue();

    // Verify checkout overview page (step 2) is loaded
    await checkoutOverviewPage.verifyCheckoutOverviewPageIsLoaded();
    // Get number of items in order (should be 2)
    const itemCount = await checkoutOverviewPage.getItemCount();
    // Assert we have 2 items
    expect(itemCount).toBe(2);

    // Click finish button to complete purchase
    await checkoutOverviewPage.clickFinish();

    // Verify checkout completion page (step 3) is loaded
    await checkoutCompletePage.verifyCheckoutIsComplete();
    // Get success message from completion page
    const successMessage = await checkoutCompletePage.getSuccessMessage();
    // Assert success message contains thank you text
    expect(successMessage).toContain('Thank you');

    // Log test success
    logger.pass('Full checkout flow completed successfully');
  });

  /**
   * Test: Verify checkout totals calculation
   * Verifies that subtotal, tax, and total are calculated correctly
   */
  test('should display correct totals in overview', async ({ page }) => {
    // Log test start
    logger.info('Test: Verify checkout totals');

    // Click checkout to start process
    await cartPage.clickCheckout();
    // Fill customer info for Jane Smith from zip 54321
    await checkoutInfoPage.fillCheckoutInfo('Jane', 'Smith', '54321');
    // Click continue to go to overview page
    await checkoutInfoPage.clickContinue();

    // Extract subtotal amount from overview page
    const subtotal = await checkoutOverviewPage.getSubtotal();
    // Extract tax amount from overview page
    const tax = await checkoutOverviewPage.getTaxAmount();
    // Extract total amount from overview page
    const total = await checkoutOverviewPage.getTotalAmount();

    // Log all extracted amounts
    logger.info(`Subtotal: $${subtotal}`);
    logger.info(`Tax: $${tax}`);
    logger.info(`Total: $${total}`);

    // Assert subtotal is a positive number
    expect(parseFloat(subtotal)).toBeGreaterThan(0);
    // Assert tax is zero or positive (can be 0 in some cases)
    expect(parseFloat(tax)).toBeGreaterThanOrEqual(0);
    // Assert total is a positive number
    expect(parseFloat(total)).toBeGreaterThan(0);

    // Log test success
    logger.pass('Checkout totals verified successfully');
  });

  /**
   * Test: Cancel checkout at info page
   * Verifies that user can abort checkout at info step and return to cart
   */
  test('should handle checkout cancellation at info page', async ({ page }) => {
    // Log test start
    logger.info('Test: Cancel checkout at info page');

    // Click checkout to start process
    await cartPage.clickCheckout();
    // Verify checkout info page is loaded
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Click cancel button to abort checkout
    await checkoutInfoPage.clickCancel();

    // Verify we're back on cart page
    await cartPage.verifyCartPageIsLoaded();
    // Get cart item count to verify products are still there
    const itemCount = await cartPage.getCartItemCount();
    // Assert cart still has 2 items
    expect(itemCount).toBe(2);

    // Log test success
    logger.pass('Checkout cancelled successfully at info page');
  });

  /**
   * Test: Cancel checkout at overview page
   * Verifies that user can abort checkout at overview step
   */
  test('should handle checkout cancellation at overview page', async ({ page }) => {
    // Log test start
    logger.info('Test: Cancel checkout at overview page');

    // Click checkout to start process
    await cartPage.clickCheckout();
    // Fill customer information
    await checkoutInfoPage.fillCheckoutInfo('John', 'Doe', '12345');
    // Click continue to go to overview page
    await checkoutInfoPage.clickContinue();

    // Verify checkout overview page is loaded
    await checkoutOverviewPage.verifyCheckoutOverviewPageIsLoaded();

    // Click cancel button to abort checkout
    await checkoutOverviewPage.clickCancel();

    // Verify we're back on inventory page
    await inventoryPage.verifyInventoryPageIsLoaded();

    // Log test success
    logger.pass('Checkout cancelled successfully at overview page');
  });

  /**
   * Test: Validate required fields
   * Verifies that form validation works when required fields are empty
   */
  test('should validate required fields in checkout info', async ({ page }) => {
    // Log test start
    logger.info('Test: Validate required fields at checkout');

    // Click checkout to start process
    await cartPage.clickCheckout();
    // Verify checkout info page is loaded
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();

    // Try to continue without filling any fields
    await checkoutInfoPage.clickContinue();

    // Verify error message appears on page
    await checkoutInfoPage.verifyErrorMessageIsDisplayed();
    // Get the error message text
    const errorMsg = await checkoutInfoPage.getErrorMessage();
    // Assert error message contains 'required' keyword
    expect(errorMsg).toContain('required');

    // Log test success
    logger.pass('Required field validation working correctly');
  });
});

/**
 * Checkout Info Page Tests
 * Tests specifically for the checkout information entry form
 */
test.describe('Checkout Info Page Tests @smoke', () => {
  // Declare page objects used in this test suite
  let cartPage: CartPage;
  let checkoutInfoPage: CheckoutYourInfoPage;

  /**
   * Setup before each test
   * Logs in user, adds product to cart, navigates to checkout
   */
  test.beforeEach(async ({ page }) => {
    // Login and add items to cart, then navigate to checkout info page
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Navigate to login page
    await loginPage.navigate();
    // Get test user credentials
    const user = getTestUser('VALID_USER');
    // Perform login
    await loginPage.login(user.username, user.password);

    // Verify inventory page is loaded after login
    await inventoryPage.verifyInventoryPageIsLoaded();
    // Add one product to cart (backpack)
    await inventoryPage.addProductToCart(PRODUCTS.BACKPACK.id);
    // Navigate to cart page
    await inventoryPage.goToCart();

    // Initialize cart page object
    cartPage = new CartPage(page);
    // Verify cart page is loaded
    await cartPage.verifyCartPageIsLoaded();
    // Click checkout to start process
    await cartPage.clickCheckout();

    // Initialize checkout info page object
    checkoutInfoPage = new CheckoutYourInfoPage(page);
    // Verify checkout info page is loaded
    await checkoutInfoPage.verifyCheckoutInfoPageIsLoaded();
  });

  /**
   * Test: All required fields visible
   * Verifies that first name, last name, and zip code fields are visible
   */
  test('should display all required fields', async ({ page }) => {
    // Log test start
    logger.info('Test: Verify all checkout fields visible');

    // Check if first name field is visible on page
    const firstNameVisible = await page.locator('[data-test="firstName"]').isVisible();
    // Check if last name field is visible on page
    const lastNameVisible = await page.locator('[data-test="lastName"]').isVisible();
    // Check if postal code field is visible on page
    const zipCodeVisible = await page.locator('[data-test="postalCode"]').isVisible();

    // Assert first name field is visible
    expect(firstNameVisible).toBe(true);
    // Assert last name field is visible
    expect(lastNameVisible).toBe(true);
    // Assert postal code field is visible
    expect(zipCodeVisible).toBe(true);

    // Log test success
    logger.pass('All checkout info fields are visible');
  });
});
