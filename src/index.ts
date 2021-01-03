
import Shopify from 'shopify-api-node';
import { performance } from 'perf_hooks';
import fs from 'fs';

import config from './config.json';

import { fetchResource } from './fetch';
import { getCallLimit } from './throttle';


(async () => {

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

})()

.catch(console.error);

