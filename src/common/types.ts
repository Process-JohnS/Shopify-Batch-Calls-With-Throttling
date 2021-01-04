
import Shopify from 'shopify-api-node';

/**
 * Extends the standard Shopify object to listen to call limit events
 */
export type ShopifyCallLimit = Shopify & {
  once: (event: 'callLimits', fn: (currentLimit: { max: number, remaining: number }) => void) => void;
  addListener: (event: 'callLimits', fn: (currentLimit: object) => void) => void;
}

/**
 * A resource is fetchable if count and list can be called on it
 */
export interface IFetchableResource<R> {
  count: () => Promise<number>;
  list: (params: any) => Promise<R[]>;
}

/**
 * A task with a single method to execute it
 */
export interface IShopifyTask<R> {
  dispatch: () => Promise<R[]>;
}

/**
 * A task can respond with a list of results or a HTTP error
 */
export interface IShopifyTaskResponse<R> {
  response: R[] | Error;
}

/**
 * Holds a collection of tasks that will be processed on dispatch
 */
export interface ITaskBatch<R> {
  dispatch(): Promise<IShopifyTaskResponse<R>[]>;
}

