
import Shopify from 'shopify-api-node';
import { ShopifyCallLimit } from '../common/types';
import { delay } from '../utils/utils';
import { THROTTLE_DELAY_MS } from '../common/constants';

/**
 *  Utilities to avoid the "429: Too Many Requests" error when performing
 *  asynchronous Shopify API calls
 */

/**
 *  Returns the call limimt of a Shopify store and can optionally
 *  enable logging to the console.
 * 
 *  The usual call limits for different Shopify plans:
 *  - Basic: 40
 *  - Plus: 80
 */
export const getCallLimit = async (shop: Shopify, logging = false): Promise<number> => {
  let callLimit = -1;
  (shop as ShopifyCallLimit).once('callLimits', (currentLimit: { max: number }) => callLimit = currentLimit.max);
  await shop.product.count();
  if (logging) (shop as ShopifyCallLimit).addListener('callLimits', console.log);
  return callLimit;
}


/**
 *  Wait between call bursts to allow the call limit to replenish
 *  before sending the next round of calls.
 */
export const throttle = async (shop: Shopify, callLimit: number) => {

  let remainingCalls: number | undefined = undefined;
  console.log('Waiting for call limit to replenish');

  while (!remainingCalls || remainingCalls < callLimit - 1) {
    (shop as ShopifyCallLimit).once('callLimits', ({ remaining }) => {
      console.log(`Remaining: ${remaining}`);
      remainingCalls = remaining;
    });
    await shop.product.count();
    delay(THROTTLE_DELAY_MS);
  }

  console.log('Ready for next round of calls');
}

