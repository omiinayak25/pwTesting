/**
 * Test Product Data
 * Contains predefined products for e-commerce test scenarios
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const PRODUCTS = {
  BACKPACK: {
    id: 'sauce-labs-backpack',
    name: 'Sauce Labs Backpack',
    price: 29.99,
    description: 'carry.allTheThings() with the sleek, streamlined Sly Pack',
  } as Product,

  BIKE_LIGHT: {
    id: 'sauce-labs-bike-light',
    name: 'Sauce Labs Bike Light',
    price: 9.99,
    description:
      "A red light isn't the desired state in testing but it sure helps when riding your bike at night",
  } as Product,

  BOLT_SHIRT: {
    id: 'sauce-labs-bolt-t-shirt',
    name: 'Sauce Labs Bolt T-Shirt',
    price: 15.99,
    description: 'Get your testing superhero on with the Sauce Labs bolt T-shirt',
  } as Product,

  FLEECE_JACKET: {
    id: 'sauce-labs-fleece-jacket',
    name: 'Sauce Labs Fleece Jacket',
    price: 49.99,
    description: "It's not every day that you come across a midweight quarter-zip fleece jacket",
  } as Product,

  ONESIE: {
    id: 'sauce-labs-onesie',
    name: 'Sauce Labs Onesie',
    price: 7.99,
    description: "Kes roles just aren't the same without a red onesie",
  } as Product,

  T_SHIRT_RED: {
    id: 'test-allthethings-t-shirt-red',
    name: 'Test.allTheThings() T-Shirt (Red)',
    price: 15.99,
    description: 'This classic Sauce Labs t-shirt is perfect to wear when cashing in on the test',
  } as Product,
};

export const getProduct = (key: keyof typeof PRODUCTS): Product => {
  return PRODUCTS[key];
};

export const getProductPrice = (key: keyof typeof PRODUCTS): number => {
  return PRODUCTS[key].price;
};
