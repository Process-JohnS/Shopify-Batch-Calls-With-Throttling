
import Shopify from 'shopify-api-node';
import { CreateableResourceObject,
  ICreateableResource,
  IShopifyTask
} from './common/types';
import { createCreateTask } from './task';
import { createTaskBatch } from './task-batch';
import { handleResponse } from './response';
import { createTableLogger } from './logger/table-logger';

export const createResources = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResources: CreateableResourceObject<R>[]
): Promise<R[]> => {

  console.log(`${newResources.length} resources to create`);
  let tasks: IShopifyTask<R>[] = [];
  let logger = createTableLogger({
    outDir: './logs',
    tableHeaders: ['Action', 'Product Title', 'Error'],
    columnWidths: [10, 40, 100]
  })

  for (let newResource of newResources) {
    let task = createCreateTask(resource, newResource, logger);
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

