/**
 * Wait Utilities
 * Provides reusable wait patterns for common scenarios
 */

import { Page, Locator } from '@playwright/test';
import { logger } from './logger';

export class WaitUtils {
  /**
   * Wait for element to be visible with logging
   */
  static async waitForElementVisible(
    element: Locator,
    timeout = 10000,
    elementName = 'Element'
  ): Promise<void> {
    logger.info(`Waiting for ${elementName} to be visible...`);
    await element.waitFor({ state: 'visible', timeout });
    logger.pass(`${elementName} is now visible`);
  }

  /**
   * Wait for element to be hidden with logging
   */
  static async waitForElementHidden(
    element: Locator,
    timeout = 10000,
    elementName = 'Element'
  ): Promise<void> {
    logger.info(`Waiting for ${elementName} to be hidden...`);
    await element.waitFor({ state: 'hidden', timeout });
    logger.pass(`${elementName} is now hidden`);
  }

  /**
   * Wait for URL to match pattern
   */
  static async waitForURL(page: Page, urlPattern: string | RegExp, timeout = 30000): Promise<void> {
    logger.info(`Waiting for URL to match: ${urlPattern}`);
    await page.waitForURL(urlPattern, { timeout });
    logger.pass(`URL matched: ${page.url()}`);
  }

  /**
   * Wait for function to return true
   */
  static async waitForCondition(
    condition: () => Promise<boolean> | boolean,
    timeout = 10000,
    pollInterval = 500,
    description = 'Condition'
  ): Promise<void> {
    logger.info(`Waiting for: ${description}`);
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
      const result = await condition();
      if (result) {
        logger.pass(`${description} condition met`);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }

    throw new Error(`${description} condition not met within ${timeout}ms`);
  }

  /**
   * Wait for network idle
   */
  static async waitForNetworkIdle(page: Page, timeout = 10000): Promise<void> {
    logger.info('Waiting for network to be idle...');
    await page.waitForLoadState('networkidle', { timeout });
    logger.pass('Network is idle');
  }
}
