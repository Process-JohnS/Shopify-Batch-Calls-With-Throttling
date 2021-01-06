
import { IFetchableResource, ICreateableResource } from './common/types';

export const isFetchable = <R>(resource: object): resource is IFetchableResource<R> => {
  return 'count' in resource && 'list' in resource;
}

export const isCreatable = <R>(resource: object): resource is ICreateableResource<R> => {
  return 'create' in resource;
}

