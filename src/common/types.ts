
import Shopify from 'shopify-api-node';

export type ShopifyCallLimit = Shopify & {
  once: (event: 'callLimits', fn: (currentLimit: { max: number, remaining: number }) => void) => void;
  addListener: (event: 'callLimits', fn: (currentLimit: object) => void) => void;
}

export interface IFetchableResource<R> {
  count: () => Promise<number>;
  list: (params: any) => Promise<R[]>;
}

export interface IShopifyTask<R> {
  dispatch: () => Promise<R[]>;
}

export interface IShopifyTaskResponse<R> {
  response: R[] | Error;
}

export interface ITaskBatch<R> {
  dispatch(): Promise<IShopifyTaskResponse<R>[]>;
}

