
import Shopify from 'shopify-api-node';
import { createFetchTask, createTaskBatch } from './task';
import { IFetchableResource, IShopifyTask } from './common/types';

export const isFetchable = <R>(resource: object): resource is IFetchableResource<R> => {
  return 'count' in resource && 'list' in resource;
}

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
    let task = createFetchTask<R>(resource, { ...params, limit: 250, page });
    if (task) tasks.push(task);
  }

  let taskBatch = createTaskBatch(shop, tasks, callLimit);
  let fetchedResources: R[] = [];

  for (let task of await taskBatch.dispatch()) {
    if ('errors' in task.response) {
      console.error(`Task failed. Error: ${(task.response as {errors: any}).errors}`);
    } else if (task.response instanceof Array) {
      console.log(`Task succeeded. Length: ${task.response.length}`);
      fetchedResources.push(...task.response);
    }
  }

  return fetchedResources;
}

