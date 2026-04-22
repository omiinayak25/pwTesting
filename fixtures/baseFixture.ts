import { test as base, expect, Page } from '@playwright/test';
import { logger } from '../utils/logger';

export { expect };

/**
 * Extended Test Fixture
 * Provides enhanced setup/teardown with logging and utilities
 */
export const test = base.extend<{
  context: any;
}>({});

/**
 * Global Before Each
 */
test.beforeEach(async ({ page }, testInfo) => {
  logger.info(`\n${'='.repeat(60)}`);
  logger.info(`Starting test: ${testInfo.title}`);
  logger.info(`${'='.repeat(60)}`);
});

/**
 * Global After Each
 */
test.afterEach(async ({ page }, testInfo) => {
  logger.info(`Test Status: ${testInfo.status}`);

  // Take screenshot on failure
  if (testInfo.status !== testInfo.expectedStatus) {
    logger.fail(`Test failed: ${testInfo.title}`);

    try {
      if (!page.isClosed()) {
        const screenshot = await page.screenshot({
          fullPage: true,
        });

        await testInfo.attach('failed-screenshot', {
          body: screenshot,
          contentType: 'image/png',
        });

        logger.warn(`Screenshot captured for failed test`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to capture screenshot: ${errorMessage}`);
    }

    // Capture trace on CI
    if (process.env.CI) {
      try {
        const trace = await testInfo.captureTrace?.();
        if (trace) {
          await testInfo.attach('trace', {
            body: trace,
            contentType: 'application/zip',
          });
          logger.info('Trace captured for failed test');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to capture trace: ${errorMessage}`);
      }
    }
  } else {
    logger.pass(`Test passed: ${testInfo.title}`);
  }

  logger.info(`${'='.repeat(60)}\n`);
});
