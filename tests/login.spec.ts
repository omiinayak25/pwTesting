// Import test function and expect assertion from custom fixture
import { test, expect } from '../fixtures/baseFixture';
// Import LoginPage class for page interactions
import { LoginPage } from '../pages/LoginPage';
// Import test user factory to get predefined test users
import { getTestUser } from '../test-data/users';
// Import logger utility for detailed logging
import { logger } from '../utils/logger';

/**
 * TEST SUITE: Login Tests @smoke
 * Tests marked with @smoke tag run quickly for rapid feedback
 * These tests validate core login functionality
 */
test.describe('Login Tests @smoke', () => {
  // Declare LoginPage variable that will be initialized in beforeEach
  let loginPage: LoginPage;

  /**
   * BEFORE EACH HOOK
   * Runs before every test in this describe block
   * Sets up the login page and navigates to it
   */
  test.beforeEach(async ({ page }) => {
    // Initialize LoginPage with the current page object
    loginPage = new LoginPage(page);
    // Navigate to login page before each test
    await loginPage.navigate();
  });

  /**
   * TEST: should login successfully with valid credentials
   * Tests the happy path - user can login with correct credentials
   */
  test('should login successfully with valid credentials', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with valid credentials');

    // Get valid user from test data factory
    const user = getTestUser('VALID_USER');
    // Perform login with valid credentials
    await loginPage.login(user.username, user.password);

    // ASSERTION 1: Verify URL changed to inventory page (indicates successful login)
    await expect(page).toHaveURL(/.*inventory/);
    // ASSERTION 2: Log test passed
    logger.pass('User successfully logged in and redirected to inventory page');
  });

  /**
   * TEST: should display error message with invalid credentials
   * Tests error handling - system shows error for wrong credentials
   */
  test('should display error message with invalid credentials', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with invalid credentials');

    // Get invalid user from test data factory
    const user = getTestUser('INVALID_USER');
    // Attempt login with invalid credentials
    await loginPage.login(user.username, user.password);

    // ASSERTION 1: Verify error message is displayed
    await loginPage.verifyErrorMessageIsDisplayed();
    // Get error message text for assertion
    const errorMsg = await loginPage.getErrorMessage();

    // ASSERTION 2: Verify error message contains expected text about credentials
    expect(errorMsg).toContain('Username and password do not match');
    // Log test passed
    logger.pass('Error message displayed for invalid credentials');
  });

  /**
   * TEST: should display error with empty username
   * Tests input validation - username field is required
   */
  test('should display error with empty username', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with empty username');

    // Attempt login with empty username and password
    await loginPage.login('', 'password');

    // ASSERTION: Verify error message mentions username is required
    await loginPage.verifyErrorMessageText('Username is required');
    // Log test passed
    logger.pass('Error message displayed for empty username');
  });

  /**
   * TEST: should display error with empty password
   * Tests input validation - password field is required
   */
  test('should display error with empty password', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with empty password');

    // Get valid user from test data (to verify username doesn't help without password)
    const user = getTestUser('VALID_USER');
    // Attempt login with valid username but empty password
    await loginPage.login(user.username, '');

    // ASSERTION: Verify error message mentions password is required
    await loginPage.verifyErrorMessageText('Password is required');
    // Log test passed
    logger.pass('Error message displayed for empty password');
  });

  /**
   * TEST: should display error for locked out user
   * Tests business logic - locked accounts should show specific error
   */
  test('should display error for locked out user', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with locked out user');

    // Get locked out user from test data factory
    const user = getTestUser('LOCKED_OUT_USER');
    // Attempt login with locked out account
    await loginPage.login(user.username, user.password);

    // ASSERTION: Verify error message mentions account is locked
    await loginPage.verifyErrorMessageText('this user has been locked out');
    // Log test passed
    logger.pass('Error message displayed for locked out user');
  });

  /**
   * TEST: should verify all login page elements are visible
   * Tests UI rendering - all required form elements should be present
   */
  test('should verify all login page elements are visible', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Verify login page elements');

    // Check if username field is visible
    const usernameVisible = await loginPage.isUsernameFieldVisible();
    // Check if password field is visible
    const passwordVisible = await loginPage.isPasswordFieldVisible();
    // Check if login button is visible
    const loginButtonVisible = await loginPage.isLoginButtonVisible();

    // ASSERTION 1: Username field should be visible
    expect(usernameVisible).toBe(true);
    // ASSERTION 2: Password field should be visible
    expect(passwordVisible).toBe(true);
    // ASSERTION 3: Login button should be visible
    expect(loginButtonVisible).toBe(true);

    // Log test passed
    logger.pass('All login page elements are visible');
  });

  /**
   * TEST: should handle problem user login
   * Tests edge case - special test user that might have UI glitches
   */
  test('should handle problem user login', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with problem user');

    // Get problem user from test data factory
    const user = getTestUser('PROBLEM_USER');
    // Attempt login despite being marked as "problem" user
    await loginPage.login(user.username, user.password);

    // ASSERTION: Verify login succeeds even for problem user
    await expect(page).toHaveURL(/.*inventory/);
    // Log test passed
    logger.pass('Problem user logged in successfully');
  });

  /**
   * TEST: should handle performance glitch user login
   * Tests edge case - user account with performance issues
   */
  test('should handle performance glitch user login', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Login with performance glitch user');

    // Get performance glitch user from test data factory
    const user = getTestUser('PERFORMANCE_GLITCH_USER');
    // Attempt login with performance glitch user
    await loginPage.login(user.username, user.password);

    // ASSERTION: Verify login succeeds despite performance issues
    await expect(page).toHaveURL(/.*inventory/);
    // Log test passed
    logger.pass('Performance glitch user logged in successfully');
  });
});

/**
 * TEST SUITE: Login Page Validation @regression
 * Tests marked with @regression tag are comprehensive validation tests
 * These tests run as part of full test suite but not in smoke tests
 */
test.describe('Login Page Validation @regression', () => {
  // Declare LoginPage variable for use in tests
  let loginPage: LoginPage;

  /**
   * BEFORE EACH HOOK
   * Runs before every test in this describe block
   */
  test.beforeEach(async ({ page }) => {
    // Initialize LoginPage for the test
    loginPage = new LoginPage(page);
    // Navigate to login page
    await loginPage.navigate();
  });

  /**
   * TEST: should display consistent error messages
   * Tests reliability - error messages should be the same on repeated attempts
   */
  test('should display consistent error messages', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Consistency of error messages');

    // Get invalid user from test data factory
    const user = getTestUser('INVALID_USER');

    // FIRST ATTEMPT: Try login and capture error message
    await loginPage.login(user.username, user.password);
    // Store first error message
    const firstError = await loginPage.getErrorMessage();

    // NAVIGATE BACK: Go back to login page for second attempt
    await loginPage.navigate();
    // SECOND ATTEMPT: Try login again with same credentials
    await loginPage.login(user.username, user.password);
    // Store second error message
    const secondError = await loginPage.getErrorMessage();

    // ASSERTION: Both error messages should be identical
    expect(firstError).toBe(secondError);
    // Log test passed
    logger.pass('Error messages are consistent');
  });

  /**
   * TEST: should handle rapid login attempts
   * Tests resilience - system should handle multiple quick login attempts
   */
  test('should handle rapid login attempts', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Rapid login attempts');

    // Get valid user from test data factory
    const user = getTestUser('VALID_USER');

    // FIRST LOGIN ATTEMPT: Login with valid credentials
    await loginPage.login(user.username, user.password);
    // ASSERTION 1: Verify first login succeeded
    await expect(page).toHaveURL(/.*inventory/);

    // LOGOUT: Click menu button to open sidebar
    await page.click('.bm-burger-button');
    // Click logout link from menu
    await page.click('#logout_sidebar_link');

    // SECOND LOGIN ATTEMPT: Navigate back to login page
    await loginPage.navigate();
    // Login again with same credentials
    await loginPage.login(user.username, user.password);
    // ASSERTION 2: Verify second login also succeeded
    await expect(page).toHaveURL(/.*inventory/);

    // Log test passed
    logger.pass('Multiple rapid login attempts handled successfully');
  });

  /**
   * TEST: should validate username field is case-sensitive or not
   * Tests case sensitivity - determines if login is case-sensitive
   */
  test('should validate username field case sensitivity', async ({ page }) => {
    // Log what this test is doing
    logger.info('Test: Username case sensitivity');

    // Try login with uppercase username (normal is lowercase)
    await loginPage.login('STANDARD_USER', 'secret_sauce');

    // Check if error is displayed (would indicate case-sensitive)
    const isError = await loginPage.page.locator('[data-test="error"]').isVisible();
    // Log the result for reference
    logger.info(`Username case sensitivity check: Error displayed = ${isError}`);
  });
});
