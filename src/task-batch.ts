
import Shopify from 'shopify-api-node';
import { IShopifyTask, ITaskBatch, IShopifyTaskResponse } from './common/types';
import { dispatchTask } from './task';
import { throttle } from './throttle';
import { yieldArray } from './utils';
import { CALL_BUFFER } from './constants';

export const createTaskBatch = <R>(
  shop: Shopify,
  tasks: IShopifyTask<R>[],
  callLimit: number,
  skipFirstDelay = true
): ITaskBatch<R> => {

  const dispatch = async (): Promise<IShopifyTaskResponse<R>[]> => {
    let yieldTask = yieldArray(tasks);
    let nextTask: IteratorResult<IShopifyTask<R>, any> | undefined = undefined;
    let taskResults: IShopifyTaskResponse<R>[] = [];

    while (!(nextTask && nextTask.done)) {
      if (skipFirstDelay) skipFirstDelay = false;
      else await throttle(shop, callLimit);

      let taskPromises: Promise<IShopifyTaskResponse<R>>[] = [];

      for (let i = 0; i < callLimit - CALL_BUFFER; i++) {
        nextTask = yieldTask.next();
        if (nextTask.done) break;
        taskPromises.push(dispatchTask(nextTask.value));
      }

      taskResults.push(...(await Promise.all(taskPromises)));
    }
    return taskResults;
  }

  return { dispatch } as ITaskBatch<R>;
}

