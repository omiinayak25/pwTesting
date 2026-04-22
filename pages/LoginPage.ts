// Import Playwright Page type for page interactions
import { Page, expect } from '@playwright/test';
// Import BasePage class - LoginPage will inherit from this
import { BasePage } from './BasePage';
// Import logger utility for detailed logging
import { logger } from '../utils/logger';

/**
 * Login Page Object
 * Handles all login-related interactions and validations
 * Extends BasePage to inherit common page interaction methods
 */
export class LoginPage extends BasePage {
  // Define CSS selector for username input field (readonly to prevent changes)
  private readonly usernameField = '#user-name';
  // Define CSS selector for password input field
  private readonly passwordField = '#password';
  // Define CSS selector for login button
  private readonly loginButton = '#login-button';
  // Define CSS selector for error message display
  private readonly errorMessage = '[data-test="error"]';
  // Define CSS selector for login container (used to verify page loaded)
  private readonly loginContainer = '.login_container';

  // Constructor receives page object and passes it to parent BasePage
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   * Uses inherited navigate() method from BasePage with relative path
   */
  async navigate(): Promise<void> {
    // Log navigation attempt
    logger.info('Navigating to login page...');
    // Navigate to root URL (Playwright will use baseURL from config)
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    // Verify login page loaded by checking for login container
    await this.verifyLoginPageIsLoaded();
    // Log successful navigation
    logger.pass('Login page loaded successfully');
  }

  /**
   * Private method to verify login page is loaded
   * Uses inherited verifyElementVisible() method from BasePage
   */
  private async verifyLoginPageIsLoaded(): Promise<void> {
    // Call parent class method to verify login container is visible
    await this.verifyElementVisible(this.loginContainer, 'Login Container');
  }

  /**
   * Perform login with username and password
   * This is the main test action method
   * @param username - Username to enter in login form
   * @param password - Password to enter in login form
   */
  async login(username: string, password: string): Promise<void> {
    // Log the login attempt with username
    logger.info(`Attempting login with username: ${username}`);
    // Call inherited fill method to enter username (label for logging)
    await this.fill(this.usernameField, username, 'Username Field');
    // Call inherited fill method to enter password (label for logging)
    await this.fill(this.passwordField, password, 'Password Field');
    // Call inherited click method to click login button (label for logging)
    await this.click(this.loginButton, 'Login Button');
    // Wait for page navigation to complete after login attempt
    await this.waitForNavigation();
    // Log that login attempt completed
    logger.pass('Login attempt completed');
  }

  /**
   * Retrieve error message text from the page
   * Used to validate error messages in test assertions
   */
  async getErrorMessage(): Promise<string> {
    // Log action to retrieve error message
    logger.info('Retrieving error message...');
    // Call inherited getText method to extract error message text
    return await this.getText(this.errorMessage, 'Error Message');
  }

  /**
   * Assert that error message is displayed on page
   * Used in tests to verify error state
   */
  async verifyErrorMessageIsDisplayed(): Promise<void> {
    // Log verification action
    logger.info('Verifying error message is displayed...');
    // Call inherited method to verify error element is visible
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    // Log successful verification
    logger.pass('Error message is visible');
  }

  /**
   * Assert that error message contains specific text
   * Combines visibility check with text content validation
   * @param expectedText - Text that should be in error message
   */
  async verifyErrorMessageText(expectedText: string): Promise<void> {
    // Log what text we're expecting to see
    logger.info(`Verifying error message contains: ${expectedText}`);
    // First verify error message is visible on page
    await this.verifyErrorMessageIsDisplayed();
    // Then verify it contains the expected text using inherited method
    await this.verifyElementHasText(this.errorMessage, expectedText, 'Error Message');
    // Log successful verification
    logger.pass('Error message text verified');
  }

  /**
   * Check if username field is visible on page
   * Used to verify page loaded correctly
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    // Call inherited isVisible method and return result
    return await this.isVisible(this.usernameField, 'Username Field');
  }

  /**
   * Check if password field is visible on page
   * Used to verify page loaded correctly
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    // Call inherited isVisible method and return result
    return await this.isVisible(this.passwordField, 'Password Field');
  }

  /**
   * Check if login button is visible on page
   * Used to verify page loaded correctly
   */
  async isLoginButtonVisible(): Promise<boolean> {
    // Call inherited isVisible method and return result
    return await this.isVisible(this.loginButton, 'Login Button');
  }
}

