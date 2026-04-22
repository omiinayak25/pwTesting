import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

/**
 * Inventory Page Object
 * Handles all inventory/products page interactions
 */
export class InventoryPage extends BasePage {
  // Selectors
  private readonly inventoryList = '.inventory_list';
  private readonly inventoryItems = '.inventory_item';
  private readonly productName = '.inventory_item_name';
  private readonly productPrice = '.inventory_item_price';
  private readonly addToCartButton = (productId: string) =>
    `[data-test="add-to-cart-${productId}"]`;
  private readonly removeFromCartButton = (productId: string) =>
    `[data-test="remove-${productId}"]`;
  private readonly sortDropdown = '[data-test="product-sort-container"]';
  private readonly cartBadge = '.shopping_cart_badge';
  private readonly cartLink = '.shopping_cart_link';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Get all products as locators
   */
  getAllProducts(): Locator {
    return this.page.locator(this.inventoryItems);
  }

  /**
   * Verify inventory page is loaded
   */
  async verifyInventoryPageIsLoaded(): Promise<void> {
    logger.info('Verifying inventory page is loaded...');
    await this.verifyElementVisible(this.inventoryList, 'Inventory List');
    logger.pass('Inventory page loaded successfully');
  }

  /**
   * Get product count
   */
  async getProductCount(): Promise<number> {
    logger.info('Getting product count...');
    const count = await this.page.locator(this.inventoryItems).count();
    logger.info(`Product count: ${count}`);
    return count;
  }

  /**
   * Add product to cart by product ID
   */
  async addProductToCart(productId: string): Promise<void> {
    logger.info(`Adding product to cart: ${productId}`);
    await this.click(this.addToCartButton(productId), `Add to Cart Button for ${productId}`);
    logger.pass(`Product ${productId} added to cart`);
  }

  /**
   * Remove product from cart by product ID
   */
  async removeProductFromCart(productId: string): Promise<void> {
    logger.info(`Removing product from cart: ${productId}`);
    await this.click(this.removeFromCartButton(productId), `Remove Button for ${productId}`);
    logger.pass(`Product ${productId} removed from cart`);
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<number> {
    logger.info('Getting cart item count...');
    const badge = this.page.locator(this.cartBadge);
    const isVisible = await badge.isVisible();

    if (!isVisible) {
      logger.info('Cart badge not visible, count is 0');
      return 0;
    }

    const count = parseInt(await badge.textContent(), 10) || 0;
    logger.info(`Cart item count: ${count}`);
    return count;
  }

  /**
   * Sort products by option
   */
  async sortProducts(sortOption: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    logger.info(`Sorting products by: ${sortOption}`);
    const sortMap = {
      az: 'Name (A to Z)',
      za: 'Name (Z to A)',
      lohi: 'Price (low to high)',
      hilo: 'Price (high to low)',
    };
    await this.click(this.sortDropdown, 'Sort Dropdown');
    await this.page.selectOption(this.sortDropdown, sortOption);
    logger.pass(`Products sorted by: ${sortMap[sortOption]}`);
  }

  /**
   * Click on product by name
   */
  async clickProductByName(productName: string): Promise<void> {
    logger.info(`Clicking on product: ${productName}`);
    const productLink = this.page.locator(`.inventory_item:has-text("${productName}") a`);
    await productLink.click();
    logger.pass(`Clicked on product: ${productName}`);
  }

  /**
   * Get all product names
   */
  async getAllProductNames(): Promise<string[]> {
    logger.info('Getting all product names...');
    const names = await this.page.locator(this.productName).allTextContents();
    logger.info(`Found ${names.length} products`);
    return names;
  }

  /**
   * Go to cart
   */
  async goToCart(): Promise<void> {
    logger.info('Navigating to cart...');
    await this.click(this.cartLink, 'Cart Link');
    await this.waitForNavigation();
    logger.pass('Navigated to cart');
  }
}
