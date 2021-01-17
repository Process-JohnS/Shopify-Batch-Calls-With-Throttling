import Shopify from 'shopify-api-node';
import {
  CreateableResourceObject,
  ICreateableResource,
  IShopifyTask,
  IShopifyCreateTask,
  TaskLogger,
} from '../common/types';
import { createTaskBatch } from '../task/batch';
import { handleResponse } from '../task/response';
import { createTableLogger } from '../logger/table-logger';


/**
 *  Only allow create calls on resources that have the create method defined
 */
export const isCreatable = <R>(resource: object): resource is ICreateableResource<R> => {
  return 'create' in resource;
}


/**
 *  Create a task with that will create a resource
 */
export const createCreateTask = <R>(
  resource: ICreateableResource<R>,
  newResource: CreateableResourceObject<R>,
  logger?: TaskLogger
): IShopifyTask<R> | undefined => {
  return isCreatable(resource) ? {
    actionType: 'create',
    resourceTitle: newResource.title,
    dispatch: async () => resource.create(newResource),
    logger
  } as IShopifyCreateTask<R> : undefined;
}


/**
 * Sends multiple asynchronous create tasks
 */
export const createResources = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResources: CreateableResourceObject<R>[]
): Promise<R[]> => {

  console.log(`${newResources.length} resources to create`);
  let tasks: IShopifyTask<R>[] = [];

  // Set up the error logger
  let logger = createTableLogger({
    outDir: './logs',
    tableHeaders: ['Action', 'Resrouce Title', 'Error'],
    columnWidths: [10, 40, 100]
  });

  for (let newResource of newResources) {
    let task = createCreateTask(resource, newResource, logger);
    if (task) tasks.push(task);
  }

  let taskBatch = createTaskBatch(shop, tasks, callLimit);
  return handleResponse(await taskBatch.dispatch());
}


/**
 * Sends a single asynchronous create task
 */
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

