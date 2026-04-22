import { test, expect } from '../fixtures/baseFixture';
import { LoginPage } from '../pages/LoginPage';
import { getTestUser } from '../test-data/users';
import { logger } from '../utils/logger';

test.describe('Login Tests @smoke', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login successfully with valid credentials', async ({ page }) => {
    logger.info('Test: Login with valid credentials');

    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, user.password);

    // Verify successful login
    await expect(page).toHaveURL(/.*inventory/);
    logger.pass('User successfully logged in and redirected to inventory page');
  });

  test('should display error message with invalid credentials', async ({ page }) => {
    logger.info('Test: Login with invalid credentials');

    const user = getTestUser('INVALID_USER');
    await loginPage.login(user.username, user.password);

    // Verify error is displayed
    await loginPage.verifyErrorMessageIsDisplayed();
    const errorMsg = await loginPage.getErrorMessage();

    expect(errorMsg).toContain('Username and password do not match');
    logger.pass('Error message displayed for invalid credentials');
  });

  test('should display error with empty username', async ({ page }) => {
    logger.info('Test: Login with empty username');

    await loginPage.login('', 'password');

    // Verify error message
    await loginPage.verifyErrorMessageText('Username is required');
    logger.pass('Error message displayed for empty username');
  });

  test('should display error with empty password', async ({ page }) => {
    logger.info('Test: Login with empty password');

    const user = getTestUser('VALID_USER');
    await loginPage.login(user.username, '');

    // Verify error message
    await loginPage.verifyErrorMessageText('Password is required');
    logger.pass('Error message displayed for empty password');
  });

  test('should display error for locked out user', async ({ page }) => {
    logger.info('Test: Login with locked out user');

    const user = getTestUser('LOCKED_OUT_USER');
    await loginPage.login(user.username, user.password);

    // Verify locked out error
    await loginPage.verifyErrorMessageText('this user has been locked out');
    logger.pass('Error message displayed for locked out user');
  });

  test('should verify all login page elements are visible', async ({ page }) => {
    logger.info('Test: Verify login page elements');

    const usernameVisible = await loginPage.isUsernameFieldVisible();
    const passwordVisible = await loginPage.isPasswordFieldVisible();
    const loginButtonVisible = await loginPage.isLoginButtonVisible();

    expect(usernameVisible).toBe(true);
    expect(passwordVisible).toBe(true);
    expect(loginButtonVisible).toBe(true);

    logger.pass('All login page elements are visible');
  });

  test('should handle problem user login', async ({ page }) => {
    logger.info('Test: Login with problem user');

    const user = getTestUser('PROBLEM_USER');
    await loginPage.login(user.username, user.password);

    // Verify successful login despite being a problem user
    await expect(page).toHaveURL(/.*inventory/);
    logger.pass('Problem user logged in successfully');
  });

  test('should handle performance glitch user login', async ({ page }) => {
    logger.info('Test: Login with performance glitch user');

    const user = getTestUser('PERFORMANCE_GLITCH_USER');
    await loginPage.login(user.username, user.password);

    // Verify successful login
    await expect(page).toHaveURL(/.*inventory/);
    logger.pass('Performance glitch user logged in successfully');
  });
});

test.describe('Login Page Validation @regression', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should display consistent error messages', async ({ page }) => {
    logger.info('Test: Consistency of error messages');

    // Try login twice with same invalid credentials
    const user = getTestUser('INVALID_USER');

    await loginPage.login(user.username, user.password);
    const firstError = await loginPage.getErrorMessage();

    // Navigate back and try again
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
    const secondError = await loginPage.getErrorMessage();

    expect(firstError).toBe(secondError);
    logger.pass('Error messages are consistent');
  });

  test('should handle rapid login attempts', async ({ page }) => {
    logger.info('Test: Rapid login attempts');

    const user = getTestUser('VALID_USER');

    // First attempt
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/.*inventory/);

    // Log out and log in again
    await page.click('.bm-burger-button'); // Open menu
    await page.click('#logout_sidebar_link'); // Logout

    // Second attempt
    await loginPage.navigate();
    await loginPage.login(user.username, user.password);
    await expect(page).toHaveURL(/.*inventory/);

    logger.pass('Multiple rapid login attempts handled successfully');
  });

  test('should validate username field is case-sensitive or not', async ({ page }) => {
    logger.info('Test: Username case sensitivity');

    // Try with different case variations
    await loginPage.login('STANDARD_USER', 'secret_sauce');

    // Check if error is displayed (assuming username is case-sensitive)
    const isError = await loginPage.page.locator('[data-test="error"]').isVisible();
    logger.info(`Username case sensitivity check: Error displayed = ${isError}`);
  });
});
