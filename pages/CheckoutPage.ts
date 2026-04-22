// Import Playwright Page type for browser automation
import { Page } from '@playwright/test';
// Import BasePage parent class with common methods
import { BasePage } from './BasePage';
// Import logger utility for structured logging
import { logger } from '../utils/logger';

/**
 * Checkout Page Objects Collection
 * Contains 3 separate page object classes for each step of the checkout process:
 * 1. CheckoutYourInfoPage - Step 1: Collect customer personal information
 * 2. CheckoutOverviewPage - Step 2: Review order summary and totals
 * 3. CheckoutCompletePage - Step 3: Confirm successful order completion
 */

/**
 * Checkout: Your Information Page (Step 1)
 * First step of checkout where user enters personal information
 * Extends BasePage to inherit common functionality
 */
export class CheckoutYourInfoPage extends BasePage {
  // ============ CSS SELECTORS ============
  // First name input field
  private readonly firstNameField = '[data-test="firstName"]';
  // Last name input field
  private readonly lastNameField = '[data-test="lastName"]';
  // Postal code input field
  private readonly zipCodeField = '[data-test="postalCode"]';
  // Continue button to proceed to step 2
  private readonly continueButton = '[data-test="continue"]';
  // Cancel button to abort checkout
  private readonly cancelButton = '[data-test="cancel"]';
  // Error message element shown for validation errors
  private readonly errorMessage = '[data-test="error"]';

  /**
   * Constructor
   * @param page - Playwright Page object for browser automation
   */
  constructor(page: Page) {
    // Call parent BasePage constructor to initialize page reference
    super(page);
  }

  /**
   * Verify checkout information page is fully loaded
   * Asserts that the first name field is visible
   * Used as test setup to ensure page is ready for form input
   */
  async verifyCheckoutInfoPageIsLoaded(): Promise<void> {
    // Log that we're starting checkout info page verification
    logger.info('Verifying checkout info page is loaded...');
    // Use inherited BasePage method to verify first name field is visible (20s timeout)
    await this.verifyElementVisible(this.firstNameField, 'First Name Field');
    // Log success when first name field is visible
    logger.pass('Checkout info page loaded successfully');
  }

  /**
   * Fill all checkout personal information fields
   * Inputs first name, last name, and postal code
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param zipCode - Customer's postal/zip code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, zipCode: string): Promise<void> {
    // Log that we're filling checkout information
    logger.info('Filling checkout information...');
    // Use inherited fill() method to input first name into first name field
    await this.fill(this.firstNameField, firstName, 'First Name');
    // Use inherited fill() method to input last name into last name field
    await this.fill(this.lastNameField, lastName, 'Last Name');
    // Use inherited fill() method to input postal code into postal code field
    await this.fill(this.zipCodeField, zipCode, 'Postal Code');
    // Log success when all fields have been filled
    logger.pass('Checkout information filled');
  }

  /**
   * Click continue button to proceed to checkout overview (step 2)
   * Submits the personal information form
   * Waits for navigation to next page to complete
   */
  async clickContinue(): Promise<void> {
    // Log that we're clicking continue button
    logger.info('Clicking continue...');
    // Use inherited click() method to click continue button
    await this.click(this.continueButton, 'Continue Button');
    // Use inherited waitForNavigation() to wait for checkout overview page to load
    await this.waitForNavigation();
    // Log success when navigation to next checkout step is complete
    logger.pass('Proceeded to next checkout step');
  }

  /**
   * Click cancel button to abort checkout
   * Returns to shopping cart or inventory depending on implementation
   * Waits for navigation away from checkout page
   */
  async clickCancel(): Promise<void> {
    // Log that we're clicking cancel button
    logger.info('Clicking cancel...');
    // Use inherited click() method to click cancel button
    await this.click(this.cancelButton, 'Cancel Button');
    // Use inherited waitForNavigation() to wait for checkout to be cancelled
    await this.waitForNavigation();
    // Log success when checkout has been cancelled
    logger.pass('Checkout cancelled');
  }

  /**
   * Verify error message is visible on page
   * Asserts that error message element is displayed
   * Used to validate form validation failures
   */
  async verifyErrorMessageIsDisplayed(): Promise<void> {
    // Log that we're verifying error message is displayed
    logger.info('Verifying error message...');
    // Use inherited verifyElementVisible() to assert error message is visible (20s timeout)
    await this.verifyElementVisible(this.errorMessage, 'Error Message');
    // Log success when error message is visible
    logger.pass('Error message displayed');
  }

  /**
   * Get the text content of error message
   * Returns error message string for assertion
   * @returns Promise resolving to error message text
   */
  async getErrorMessage(): Promise<string> {
    // Use inherited getText() method to extract error message text
    return await this.getText(this.errorMessage, 'Error Message');
  }
}

/**
 * Checkout: Overview Page (Step 2)
 * Second step of checkout where user reviews order summary
 * Displays items, prices, taxes, and total cost
 * Extends BasePage to inherit common functionality
 */
export class CheckoutOverviewPage extends BasePage {
  // ============ CSS SELECTORS ============
  // Individual cart/order items displayed in overview
  private readonly cartItems = '.cart_item';
  // Price elements for each item
  private readonly itemPrice = '.inventory_item_price';
  // Subtotal label (product total before tax)
  private readonly subtotal = '.summary_subtotal_label';
  // Tax amount label
  private readonly tax = '.summary_tax_label';
  // Final total label (subtotal + tax)
  private readonly total = '.summary_total_label';
  // Finish button to complete the purchase
  private readonly finishButton = '[data-test="finish"]';
  // Cancel button to abort checkout
  private readonly cancelButton = '[data-test="cancel"]';

  /**
   * Constructor
   * @param page - Playwright Page object for browser automation
   */
  constructor(page: Page) {
    // Call parent BasePage constructor to initialize page reference
    super(page);
  }

  /**
   * Verify checkout overview page is fully loaded
   * Asserts that cart items are visible on the page
   * Used as test setup to ensure order summary is displayed
   */
  async verifyCheckoutOverviewPageIsLoaded(): Promise<void> {
    // Log that we're starting checkout overview page verification
    logger.info('Verifying checkout overview page is loaded...');
    // Use inherited BasePage method to verify cart items are visible (20s timeout)
    await this.verifyElementVisible(this.cartItems, 'Cart Items');
    // Log success when cart items are visible
    logger.pass('Checkout overview page loaded successfully');
  }

  /**
   * Get subtotal amount (product total before tax)
   * Extracts numeric value from subtotal label
   * @returns Promise resolving to subtotal amount as string
   */
  async getSubtotal(): Promise<string> {
    // Log that we're retrieving subtotal
    logger.info('Getting subtotal...');
    // Use inherited getText() method to get full subtotal label text
    const text = await this.getText(this.subtotal, 'Subtotal');
    // Extract the numeric value after the $ sign
    // Example: 'Subtotal: $29.99' -> split by $ gives ['Subtotal: ', '29.99']
    const amount = text.split('$')[1];
    // Log the extracted subtotal amount
    logger.info(`Subtotal: $${amount}`);
    // Return just the numeric portion
    return amount;
  }

  /**
   * Get tax amount
   * Extracts numeric value from tax label
   * @returns Promise resolving to tax amount as string
   */
  async getTaxAmount(): Promise<string> {
    // Log that we're retrieving tax amount
    logger.info('Getting tax amount...');
    // Use inherited getText() method to get full tax label text
    const text = await this.getText(this.tax, 'Tax');
    // Extract the numeric value after the $ sign
    // Example: 'Tax: $2.40' -> split by $ gives ['Tax: ', '2.40']
    const amount = text.split('$')[1];
    // Log the extracted tax amount
    logger.info(`Tax: $${amount}`);
    // Return just the numeric portion
    return amount;
  }

  /**
   * Get total amount (subtotal + tax)
   * Extracts numeric value from total label
   * @returns Promise resolving to total amount as string
   */
  async getTotalAmount(): Promise<string> {
    // Log that we're retrieving total amount
    logger.info('Getting total amount...');
    // Use inherited getText() method to get full total label text
    const text = await this.getText(this.total, 'Total');
    // Extract the numeric value after the $ sign
    // Example: 'Total: $32.39' -> split by $ gives ['Total: ', '32.39']
    const amount = text.split('$')[1];
    // Log the extracted total amount
    logger.info(`Total: $${amount}`);
    // Return just the numeric portion
    return amount;
  }

  /**
   * Click finish button to complete purchase
   * Submits the order and proceeds to order confirmation page
   * Waits for navigation to confirmation page
   */
  async clickFinish(): Promise<void> {
    // Log that we're clicking finish button
    logger.info('Clicking finish to complete purchase...');
    // Use inherited click() method to click finish button
    await this.click(this.finishButton, 'Finish Button');
    // Use inherited waitForNavigation() to wait for confirmation page to load
    await this.waitForNavigation();
    // Log success when purchase has been completed
    logger.pass('Purchase completed');
  }

  /**
   * Click cancel button to abort checkout
   * Returns from checkout overview to previous step or inventory
   * Waits for navigation away from checkout
   */
  async clickCancel(): Promise<void> {
    // Log that we're clicking cancel button
    logger.info('Clicking cancel...');
    // Use inherited click() method to click cancel button
    await this.click(this.cancelButton, 'Cancel Button');
    // Use inherited waitForNavigation() to wait for checkout to be cancelled
    await this.waitForNavigation();
    // Log success when checkout has been cancelled
    logger.pass('Checkout cancelled');
  }

  /**
   * Get number of items in checkout overview
   * Counts all cart items displayed in order summary
   * @returns Promise resolving to number of items
   */
  async getItemCount(): Promise<number> {
    // Log that we're retrieving item count
    logger.info('Getting item count...');
    // Use Playwright count() method to get number of cart items
    const count = await this.page.locator(this.cartItems).count();
    // Log the item count
    logger.info(`Item count: ${count}`);
    // Return the count
    return count;
  }
}

/**
 * Checkout: Complete Page (Step 3)
 * Final step of checkout - order confirmation page
 * Confirms successful order placement and displays success message
 * Extends BasePage to inherit common functionality
 */
export class CheckoutCompletePage extends BasePage {
  // ============ CSS SELECTORS ============
  // Container element for the checkout completion page
  private readonly completeContainer = '.checkout_complete_container';
  // Success message header showing order confirmation
  private readonly successMessage = '.complete-header';
  // Button to return to products page
  private readonly backHomeButton = '[data-test="back-to-products"]';

  /**
   * Constructor
   * @param page - Playwright Page object for browser automation
   */
  constructor(page: Page) {
    // Call parent BasePage constructor to initialize page reference
    super(page);
  }

  /**
   * Verify checkout is complete
   * Asserts that the checkout completion container is visible
   * Confirms that order was successfully placed
   */
  async verifyCheckoutIsComplete(): Promise<void> {
    // Log that we're verifying checkout completion
    logger.info('Verifying checkout is complete...');
    // Use inherited BasePage method to verify completion container is visible (20s timeout)
    await this.verifyElementVisible(this.completeContainer, 'Checkout Complete Container');
    // Log success when checkout completion is confirmed
    logger.pass('Checkout completed successfully');
  }

  /**
   * Get the success message text from confirmation page
   * Extracts and returns the success message shown to user
   * @returns Promise resolving to success message string
   */
  async getSuccessMessage(): Promise<string> {
    // Use inherited getText() method to extract success message text
    return await this.getText(this.successMessage, 'Success Message');
  }

  /**
   * Click back to products button to return to inventory
   * Navigates from order confirmation back to shopping page
   * Waits for navigation to complete before returning
   */
  async clickBackToHome(): Promise<void> {
    // Log that we're clicking back to home/products button
    logger.info('Clicking back to home...');
    // Use inherited click() method to click back to products button
    await this.click(this.backHomeButton, 'Back to Products Button');
    // Use inherited waitForNavigation() to wait for products page to load
    await this.waitForNavigation();
    // Log success when navigation back to products is complete
    logger.pass('Navigated back to products');
  }
}
