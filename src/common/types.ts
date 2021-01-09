
import Shopify, {
  IProduct, IProductVariant, IProductOption,
  ICustomer
} from 'shopify-api-node';


export interface TaskLogger {
  writeRow: (...columnValues: string[]) => void;
}


/**
 * Extends the standard Shopify object to listen to call limit events
 */
export type ShopifyCallLimit = Shopify & {
  once: (event: 'callLimits', fn: (currentLimit: { max: number, remaining: number }) => void) => void;
  addListener: (event: 'callLimits', fn: (currentLimit: object) => void) => void;
}

type ActionType = 'fetch' | 'create' | 'update' | 'delete';

export type ResponseError = Error & { errors: any };

export type TaskResponse<R> = R[] | R | ResponseError;

/**
 * A task with a single method to execute it
 */
export interface IShopifyTask<R> {
  actionType: ActionType;
  dispatch: () => Promise<TaskResponse<R>>;
  logger?: TaskLogger;
}

export interface IShopifyFetchTask<R> extends IShopifyTask<R> {
  actionType: 'fetch';
}

export interface IShopifyCreateTask<R> extends IShopifyTask<R> {
  actionType: 'create';
  resourceTitle: string;
}

export interface IShopifyUpdateTask<R> extends IShopifyTask<R> {
  actionType: 'update';
  resourceId: number;
}

export interface IShopifyDeleteTask<R> extends IShopifyTask<R> {
  actionType: 'delete';
  resourceId: number;
}


/**
 * A task can respond with a list of results (fetch), a single result (create/update), or an HTTP error
 */
export interface IShopifyTaskResponse<R> {
  response: TaskResponse<R>;
}

/**
 * Contains a dispatch method that will process a collection of tasks
 */
export interface ITaskBatch<R> {
  dispatch(): Promise<IShopifyTaskResponse<R>[]>;
}


/**
 * Fetchable resources
 */

/* A resource is fetchable if count and list can be invoked on it */
export interface IFetchableResource<R> {
  count: () => Promise<number>;
  list: (params: any) => Promise<R[]>;
}

/* Fetch pagination */
export type FetchableResourceObject = { limit: number, page: number; };


/**
 * Createable resources
 */

/* A resource is createable if create can be invoked on it */
export interface ICreateableResource<R> {
  create: (params: any) => Promise<R>;
}

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

/* A resource is updateable if update can be invoked on it */

export interface IUpdateableResource<R> {
  update: (params: any) => Promise<R>;
}

/* A generic createable resource type that resolves to the correct specific type */
export type UpdateableResourceObject<R> = 
  R extends IProduct ? UpdateableProductObject
  : never;

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

