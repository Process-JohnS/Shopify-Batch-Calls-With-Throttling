
import Shopify from 'shopify-api-node';
import {
  FetchableResourceObject,
  IFetchableResource,
  IShopifyTask,
  IShopifyFetchTask
} from '../common/types';
import { createTaskBatch } from '../task/task-batch';
import { handleResponse } from '../task/task-response';


/**
 *  Only allow fetch calls on resources that have the list method defined
 */
export const isFetchable = <R>(resource: object): resource is IFetchableResource<R> => {
  return 'count' in resource && 'list' in resource;
}


/**
 *  Create a task with that will fetch a resource
 */
export const createFetchTask = <R>(
  resource: IFetchableResource<R>,
  params?: FetchableResourceObject
): IShopifyTask<R> | undefined => {
  return isFetchable(resource) ? {
    actionType: 'fetch',
    dispatch: async () => resource.list(params)
  } as IShopifyFetchTask<R> : undefined;
}


/**
 * Sends asynchronous list calls and combines the paginated results
 * into the complete array of resource objects
 */
export const fetchResource =  async <R>(
  shop: Shopify,
  resource: IFetchableResource<R>,
  callLimit: number,
  params?: {}
): Promise<R[]> => {

  const resourcesTotal = await resource.count();
  console.log(`${resourcesTotal} resources to fetch`);

  let tasks: IShopifyTask<R>[] = [];
  for (let page = 1; page <= Math.ceil(resourcesTotal / 250); page++ ) {
    let task = createFetchTask(resource, { ...params, limit: 250, page });
    if (task) tasks.push(task);
  }

  let taskBatch = createTaskBatch(shop, tasks, callLimit);
  return handleResponse(await taskBatch.dispatch());
}

