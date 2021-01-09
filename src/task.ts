
import {
  IFetchableResource,
  FetchableResourceObject,
  CreateableResourceObject,
  ICreateableResource,
  IShopifyTask,
  IShopifyFetchTask,
  IShopifyCreateTask,
  IShopifyUpdateTask,
  IShopifyDeleteTask,
  IShopifyTaskResponse,
  TaskResponse,
  TaskLogger,
  ResponseError
} from './common/types';
import { isFetchable, isCreatable } from './resource';

export const dispatchTaskAsync = async <R>(task: IShopifyTask<R>): Promise<IShopifyTaskResponse<R>> => {
  let response: TaskResponse<R> = [];

  try {
    response = await task.dispatch();
  } catch (err) {

    response = err.response.body as ResponseError;
    let action = task.actionType.toUpperCase();
    let errors = JSON.stringify(response.errors, null, 0).replace(/\\n/g, '');

    // log errors
    if (task.logger) {
      switch (task.actionType) {
        case 'create':
          let resourceTitle = (task as IShopifyCreateTask<R>).resourceTitle;
          task.logger.writeRow(action, resourceTitle, errors);
          break;
      }
    }

    // print errors
    let resourceName: string | number | null = null;
    switch (task.actionType) {
      case 'create':
        resourceName = (task as IShopifyCreateTask<R>).resourceTitle;
        break;
      case 'update':
        resourceName = (task as IShopifyUpdateTask<R>).resourceId;
        break;
      case 'delete':
        resourceName = (task as IShopifyDeleteTask<R>).resourceId;
    }
    console.log(`${action} error${resourceName ? ` for "${resourceName}"` : ''}: ${errors}`);

  }
  return { response } as IShopifyTaskResponse<R>;
}

export const createFetchTask = <R>(
  resource: IFetchableResource<R>,
  params?: FetchableResourceObject
): IShopifyTask<R> | undefined => {

  return isFetchable(resource) ? {
    actionType: 'fetch',
    dispatch: async () => resource.list(params)
  } as IShopifyFetchTask<R> : undefined;

}

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

export const createUpdateTask = <R>(

) => {

}

export const createDeleteTask = <R>(

) => {

}

