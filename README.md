# shopify-client-core

Delivers maximum call throughput using bursts and throttling techniques


1. Define a shop  
``` ts
let shop = new Shopify(config['store-1']);
```

2. Get the call limit  
``` ts
let callLimit = await getCallLimit(shop, true);
```  
**Shopify Basic** - 40 call bursts, replenishes at 2 requests per second  
**Shopify Plus** - 80 call bursts, replenishes at 4 requests per second  





## Operations

### Fetch
``` ts
let resources = await fetchResource(shop, shop.product, callLimit);
```

### Create
``` ts
let newProduct: CreateableResourceObject<Shopify.IProduct> = {
  title: `Test Product`,
  options: [{ name: 'Size' }],
  variants: [
    {
      option1: 'S',
      price: '9.99',
      fulfillment_service: 'manual',
      inventory_management: 'shopify',
      inventory_quantity: 1
    },
  ]
};

await createResources(shop, shop.product, callLimit, [newProduct]);
```


## Benchmark

**Fetch:** 60,000 resources in < 1 minute  
**Create, Delete & Update:** 3,200 resources in < 1 minute

