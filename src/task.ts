
import Shopify from 'shopify-api-node';
import { IFetchableResource, isFetchable } from './fetch';
import { ShopifyCallLimit, throttle } from './throttle';
import { yieldArray } from './utils';
import { CALL_BUFFER } from './constants';



export interface IShopifyTask<R> {
  resource: IFetchableResource<R>;
  params?: { limit: number, page: number };
}

export interface IDispatchedShopifyTask<R> {
  response: R[] | Error;
}

export interface ITaskBatch<R> {
  tasks: IShopifyTask<R>[];
  dispatch(): Promise<IDispatchedShopifyTask<R>[]>;
}



const dispatchTask = async <R>(task: IShopifyTask<R>): Promise<IDispatchedShopifyTask<R>> => {
  const { resource, params } = task;
  let response: R[] | Error = []
  try {
    response = await resource.list(params);
  } catch (err) {
    response = err.response.body;
  }
  return { response } as IDispatchedShopifyTask<R>;
}


export const createFetchTaskBatch = <R>(shop: Shopify, tasks: IShopifyTask<R>[], callLimit: number, skipFirstDelay = true): ITaskBatch<R> => {

  const dispatch = async (): Promise<IDispatchedShopifyTask<R>[]> => {
    let yieldTask = yieldArray(tasks);
    let nextTask: IteratorResult<IShopifyTask<R>, any> | undefined = undefined;
    let taskResults: IDispatchedShopifyTask<R>[] = [];

    while (!(nextTask && nextTask.done)) {
      if (skipFirstDelay) skipFirstDelay = false;
      else await throttle(shop as ShopifyCallLimit, callLimit);

      let taskPromises: Promise<IDispatchedShopifyTask<R>>[] = [];

      for (let i = 0; i < callLimit - CALL_BUFFER; i++) {
        nextTask = yieldTask.next();
        if (nextTask.done) break;
        taskPromises.push(dispatchTask(nextTask.value));
      }

      taskResults.push(...(await Promise.all(taskPromises)));
    }
    return taskResults;
  }

  return { tasks, dispatch } as ITaskBatch<R>;
}


export const createFetchTask = <R>(
  resource: IFetchableResource<R>,
  params?: {}
): IShopifyTask<R> | undefined => {
  return isFetchable(resource) ? {
    resource: resource as IFetchableResource<R>,
    params,
    response: []
  } as IShopifyTask<R> : undefined;
}
