import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Checkout Page Objects
 * Handles all checkout-related interactions
 */

/**
 * Checkout: Your Information Page
 */
export class CheckoutYourInfoPage extends BasePage {
  // Selectors
  private readonly firstNameField = '[data-test="firstName"]';
  private readonly lastNameField = '[data-test="lastName"]';
  private readonly zipCodeField = '[data-test="postalCode"]';
  private readonly continueButton = '[data-test="continue"]';
  private readonly cancelButton = '[data-test="cancel"]';
  private readonly errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify checkout info page is loaded
   */
  async verifyCheckoutInfoPageIsLoaded(): Promise<void> {
    logger.info('Verifying checkout info page is loaded...');
    await this.verifyElementVisible(this.firstNameField, 'First Name Field');
    logger.pass('Checkout info page loaded successfully');
  }

  /**
   * Fill checkout information
   */
  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    logger.info('Filling checkout information...');
    await this.fill(this.firstNameField, firstName, 'First Name');
    await this.fill(this.lastNameField, lastName, 'Last Name');
    await this.fill(this.zipCodeField, zipCode, 'Postal Code');
    logger.pass('Checkout information filled');
  }

  /**
   * Click continue to next step
   */
  async clickContinue(): Promise<void> {
    logger.info('Clicking continue...');
    await this.click(this.continueButton, 'Continue Button');
    await this.waitForNavigation();
    logger.pass('Proceeded to next checkout step');
  }

  /**
   * Click cancel
   */
  async clickCancel(): Promise<void> {
    logger.info('Clicking cancel...');
    await this.click(this.cancelButton, 'Cancel Button');
    await this.waitForNavigation();
    logger.pass('Checkout cancelled');
  }

  /**
   * Verify error message is displayed
   */
  async verifyErrorMessageIsDisplayed(): Promise<void> {
    logger.info('Verifying error message...');
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    logger.pass('Error message displayed');
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string> {
    return await this.getText(this.errorMessage, 'Error Message');
  }
}

/**
 * Checkout: Overview Page
 */
export class CheckoutOverviewPage extends BasePage {
  // Selectors
  private readonly cartItems = '.cart_item';
  private readonly itemPrice = '.inventory_item_price';
  private readonly subtotal = '.summary_subtotal_label';
  private readonly tax = '.summary_tax_label';
  private readonly total = '.summary_total_label';
  private readonly finishButton = '[data-test="finish"]';
  private readonly cancelButton = '[data-test="cancel"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify checkout overview page is loaded
   */
  async verifyCheckoutOverviewPageIsLoaded(): Promise<void> {
    logger.info('Verifying checkout overview page is loaded...');
    await this.verifyElementVisible(this.cartItems, 'Cart Items');
    logger.pass('Checkout overview page loaded successfully');
  }

  /**
   * Get subtotal amount
   */
  async getSubtotal(): Promise<string> {
    logger.info('Getting subtotal...');
    const text = await this.getText(this.subtotal, 'Subtotal');
    const amount = text.split('$')[1];
    logger.info(`Subtotal: $${amount}`);
    return amount;
  }

  /**
   * Get tax amount
   */
  async getTaxAmount(): Promise<string> {
    logger.info('Getting tax amount...');
    const text = await this.getText(this.tax, 'Tax');
    const amount = text.split('$')[1];
    logger.info(`Tax: $${amount}`);
    return amount;
  }

  /**
   * Get total amount
   */
  async getTotalAmount(): Promise<string> {
    logger.info('Getting total amount...');
    const text = await this.getText(this.total, 'Total');
    const amount = text.split('$')[1];
    logger.info(`Total: $${amount}`);
    return amount;
  }

  /**
   * Click finish to complete purchase
   */
  async clickFinish(): Promise<void> {
    logger.info('Clicking finish to complete purchase...');
    await this.click(this.finishButton, 'Finish Button');
    await this.waitForNavigation();
    logger.pass('Purchase completed');
  }

  /**
   * Click cancel
   */
  async clickCancel(): Promise<void> {
    logger.info('Clicking cancel...');
    await this.click(this.cancelButton, 'Cancel Button');
    await this.waitForNavigation();
    logger.pass('Checkout cancelled');
  }

  /**
   * Get number of items in overview
   */
  async getItemCount(): Promise<number> {
    logger.info('Getting item count...');
    const count = await this.page.locator(this.cartItems).count();
    logger.info(`Item count: ${count}`);
    return count;
  }
}

/**
 * Checkout: Complete Page
 */
export class CheckoutCompletePage extends BasePage {
  // Selectors
  private readonly completeContainer = '.checkout_complete_container';
  private readonly successMessage = '.complete-header';
  private readonly backHomeButton = '[data-test="back-to-products"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify checkout is complete
   */
  async verifyCheckoutIsComplete(): Promise<void> {
    logger.info('Verifying checkout is complete...');
    await this.verifyElementVisible(this.completeContainer, 'Checkout Complete Container');
    logger.pass('Checkout completed successfully');
  }

  /**
   * Get success message
   */
  async getSuccessMessage(): Promise<string> {
    return await this.getText(this.successMessage, 'Success Message');
  }

  /**
   * Click back to home
   */
  async clickBackToHome(): Promise<void> {
    logger.info('Clicking back to home...');
    await this.click(this.backHomeButton, 'Back to Products Button');
    await this.waitForNavigation();
    logger.pass('Navigated back to products');
  }
}
