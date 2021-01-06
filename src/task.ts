
import {
  IFetchableResource,
  FetchableResourceObject,
  CreateableResourceObject,
  ICreateableResource,
  IShopifyTask,
  IShopifyTaskResponse,
  TaskResponse,
  ResponseError
} from './common/types';
import { isFetchable, isCreatable } from './resource';

export const dispatchTask = async <R>(task: IShopifyTask<R>): Promise<IShopifyTaskResponse<R>> => {
  let response: TaskResponse<R> = []
  try {
    response = await task.dispatch();
  } catch (err) {
    response = err.response.body as ResponseError;
  }
  return { response } as IShopifyTaskResponse<R>;
}

export const createFetchTask = <R>(
  resource: IFetchableResource<R>,
  params?: FetchableResourceObject
): IShopifyTask<R> | undefined => {
  return isFetchable(resource) ? {
    dispatch: async () => resource.list(params)
  } as IShopifyTask<R> : undefined;
}

export const createCreateTask = <R>(
  resource: ICreateableResource<R>,
  newResource: CreateableResourceObject<R>
): IShopifyTask<R> | undefined => {
  return isCreatable(resource) ? {
    dispatch: async () => resource.create(newResource)
  } as IShopifyTask<R> : undefined;
}

