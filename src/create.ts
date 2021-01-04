
import Shopify from 'shopify-api-node';
import { CreateableResourceObject, ICreateableResource, IShopifyTask, IShopifyTaskResponse } from './common/types';
import { createCreateTask, createTaskBatch } from './task';

export const isCreatable = <R>(resource: object): resource is ICreateableResource<R> => {
  return 'create' in resource;
}

const handleCreateResponse = <R extends { id: number }>({ response }: IShopifyTaskResponse<R>, callback: Function = () => {}) => {
  if ('errors' in response) {
    console.error(`Create task failed. Error: \n${JSON.stringify((response as { errors: any }).errors, null, 2)}`);
  } else {
    console.log(`Create task succeeded for resource ${(response as R).id}`);
    callback(response);
  }
  return response;
}

const handleCreateResponses = <R extends { id: number }>(taskResponses: IShopifyTaskResponse<R>[]) => {
  if (taskResponses.length == 1) return handleCreateResponse(taskResponses[0]);
  let filteredTaskResponses: R[] = [];
  for (let response of taskResponses) {
    handleCreateResponse(response, (r: object) => filteredTaskResponses.push(r as R));
  }
  return filteredTaskResponses;
}

export const createResources = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResources: CreateableResourceObject<R>[]
): Promise<R[] | R | Error> => {
  console.log(`${newResources.length} resources to create`);
  let tasks: IShopifyTask<R>[] = [];
  for (let newResource of newResources) {
    let task = createCreateTask(resource, newResource);
    if (task) tasks.push(task);
  }
  let taskBatch = createTaskBatch(shop, tasks, callLimit);
  return handleCreateResponses(await taskBatch.dispatch());
}

export const createResource = async <R extends { id: number }>(
  shop: Shopify,
  resource: ICreateableResource<R>,
  callLimit: number,
  newResource: CreateableResourceObject<R>
): Promise<R[] | R | Error> => {
  let task = createCreateTask(resource, newResource);
  let taskBatch = createTaskBatch(shop, [task] as IShopifyTask<R>[], callLimit);
  return handleCreateResponses(await taskBatch.dispatch());
}
