import Shopify from 'shopify-api-node';
import {
  IUpdateableResource,
  UpdateableProductObject
} from '../common/types';


export const updateResources = async <R extends { id: number }>(
  shop: Shopify,
  resource: IUpdateableResource<R>,
  callLimit: number,
  newResources: UpdateableProductObject[]
)  => {

}

