
import Shopify from 'shopify-api-node';
import { delay } from './utils';
import { THROTTLE_DELAY_MS } from './constants';


export type ShopifyCallLimit = Shopify & {
  once: (event: 'callLimits', fn: (currentLimit: { max: number, remaining: number }) => void) => void;
  addListener: (event: 'callLimits', fn: (currentLimit: object) => void) => void;
}


export const getCallLimit = async (shop: ShopifyCallLimit, logging = false): Promise<number> => {
  let callLimit = -1;
  shop.once('callLimits', (currentLimit: { max: number }) => callLimit = currentLimit.max);
  await shop.product.count();
  if (logging) shop.addListener('callLimits', console.log);
  return callLimit;
}


export const throttle = async (shop: ShopifyCallLimit, callLimit: number) => {
  console.log('Waiting for call limit to reset...');

  let remainingCalls: number | undefined = undefined;
  while (!remainingCalls || remainingCalls < callLimit - 1) {
    shop.once('callLimits', ({ remaining }) => {
      console.log(`Remaining: ${remaining}`);
      remainingCalls = remaining;
    });
    await shop.product.count();
    delay(THROTTLE_DELAY_MS);
  }

  console.log('Ready for next calls to send.');
}

