
import Shopify from 'shopify-api-node';
import { CreateableResourceObject,
  ICreateableResource,
  IShopifyTask
} from './common/types';
import { createCreateTask } from './task';
import { createTaskBatch } from './task-batch';
import { handleResponse } from './response';

export const createResources = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResources: CreateableResourceObject<R>[]
): Promise<R[]> => {

  console.log(`${newResources.length} resources to create`);
  let tasks: IShopifyTask<R>[] = [];

  for (let newResource of newResources) {
    let task = createCreateTask(resource, newResource);
    if (task) tasks.push(task);
  }

  let taskBatch = createTaskBatch(shop, tasks, callLimit);
  return handleResponse(await taskBatch.dispatch());
}

export const createResource = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResource: CreateableResourceObject<R>
): Promise<R[]> => {

  let task = createCreateTask(resource, newResource);
  let taskBatch = createTaskBatch(shop, [task] as IShopifyTask<R>[], callLimit);

  return handleResponse(await taskBatch.dispatch());
}

