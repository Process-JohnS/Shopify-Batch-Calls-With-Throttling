
import Shopify, {
  IProduct, IProductVariant, IProductOption,
  ICustomer
} from 'shopify-api-node';

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
  dispatch: () => Promise<R[] | R | Error>;
}

/**
 * A task can respond with a list of results or a HTTP error
 */
export interface IShopifyTaskResponse<R> {
  response: R[] | R | Error;
}

/**
 * Holds a collection of tasks that will be processed on dispatch
 */
export interface ITaskBatch<R> {
  dispatch(): Promise<IShopifyTaskResponse<R>[]>;
}

/**
 * Can invoke create on the resource
 */
export interface ICreateableResource<R> {
  create: (params: any) => Promise<R>;
}







/**
 * Createable resources
 */

 /* A generic createable resource type that resolves to the correct specific type */
export type CreateableResourceObject<R> = 
  R extends IProduct ? CreateableProductObject
  : never;

/* Product */
export interface CreateableProductObject extends Omit<
  Required<
    Pick<IProduct,
    | 'title'
    >> &
  Partial<
    Omit<IProduct,
    | 'title'
    >>,
  | 'options'
  | 'variants'
> {
  variants?: CreateableVariantObject[];
  options?:
    | [CreateableOptionObject, CreateableOptionObject, CreateableOptionObject]
    | [CreateableOptionObject, CreateableOptionObject]
    | [CreateableOptionObject]
    | [];
}

/* Product Options  */
export type CreateableOptionObject = Pick<IProductOption, 'name'>

/* Product Variants */
export type CreateableVariantObject = Required<
  Pick<IProductVariant,
  | 'option1'
  | 'price'
>> &
Partial<
  Omit<IProductVariant,
  | 'option1'
  | 'price'
>>


/**
 * Updateable Resources
 */

/* Product */
export type UpdateableProductObject =
  Required<
    Pick<IProduct,
    | 'id'
  >> &
  Partial<
    Omit<IProduct, 
    | 'id'
  >>
