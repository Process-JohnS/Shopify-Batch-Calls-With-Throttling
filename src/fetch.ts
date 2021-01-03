
import Shopify from 'shopify-api-node';
import { createFetchTask, createFetchTaskBatch, IShopifyTask } from './task';



export interface IFetchableResource<R> {
  count: () => Promise<number>;
  list: (params: any) => Promise<R[]>;
}



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
    let task = createFetchTask(resource, { ...params, limit: 250, page });
    if (task) tasks.push(task);
  }

  let taskBatch = createFetchTaskBatch(shop, tasks, callLimit);
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
