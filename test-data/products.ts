/**
 * Test Product Data
 * Contains predefined products for e-commerce test scenarios
 * Using a factory pattern allows tests to reference products by logical names
 */

// Define interface for type-safe product objects
export interface Product {
  id: string;       // Unique product identifier used in selectors
  name: string;     // Display name of the product
  price: number;    // Price for assertions and calculations
  description: string; // Product description for reference
}

// Export object containing all test products - centralized test data
export const PRODUCTS = {
  // Backpack product - lowest price, commonly used in tests
  BACKPACK: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack',
  } as Product,

  // Bike light product - low price, small item
  BIKE_LIGHT: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night",
  } as Product,

  // T-Shirt product - medium price item
  BOLT_SHIRT: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  } as Product,

  // Fleece Jacket - higher priced item for testing larger purchases
  FLEECE_JACKET: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket",
  } as Product,

  // Onesie - low price, unique item
  ONESIE: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description: "Kes roles just aren't the same without a red onesie",
  } as Product,

  // Red T-Shirt - medium price alternative to bolt shirt
  T_SHIRT_RED: {
    id: 'test-allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cashing in on the test',
  } as Product,
};

/**
 * Factory function to retrieve product by key
 * Usage: const product = getProduct('BACKPACK');
 * @param key - Key from PRODUCTS object
 * @returns Product object with id, name, price, description
 */
export const getProduct = (key: keyof typeof PRODUCTS): Product => {
  // Return the product object by key
  return PRODUCTS[key];
};

/**
 * Convenience function to get product price directly
 * Usage: const price = getProductPrice('BACKPACK');
 * @param key - Key from PRODUCTS object
 * @returns Price as number
 */
export const getProductPrice = (key: keyof typeof PRODUCTS): number => {
  // Return just the price for assertions
  return PRODUCTS[key].price;
};
