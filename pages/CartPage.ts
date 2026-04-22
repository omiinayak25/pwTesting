// Import Playwright types for page automation and testing
import { Page, Locator } from '@playwright/test';
// Import BasePage parent class with common methods
import { BasePage } from './BasePage';
// Import logger utility for structured logging
import { logger } from '../utils/logger';

/**
 * Cart Page Object
 * Handles all shopping cart interactions and operations
 * Extends BasePage to inherit common functionality like click(), fill(), etc.
 * This page displays products that user has added to cart before checkout
 */
export class CartPage extends BasePage {
  // ============ CSS SELECTORS ============
  // Container element that wraps all cart items
  private readonly cartContainer = '.cart_list';
  // Individual cart item elements
  private readonly cartItems = '.cart_item';
  // Specific cart item by product ID using data-test attribute
  private readonly cartItem = (productId: string) => `[data-test="cart-item-${productId}"]`;
  // Price element within cart item
  private readonly itemPrice = '.inventory_item_price';
  // Quantity element within cart item
  private readonly itemQuantity = '.cart_quantity';
  // Continue shopping button to return to inventory page
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  // Checkout button to proceed to checkout flow
  private readonly checkoutButton = '[data-test="checkout"]';
  // Remove button for specific product - uses dynamic product ID
  private readonly removeButton = (productId: string) => `[data-test="remove-${productId}"]`;
  // Badge showing number of items in cart
  private readonly cartBadge = '.shopping_cart_badge';

  /**
   * Constructor
   * @param page - Playwright Page object for browser automation
   */
  constructor(page: Page) {
    // Call parent BasePage constructor to initialize page reference
    super(page);
  }

  /**
   * Verify shopping cart page is fully loaded
   * Asserts that the cart container is visible on page
   * Used as test setup to ensure page is ready for interactions
   */
  async verifyCartPageIsLoaded(): Promise<void> {
    // Log that we're starting cart page verification
    logger.info('Verifying cart page is loaded...');
    // Use inherited BasePage method to verify cart container is visible (20s timeout)
    await this.verifyElementVisible(this.cartContainer, 'Cart Container');
    // Log success when cart container is visible
    logger.pass('Cart page loaded successfully');
  }

  /**
   * Get current number of items displayed in cart
   * Counts all cart item elements
   * @returns Promise resolving to number of items in cart
   */
  async getCartItemCount(): Promise<number> {
    // Log that we're retrieving cart item count
    logger.info('Getting cart item count...');
    // Use Playwright count() method to get number of cart items
    const count = await this.page.locator(this.cartItems).count();
    // Log the cart item count
    logger.info(`Cart has ${count} items`);
    // Return the item count
    return count;
  }

  /**
   * Verify that specific product exists in cart
   * Asserts that cart item element for given product ID is visible
   * @param productId - Unique identifier of product to verify (e.g., 'sauce-labs-backpack')
   */
  async verifyProductInCart(productId: string): Promise<void> {
    // Log which product we're verifying is in cart
    logger.info(`Verifying product in cart: ${productId}`);
    // Use inherited verifyElementVisible() to assert product exists in cart (20s timeout)
    await this.verifyElementVisible(this.cartItem(productId), `Product ${productId} in Cart`);
    // Log success when product is found in cart
    logger.pass(`Product ${productId} is in cart`);
  }

  /**
   * Remove specific product from shopping cart
   * Clicks the remove button for the given product
   * @param productId - Unique identifier of product to remove (e.g., 'sauce-labs-backpack')
   */
  async removeProductFromCart(productId: string): Promise<void> {
    // Log which product is being removed
    logger.info(`Removing product from cart: ${productId}`);
    // Use inherited click() method with dynamic selector for this product's remove button
    await this.click(this.removeButton(productId), `Remove Button for ${productId}`);
    // Log success when product has been removed
    logger.pass(`Product ${productId} removed from cart`);
  }

  /**
   * Click continue shopping button to return to inventory
   * Navigates back to the products page from cart
   * Waits for navigation to complete before returning
   */
  async clickContinueShopping(): Promise<void> {
    // Log that we're clicking continue shopping
    logger.info('Clicking continue shopping...');
    // Use inherited click() method to click continue shopping button
    await this.click(this.continueShoppingButton, 'Continue Shopping Button');
    // Use inherited waitForNavigation() to wait for page to load
    await this.waitForNavigation();
    // Log success when navigated back to inventory
    logger.pass('Navigated back to inventory');
  }

  /**
   * Click checkout button to proceed to checkout flow
   * Starts the 3-step checkout process
   * Waits for navigation to checkout page to complete
   */
  async clickCheckout(): Promise<void> {
    // Log that we're clicking checkout button
    logger.info('Clicking checkout...');
    // Use inherited click() method to click checkout button
    await this.click(this.checkoutButton, 'Checkout Button');
    // Use inherited waitForNavigation() to wait for checkout page to load
    await this.waitForNavigation();
    // Log success when checkout flow has started
    logger.pass('Proceeded to checkout');
  }

  /**
   * Get array of all product IDs currently in cart
   * Extracts product IDs from cart item data-test attributes
   * @returns Promise resolving to array of product ID strings
   */
  async getCartProductIds(): Promise<string[]> {
    // Log that we're fetching all product IDs from cart
    logger.info('Getting all product IDs in cart...');
    // Get all cart item elements as array
    const items = await this.page.locator(this.cartItems).all();
    // Initialize empty array to collect product IDs
    const ids: string[] = [];

    // Loop through each cart item element
    for (const item of items) {
      // Get the data-test attribute value from the cart item
      // Format is 'cart-item-{productId}'
      const id = await item.getAttribute('data-test');
      // If data-test attribute exists
      if (id) {
        // Remove 'cart-item-' prefix to extract just the product ID
        // Example: 'cart-item-sauce-labs-backpack' -> 'sauce-labs-backpack'
        ids.push(id.replace('cart-item-', ''));
      }
    }

    // Log how many products were found in cart
    logger.info(`Found ${ids.length} products in cart`);
    // Return array of product IDs
    return ids;
  }

  /**
   * Verify cart is empty
   */
  async verifyCartIsEmpty(): Promise<void> {
    logger.info('Verifying cart is empty...');
    const itemCount = await this.getCartItemCount();
    if (itemCount === 0) {
      logger.pass('Cart is empty');
    } else {
      throw new Error(`Expected cart to be empty but found ${itemCount} items`);
    }
  }
}
