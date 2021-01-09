
import Shopify, { IProduct } from 'shopify-api-node';
import { performance } from 'perf_hooks';
import fs from 'fs';
import config from './config.json';
import { fetchResource } from './fetch';
import { createResource, createResources } from './create';
import { CreateableProductObject, CreateableResourceObject } from './common/types';
import { getCallLimit } from './throttle';


const fetchProducts = async () => {

  let t0 = performance.now();

  let shop = new Shopify(config['store-1']);

  let callLimit = await getCallLimit(shop, true);
  let resources = await fetchResource(shop, shop.product, callLimit);

  console.log(resources.length);

  let t1 = performance.now();
  console.log(`Fetch execution time: ${Math.ceil(t1 - t0)}ms`);

  let writePath = './products.json'
  fs.writeFileSync(writePath, JSON.stringify(resources, null, 2));
  console.log(`Written to ${writePath}`);
}


const createProducts = async () => {

  let t0 = performance.now();

  // DO NOT MODIFY WHEN CREATING RESOURCES
  let shop = new Shopify(config['store-1']);

  let callLimit = await getCallLimit(shop, false);

  let newProducts: CreateableProductObject[] = [];
  for (let i = 0; i < 100; i++) {
    let newProduct: CreateableResourceObject<IProduct> = {
      title: `[TEST] Process Product ${i}`,
      options: [
        { name: 'Size' },
        // { name: 'Size' },
        // { name: 'Size' }
      ],
      variants: [
        { option1: 'S', price: '9.99', fulfillment_service: 'manual', inventory_management: 'shopify', inventory_quantity: 0 },
        { option1: 'M', price: '9.99', fulfillment_service: 'manual', inventory_management: 'shopify', inventory_quantity: 5 },
        { option1: 'L', price: '9.99', fulfillment_service: 'manual', inventory_management: 'shopify', inventory_quantity: 10 }
      ]
    };
    newProducts.push(newProduct);
  }

  let createdProducts = await createResources(shop, shop.product, callLimit, newProducts);
  console.log(createdProducts);

  let t1 = performance.now();
  console.log(`Create products execution time: ${Math.ceil(t1 - t0)}ms`);
}

const createProduct = async () => {

  let t0 = performance.now();

  // DO NOT MODIFY WHEN CREATING RESOURCES
  let shop = new Shopify(config['store-1']);

  let callLimit = await getCallLimit(shop, true);

  let newProduct1: CreateableResourceObject<IProduct> = {
    title: '[TEST] Process Product 1',
    options: [
      { name: 'Size' }
    ],
    variants: [
      { option1: 'S', price: '9.99' },
      { option1: 'M', price: '9.99' },
      { option1: 'L', price: '9.99' }
    ]
  }

  let createdProduct = await createResource(shop, shop.product, callLimit, newProduct1);
  console.log(createdProduct);

  let t1 = performance.now();
  console.log(`Create product execution time: ${Math.ceil(t1 - t0)}ms`);
}



(async () => {

  createProducts();

})()

.catch(console.error);

