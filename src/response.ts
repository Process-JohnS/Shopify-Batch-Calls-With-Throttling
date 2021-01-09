
import { IShopifyTaskResponse, TaskResponse, ResponseError } from './common/types';

export const isErrorResponse = <R>(response: TaskResponse<R>): response is ResponseError => {
  return 'errors' in response;
}

export const handleResponse = <R>(responses: IShopifyTaskResponse<R>[]) => {
  let responseResults: R[] = [];
  for (const { response } of responses) {
    if (!isErrorResponse(response)) {
      responseResults.push(...(response instanceof Array ? response : [response]));
    }
  }
  return responseResults;
}

