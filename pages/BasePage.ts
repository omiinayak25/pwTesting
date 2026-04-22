/**
 * Base Page Object
 * Provides common methods and patterns for all page objects
 */

import { Page, Locator, expect } from '@playwright/test';
import { logger } from '../utils/logger';
import { WaitUtils } from '../utils/waitUtils';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to the page
   */
  async navigate(url: string = ''): Promise<void> {
    const finalUrl = url || this.page.url();
    logger.info(`Navigating to: ${finalUrl}`);
    await this.page.goto(finalUrl, { waitUntil: 'domcontentloaded' });
    logger.pass(`Successfully navigated to: ${finalUrl}`);
  }

  /**
   * Fill input field
   */
  async fill(selector: string | Locator, value: string, label = 'Input'): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Filling ${label} with: ${value}`);
    await locator.fill(value);
    logger.pass(`${label} filled successfully`);
  }

  /**
   * Click element
   */
  async click(selector: string | Locator, label = 'Button'): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Clicking on ${label}...`);
    await locator.click();
    logger.pass(`${label} clicked successfully`);
  }

  /**
   * Get text from element
   */
  async getText(selector: string | Locator, label = 'Element'): Promise<string> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Getting text from ${label}...`);
    const text = await locator.textContent();
    logger.pass(`Text retrieved from ${label}: ${text}`);
    return text || '';
  }

  /**
   * Check if element is visible
   */
  async isVisible(selector: string | Locator, label = 'Element'): Promise<boolean> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Checking if ${label} is visible...`);
    const visible = await locator.isVisible();
    logger.info(`${label} visibility: ${visible}`);
    return visible;
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(
    selector: string | Locator,
    timeout = 10000,
    label = 'Element'
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    await WaitUtils.waitForElementVisible(locator, timeout, label);
  }

  /**
   * Verify element is visible
   */
  async verifyElementVisible(selector: string | Locator, label = 'Element'): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Verifying ${label} is visible...`);
    await expect(locator).toBeVisible();
    logger.pass(`${label} is visible`);
  }

  /**
   * Verify element has text
   */
  async verifyElementHasText(
    selector: string | Locator,
    expectedText: string,
    label = 'Element'
  ): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Verifying ${label} contains text: ${expectedText}`);
    await expect(locator).toContainText(expectedText);
    logger.pass(`${label} contains expected text`);
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    logger.info(`Current URL: ${this.page.url()}`);
    return this.page.url();
  }

  /**
   * Wait for navigation
   */
  async waitForNavigation(): Promise<void> {
    logger.info('Waiting for navigation...');
    await this.page.waitForLoadState('domcontentloaded');
    logger.pass('Page navigation completed');
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    logger.info(`Taking screenshot: ${name}`);
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
    logger.pass(`Screenshot saved: ${name}`);
  }

  /**
   * Hover over element
   */
  async hover(selector: string | Locator, label = 'Element'): Promise<void> {
    const locator = typeof selector === 'string' ? this.page.locator(selector) : selector;
    logger.info(`Hovering over ${label}...`);
    await locator.hover();
    logger.pass(`Hovered over ${label}`);
  }

  /**
   * Press key
   */
  async pressKey(key: string, label = 'Key'): Promise<void> {
    logger.info(`Pressing ${label}...`);
    await this.page.keyboard.press(key);
    logger.pass(`${label} pressed`);
  }
}
