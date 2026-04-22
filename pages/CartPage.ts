import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Cart Page Object
 * Handles all shopping cart interactions
 */
export class CartPage extends BasePage {
  // Selectors
  private readonly cartContainer = '.cart_list';
  private readonly cartItems = '.cart_item';
  private readonly cartItem = (productId: string) => `[data-test="cart-item-${productId}"]`;
  private readonly itemPrice = '.inventory_item_price';
  private readonly itemQuantity = '.cart_quantity';
  private readonly continueShoppingButton = '[data-test="continue-shopping"]';
  private readonly checkoutButton = '[data-test="checkout"]';
  private readonly removeButton = (productId: string) => `[data-test="remove-${productId}"]`;
  private readonly cartBadge = '.shopping_cart_badge';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Verify cart page is loaded
   */
  async verifyCartPageIsLoaded(): Promise<void> {
    logger.info('Verifying cart page is loaded...');
    await this.verifyElementVisible(this.cartContainer, 'Cart Container');
    logger.pass('Cart page loaded successfully');
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    logger.info('Getting cart item count...');
    const count = await this.page.locator(this.cartItems).count();
    logger.info(`Cart has ${count} items`);
    return count;
  }

  /**
   * Verify product is in cart
   */
  async verifyProductInCart(productId: string): Promise<void> {
    logger.info(`Verifying product in cart: ${productId}`);
    await this.verifyElementVisible(this.cartItem(productId), `Product ${productId} in Cart`);
    logger.pass(`Product ${productId} is in cart`);
  }

  /**
   * Remove product from cart
   */
  async removeProductFromCart(productId: string): Promise<void> {
    logger.info(`Removing product from cart: ${productId}`);
    await this.click(this.removeButton(productId), `Remove Button for ${productId}`);
    logger.pass(`Product ${productId} removed from cart`);
  }

  /**
   * Click continue shopping
   */
  async clickContinueShopping(): Promise<void> {
    logger.info('Clicking continue shopping...');
    await this.click(this.continueShoppingButton, 'Continue Shopping Button');
    await this.waitForNavigation();
    logger.pass('Navigated back to inventory');
  }

  /**
   * Click checkout
   */
  async clickCheckout(): Promise<void> {
    logger.info('Clicking checkout...');
    await this.click(this.checkoutButton, 'Checkout Button');
    await this.waitForNavigation();
    logger.pass('Proceeded to checkout');
  }

  /**
   * Get all product IDs in cart
   */
  async getCartProductIds(): Promise<string[]> {
    logger.info('Getting all product IDs in cart...');
    const items = await this.page.locator(this.cartItems).all();
    const ids: string[] = [];

    for (const item of items) {
      const id = await item.getAttribute('data-test');
      if (id) {
        ids.push(id.replace('cart-item-', ''));
      }
    }

    logger.info(`Found ${ids.length} products in cart`);
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
