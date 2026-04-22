// Import test function and expect assertion from Playwright
import { test as base, expect, Page } from '@playwright/test';
// Import logger utility for logging test lifecycle events
import { logger } from '../utils/logger';

// Export expect so tests can use it directly from fixture imports
export { expect };

/**
 * Extended Test Fixture
 * Provides enhanced setup/teardown with logging and utilities
 * This fixture is used as the base test for all tests in the project
 * It adds logging for test lifecycle and screenshot capture on failure
 */
export const test = base.extend<{
  context: any; // Custom context object (can be extended with additional fixtures)
}>({});

/**
 * GLOBAL BEFORE EACH HOOK
 * Runs before each individual test
 * Used for setup actions that need to run for every test
 */
test.beforeEach(async ({ page }, testInfo) => {
  // Create visual separator in logs to mark test start
  logger.info(`\n${'='.repeat(60)}`);
  // Log the test name that's about to run
  logger.info(`Starting test: ${testInfo.title}`);
  // Create visual separator in logs
  logger.info(`${'='.repeat(60)}`);
});

/**
 * GLOBAL AFTER EACH HOOK
 * Runs after each individual test
 * Used for cleanup and failure reporting
 */
test.afterEach(async ({ page }, testInfo) => {
  // Log the final test status (passed/failed/skipped)
  logger.info(`Test Status: ${testInfo.status}`);

  // Check if test failed (status doesn't match expected status)
  if (testInfo.status !== testInfo.expectedStatus) {
    // Log failure with test name
    logger.fail(`Test failed: ${testInfo.title}`);

    // TRY to capture screenshot on failure
    try {
      // First check if page is still open (sometimes page closes before this)
      if (!page.isClosed()) {
        // Take a full-page screenshot with high quality
        const screenshot = await page.screenshot({
          fullPage: true, // Capture full scrollable page
        });

        // Attach screenshot to test report
        await testInfo.attach('failed-screenshot', {
          body: screenshot, // Screenshot binary data
          contentType: 'image/png', // Specify it's a PNG image
        });

        // Log that screenshot was captured
        logger.warn(`Screenshot captured for failed test`);
      }
    } catch (error) {
      // If screenshot capture fails, log the error (don't fail the test)
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`Failed to capture screenshot: ${errorMessage}`);
    }

    // TRACE CAPTURE: Only capture trace on CI environments
    if (process.env.CI) {
      try {
        // Attempt to capture trace of test execution
        const trace = await testInfo.captureTrace?.();
        // If trace exists, attach it to test report
        if (trace) {
          await testInfo.attach('trace', {
            body: trace, // Trace binary data
            contentType: 'application/zip', // Trace is a zip file
          });
          // Log that trace was captured
          logger.info('Trace captured for failed test');
        }
      } catch (error) {
        // If trace capture fails, log the error
        const errorMessage = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to capture trace: ${errorMessage}`);
      }
    }
  } else {
    // Test passed - log success
    logger.pass(`Test passed: ${testInfo.title}`);
  }

  // Create visual separator in logs to mark test end
  logger.info(`${'='.repeat(60)}\n`);
});
