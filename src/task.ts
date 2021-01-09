
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
  ResponseError
} from './common/types';
import { isFetchable, isCreatable } from './resource';

export const dispatchTaskAsync = async <R>(task: IShopifyTask<R>): Promise<IShopifyTaskResponse<R>> => {
  let response: TaskResponse<R> = [];
  try {
    response = await task.dispatch();
  } catch (err) {
    let resourceName: string | number | null = null;
    response = err.response.body as ResponseError;
    switch (task.actionType) {
      case 'create':
        resourceName = `"${(task as IShopifyCreateTask<R>).resourceTitle}"`;
        break;
      case 'update':
        resourceName = (task as IShopifyUpdateTask<R>).resourceId;
        break;
      case 'delete':
        resourceName = (task as IShopifyDeleteTask<R>).resourceId;
    }
    console.log(`${task.actionType.toUpperCase()} error${resourceName ? ` for ${resourceName}` : ''}: \n${JSON.stringify(response.errors, null, 2)}`);
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
  newResource: CreateableResourceObject<R>
): IShopifyTask<R> | undefined => {
  return isCreatable(resource) ? {
    actionType: 'create',
    resourceTitle: newResource.title,
    dispatch: async () => resource.create(newResource)
  } as IShopifyCreateTask<R> : undefined;
}

export const createUpdateTask = <R>(

) => {

}

export const createDeleteTask = <R>(

) => {

}

