import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Login Page Object
 * Handles all login-related interactions
 */
export class LoginPage extends BasePage {
  // Selectors
  private readonly usernameField = '#user-name';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-button';
  private readonly errorMessage = '[data-test="error"]';
  private readonly loginContainer = '.login_container';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to login page
   */
  async navigate(): Promise<void> {
    logger.info('Navigating to login page...');
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.verifyLoginPageIsLoaded();
    logger.pass('Login page loaded successfully');
  }

  /**
   * Verify login page is loaded
   */
  private async verifyLoginPageIsLoaded(): Promise<void> {
    await this.verifyElementVisible(this.loginContainer, 'Login Container');
  }

  /**
   * Perform login with username and password
   */
  async login(username: string, password: string): Promise<void> {
    logger.info(`Attempting login with username: ${username}`);
    await this.fill(this.usernameField, username, 'Username Field');
    await this.fill(this.passwordField, password, 'Password Field');
    await this.click(this.loginButton, 'Login Button');
    await this.waitForNavigation();
    logger.pass('Login attempt completed');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    logger.info('Retrieving error message...');
    return await this.getText(this.errorMessage, 'Error Message');
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessageIsDisplayed(): Promise<void> {
    logger.info('Verifying error message is displayed...');
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    logger.pass('Error message is visible');
  }

  /**
   * Verify error message contains specific text
   */
  async verifyErrorMessageText(expectedText: string): Promise<void> {
    logger.info(`Verifying error message contains: ${expectedText}`);
    await this.verifyErrorMessageIsDisplayed();
    await this.verifyElementHasText(this.errorMessage, expectedText, 'Error Message');
    logger.pass('Error message text verified');
  }

  /**
   * Check if username field is visible
   */
  async isUsernameFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.usernameField, 'Username Field');
  }

  /**
   * Check if password field is visible
   */
  async isPasswordFieldVisible(): Promise<boolean> {
    return await this.isVisible(this.passwordField, 'Password Field');
  }

  /**
   * Check if login button is visible
   */
  async isLoginButtonVisible(): Promise<boolean> {
    return await this.isVisible(this.loginButton, 'Login Button');
  }
}
