# shopify-client-core




**Fetch**
```
let resources = await fetchResource(shop, shop.product, callLimit);
```

**Create**
```
let newProduct: CreateableResourceObject<Shopify.IProduct> = {
  title: `Test Product`,
  options: [
    { name: 'Size' }
  ],
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

await createResources(shop, shop.product, callLimit, newProducts);
```



Solves 3 main issues that haven't been addressed by our current migration scripts:


### Generic
```
generic
```

### Type Safe




### Performance
Delivers maximum call throughput using bursts and throttling techniques


E.g.

Shopify Basic
  - 40 call bursts
  - replenishes at 2 requests per second

Shopify Plus
  - 80 call bursts
  - replenishes at 4 requests per second

