// Import Playwright types for page automation and testing
import { Page, Locator, expect } from '@playwright/test';
// Import BasePage parent class with common methods
import { BasePage } from './BasePage';
// Import logger utility for structured logging
import { logger } from '../utils/logger';

/**
 * Inventory Page Object
 * Handles all product listing page interactions
 * Extends BasePage to inherit common functionality like click(), fill(), etc.
 * This page displays available products that users can add to cart
 */
export class InventoryPage extends BasePage {
  // ============ CSS SELECTORS ============
  // Container for all product items
  private readonly inventoryList = '.inventory_list';
  // Individual product item elements
  private readonly inventoryItems = '.inventory_item';
  // Product name element within each item
  private readonly productName = '.inventory_item_name';
  // Product price element within each item
  private readonly productPrice = '.inventory_item_price';
  // Add to cart button - uses dynamic product ID in data-test attribute
  private readonly addToCartButton = (productId: string) =>
    `[data-test="add-to-cart-${productId}"]`;
  // Remove from cart button - uses dynamic product ID in data-test attribute
  private readonly removeFromCartButton = (productId: string) =>
    `[data-test="remove-${productId}"]`;
  // Dropdown for sorting products by name/price
  private readonly sortDropdown = '[data-test="product-sort-container"]';
  // Badge showing number of items in cart
  private readonly cartBadge = '.shopping_cart_badge';
  // Link to navigate to shopping cart page
  private readonly cartLink = '.shopping_cart_link';

  /**
   * Constructor
   * @param page - Playwright Page object for browser automation
   */
  constructor(page: Page) {
    // Call parent BasePage constructor to initialize page reference
    super(page);
  }

  /**
   * Get all product elements as Locator collection
   * Returns Locator that matches all individual product items
   * @returns Locator for all product items on page
   */
  getAllProducts(): Locator {
    // Create locator for all inventory items and return it
    return this.page.locator(this.inventoryItems);
  }

  /**
   * Verify inventory page is fully loaded
   * Asserts that the inventory list container is visible
   * Used as test setup to ensure page is ready for interactions
   */
  async verifyInventoryPageIsLoaded(): Promise<void> {
    // Log that we're starting inventory page verification
    logger.info('Verifying inventory page is loaded...');
    // Use inherited BasePage method to verify element is visible (20s timeout)
    await this.verifyElementVisible(this.inventoryList, 'Inventory List');
    // Log success when inventory list is visible
    logger.pass('Inventory page loaded successfully');
  }

  /**
   * Get total count of products displayed on inventory page
   * Counts all individual product item elements
   * @returns Promise resolving to number of products
   */
  async getProductCount(): Promise<number> {
    // Log that we're retrieving product count
    logger.info('Getting product count...');
    // Use Playwright count() method to get number of matching elements
    const count = await this.page.locator(this.inventoryItems).count();
    // Log the resulting count for debugging
    logger.info(`Product count: ${count}`);
    // Return the count to caller
    return count;
  }

  /**
   * Add specific product to shopping cart
   * Clicks the 'Add to Cart' button for the given product
   * @param productId - Unique identifier of product to add (e.g., 'sauce-labs-backpack')
   */
  async addProductToCart(productId: string): Promise<void> {
    // Log which product is being added with its ID
    logger.info(`Adding product to cart: ${productId}`);
    // Use inherited click() method with dynamic selector for this product's add button
    await this.click(this.addToCartButton(productId), `Add to Cart Button for ${productId}`);
    // Log success when product has been added
    logger.pass(`Product ${productId} added to cart`);
  }

  /**
   * Remove specific product from shopping cart
   * Clicks the 'Remove' button for the given product
   * @param productId - Unique identifier of product to remove (e.g., 'sauce-labs-backpack')
   */
  async removeProductFromCart(productId: string): Promise<void> {
    // Log which product is being removed with its ID
    logger.info(`Removing product from cart: ${productId}`);
    // Use inherited click() method with dynamic selector for this product's remove button
    await this.click(this.removeFromCartButton(productId), `Remove Button for ${productId}`);
    // Log success when product has been removed
    logger.pass(`Product ${productId} removed from cart`);
  }

  /**
   * Get current number of items in shopping cart
   * Reads the badge number on cart icon
   * @returns Promise resolving to cart item count (0 if badge not visible)
   */
  async getCartItemCount(): Promise<number> {
    // Log that we're retrieving cart item count
    logger.info('Getting cart item count...');
    // Create locator for the cart badge element
    const badge = this.page.locator(this.cartBadge);
    // Check if badge is visible (badge only shows when cart has items)
    const isVisible = await badge.isVisible();

    // If badge is not visible, cart is empty
    if (!isVisible) {
      // Log that badge is not visible and count is 0
      logger.info('Cart badge not visible, count is 0');
      // Return 0 for empty cart
      return 0;
    }

    // Get badge text and convert to integer (fallback to 0 if parsing fails)
    const count = parseInt(await badge.textContent(), 10) || 0;
    // Log the current cart item count
    logger.info(`Cart item count: ${count}`);
    // Return the cart count
    return count;
  }

  /**
   * Sort products on inventory page
   * Changes the sort order via dropdown
   * @param sortOption - Sort option: 'az' (A to Z), 'za' (Z to A), 'lohi' (price low to high), 'hilo' (price high to low)
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    // Log which sort option is being applied
    logger.info(`Sorting products by: ${sortOption}`);
    // Create map of sort codes to human-readable descriptions for logging
    const sortMap = {
      az: 'Name (A to Z)',
      za: 'Name (Z to A)',
      lohi: 'Price (low to high)',
      hilo: 'Price (high to low)',
    };
    // Click on the sort dropdown to open it
    await this.click(this.sortDropdown, 'Sort Dropdown');
    // Use Playwright selectOption to select the sort option by value
    await this.page.selectOption(this.sortDropdown, sortOption);
    // Log success with human-readable sort option description
    logger.pass(`Products sorted by: ${sortMap[sortOption]}`);
  }

  /**
   * Click on a product by its display name
   * Uses CSS has-text selector to find product by name and click its link
   * @param productName - Display name of product to click (e.g., 'Sauce Labs Backpack')
   */
  async clickProductByName(productName: string): Promise<void> {
    // Log which product name is being clicked
    logger.info(`Clicking on product: ${productName}`);
    // Create locator using :has-text() pseudo-selector to find product item containing text
    // Then locate the link within that product item
    const productLink = this.page.locator(`.inventory_item:has-text("${productName}") a`);
    // Click the product link to navigate to product detail page
    await productLink.click();
    // Log success when product has been clicked
    logger.pass(`Clicked on product: ${productName}`);
  }

  /**
   * Get array of all product names currently displayed
   * Retrieves text content from all product name elements
   * @returns Promise resolving to array of product name strings
   */
  async getAllProductNames(): Promise<string[]> {
    // Log that we're fetching all product names
    logger.info('Getting all product names...');
    // Use allTextContents() to get text from all matching product name elements
    const names = await this.page.locator(this.productName).allTextContents();
    // Log how many product names were found
    logger.info(`Found ${names.length} products`);
    // Return array of product names
    return names;
  }

  /**
   * Navigate to shopping cart page
   * Clicks the cart link/icon in page header
   * Waits for navigation to complete before returning
   */
  async goToCart(): Promise<void> {
    // Log that we're navigating to cart
    logger.info('Navigating to cart...');
    // Use inherited click() method to click cart link
    await this.click(this.cartLink, 'Cart Link');
    // Use inherited waitForNavigation() to wait for cart page to load
    await this.waitForNavigation();
    // Log success when navigation to cart is complete
    logger.pass('Navigated to cart');
  }
}
