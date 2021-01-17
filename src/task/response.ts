import {
  IShopifyTaskResponse,
  TaskResponse,
  ResponseError
} from '../common/types';


/**
 *  Checks if a response contains the errors property
 */
export const isErrorResponse = <R>(response: TaskResponse<R>): response is ResponseError => {
  return 'errors' in response;
}


/**
 *  Flattens task response array
 */
export const handleResponse = <R>(responses: IShopifyTaskResponse<R>[]): R[] => {
  let responseResults: R[] = [];
  for (const { response } of responses) {
    if (!isErrorResponse(response)) {
      responseResults.push(...(response instanceof Array ? response : [response]));
    }
  }
  return responseResults;
}

