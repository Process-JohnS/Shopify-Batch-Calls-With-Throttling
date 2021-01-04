
import Shopify, { ICustomer, IProduct, IProductOption } from 'shopify-api-node';
import { performance } from 'perf_hooks';
import fs from 'fs';
import config from './config.json';
import { fetchResource } from './fetch';
import { createResource, createResources } from './create';
import { CreateableResourceObject } from './common/types';
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
  let newProduct2: CreateableResourceObject<IProduct> = {
    title: '[TEST] Process Product 2',
    options: [
      { name: 'Color' }
    ],
    variants: [
      { option1: 'Red', price: '9.99' },
      { option1: 'Green', price: '9.99' },
      { option1: 'Blue', price: '9.99' }
    ]
  }
  let newProduct3: CreateableResourceObject<IProduct> = {
    title: '[TEST] Process Product 3',
    options: [
      { name: 'Size' }
    ],
    variants: [
      { option1: 'S', price: '9.99' },
      { option1: 'M', price: '9.99' },
      { option1: 'L', price: '9.99' }
    ]
  }
  let createdProducts = await createResources(shop, shop.product, callLimit, [newProduct1, newProduct2, newProduct3]);
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

  fetchProducts();

})()

.catch(console.error);

