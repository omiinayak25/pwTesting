/**
 * Base Page Object
 * Provides common methods and patterns for all page objects
 * This is the parent class that all page objects inherit from to reduce code duplication
 */

// Import Playwright test utilities for page interaction and assertions
import { Page, Locator, expect } from '@playwright/test';
// Import custom logger for detailed test execution logging
import { logger } from '../utils/logger';
// Import utility class for intelligent wait patterns
import { WaitUtils } from '../utils/waitUtils';

// Export BasePage class that serves as parent for all page objects
export class BasePage {
  // Store reference to the current page object (read-only to prevent reassignment)
  readonly page: Page;

  // Constructor: receives page object from Playwright and stores it
  constructor(page: Page) {
    // Assign the page to the instance variable for use in all methods
    this.page = page;
  }

  /**
   * Navigate to the page - handles URL navigation with proper wait strategy
   * @param url - Optional URL to navigate to (uses current URL if not provided)
   * @returns Promise that resolves when page navigation is complete
   */
  async navigate(url: string = ''): Promise<void> {
    // Use provided URL or default to current page URL (for reload scenarios)
    const finalUrl = url || this.page.url();
    // Log the navigation action for debugging purposes
    logger.info(`Navigating to: ${finalUrl}`);
    // Navigate to URL and wait until DOM content is loaded (not full page load)
    await this.page.goto(finalUrl, { waitUntil: 'domcontentloaded' });
    // Log successful navigation
    logger.pass(`Successfully navigated to: ${finalUrl}`);
  }

  /**
   * Fill input field with text - handles both selector strings and Locator objects
   * @param selector - CSS selector string or Playwright Locator object
   * @param value - Text value to fill into the input field
   * @param label - Friendly name for logging purposes (default: 'Input')
   * @returns Promise that resolves when field is filled
   */
  async fill(selector: string | Locator, value: string, label = 'Input'): Promise<void> {
    // Convert selector string to Locator object if needed (supports both formats)
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log what value is being filled and where
    logger.info(`Filling ${label} with: ${value}`);
    // Use Playwright fill method to clear and input text
    await locator.fill(value);
    // Log successful field fill
    logger.pass(`${label} filled successfully`);
  }

  /**
   * Click on an element - handles both selector strings and Locator objects
   * @param selector - CSS selector string or Playwright Locator object
   * @param label - Friendly name for logging purposes (default: 'Button')
   * @returns Promise that resolves when element is clicked
   */
  async click(selector: string | Locator, label = 'Button'): Promise<void> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log which element is being clicked
    logger.info(`Clicking on ${label}...`);
    // Perform click action on the element
    await locator.click();
    // Log successful click
    logger.pass(`${label} clicked successfully`);
  }

  /**
   * Extract text content from an element
   * @param selector - CSS selector string or Playwright Locator object
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves with the text content of the element
   */
  async getText(selector: string | Locator, label = 'Element'): Promise<string> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log text retrieval action
    logger.info(`Getting text from ${label}...`);
    // Get the text content from the element
    const text = await locator.textContent();
    // Log the retrieved text
    logger.pass(`Text retrieved from ${label}: ${text}`);
    // Return the text content, or empty string if null
    return text || '';
  }

  /**
   * Check if an element is visible on the page
   * @param selector - CSS selector string or Playwright Locator object
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves with boolean indicating visibility
   */
  async isVisible(selector: string | Locator, label = 'Element'): Promise<boolean> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log the visibility check action
    logger.info(`Checking if ${label} is visible...`);
    // Check if element is visible on the page
    const visible = await locator.isVisible();
    // Log the visibility result for debugging
    logger.info(`${label} visibility: ${visible}`);
    // Return the visibility status (true/false)
    return visible;
  }

  /**
   * Wait for element to become visible with timeout - delegates to utility class
   * @param selector - CSS selector string or Playwright Locator object
   * @param timeout - Maximum time to wait in milliseconds (default: 10000ms)
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves when element is visible or times out
   */
  async waitForElementVisible(
    selector: string | Locator,
    timeout = 10000,
    label = 'Element'
  ): Promise<void> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Delegate to WaitUtils class which handles the actual wait logic
    await WaitUtils.waitForElementVisible(locator, timeout, label);
  }

  /**
   * Assert that element is visible - used for test validation
   * @param selector - CSS selector string or Playwright Locator object
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves if assertion passes, throws if it fails
   */
  async verifyElementVisible(selector: string | Locator, label = 'Element'): Promise<void> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log the assertion action
    logger.info(`Verifying ${label} is visible...`);
    // Use Playwright expect to assert element is visible (throws if not)
    await expect(locator).toBeVisible();
    // Log successful assertion
    logger.pass(`${label} is visible`);
  }

  /**
   * Assert that element contains specific text - used for validation
   * @param selector - CSS selector string or Playwright Locator object
   * @param expectedText - Text that should be contained in the element
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves if assertion passes, throws if it fails
   */
  async verifyElementHasText(
    selector: string | Locator,
    expectedText: string,
    label = 'Element'
  ): Promise<void> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log what text we're looking for in which element
    logger.info(`Verifying ${label} contains text: ${expectedText}`);
    // Use Playwright expect to assert element contains the text (throws if not)
    await expect(locator).toContainText(expectedText);
    // Log successful text verification
    logger.pass(`${label} contains expected text`);
  }

  /**
   * Get the current URL of the page
   * @returns The current URL as a string
   */
  getCurrentUrl(): string {
    // Log and return the current page URL
    logger.info(`Current URL: ${this.page.url()}`);
    // Return the URL string
    return this.page.url();
  }

  /**
   * Wait for page navigation to complete
   * @returns Promise that resolves when page content is loaded
   */
  async waitForNavigation(): Promise<void> {
    // Log the wait action
    logger.info('Waiting for navigation...');
    // Wait for the page to reach 'domcontentloaded' state (DOM is ready)
    await this.page.waitForLoadState('domcontentloaded');
    // Log successful navigation completion
    logger.pass('Page navigation completed');
  }

  /**
   * Capture a full-page screenshot - useful for debugging and visual validation
   * @param name - Name of the screenshot file (saved as name.png)
   * @returns Promise that resolves when screenshot is saved
   */
  async takeScreenshot(name: string): Promise<void> {
    // Log screenshot action with filename
    logger.info(`Taking screenshot: ${name}`);
    // Take full page screenshot and save to screenshots directory
    await this.page.screenshot({
      path: `screenshots/${name}.png`, // File path where screenshot is saved
      fullPage: true, // Capture full scrollable page, not just viewport
    });
    // Log successful screenshot capture
    logger.pass(`Screenshot saved: ${name}`);
  }

  /**
   * Hover mouse over an element - triggers hover effects
   * @param selector - CSS selector string or Playwright Locator object
   * @param label - Friendly name for logging purposes (default: 'Element')
   * @returns Promise that resolves when hover action is complete
   */
  async hover(selector: string | Locator, label = 'Element'): Promise<void> {
    // Convert selector string to Locator object if needed
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    // Log the hover action
    logger.info(`Hovering over ${label}...`);
    // Perform hover action on the element
    await locator.hover();
    // Log successful hover
    logger.pass(`Hovered over ${label}`);
  }

  /**
   * Press a keyboard key - useful for keyboard interactions
   * @param key - Key name to press (e.g., 'Enter', 'Escape', 'ArrowDown')
   * @param label - Friendly name for logging purposes (default: 'Key')
   * @returns Promise that resolves when key press is complete
   */
  async pressKey(key: string, label = 'Key'): Promise<void> {
    // Log which key is being pressed
    logger.info(`Pressing ${label}...`);
    // Use Playwright keyboard API to press the specified key
    await this.page.keyboard.press(key);
    // Log successful key press
    logger.pass(`${label} pressed`);
  }
}
