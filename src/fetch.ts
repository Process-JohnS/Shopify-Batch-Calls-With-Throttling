
import Shopify from 'shopify-api-node';
import { createFetchTask } from './task';
import { createTaskBatch } from './task-batch';
import { IFetchableResource, IShopifyTask } from './common/types';
import { handleResponse } from './response';

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

