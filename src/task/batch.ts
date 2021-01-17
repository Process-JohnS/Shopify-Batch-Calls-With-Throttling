import Shopify from 'shopify-api-node';
import { CALL_BUFFER } from '../common/constants';
import {
  ITaskBatch,
  IShopifyTask,
  IShopifyTaskResponse
} from '../common/types';
import { dispatchTask } from './task';
import { yieldArray } from '../utils/utils';
import { throttle } from '../rate-limiting/throttle';


/**
 *  Creates a batch of tasks to be dispatched
 */
export const createTaskBatch = <R>(
  shop: Shopify,
  tasks: IShopifyTask<R>[],
  callLimit: number,
  skipFirstDelay = true
): ITaskBatch<R> => ({

  dispatch: async (): Promise<IShopifyTaskResponse<R>[]> => {
    let yieldTask = yieldArray(tasks);
    let nextTask: IteratorResult<IShopifyTask<R>, any> | undefined = undefined;
    let taskResults: IShopifyTaskResponse<R>[] = [];

    // While there are more tasks to dipsatch
    while (!(nextTask && nextTask.done)) {

      // Skip throttling for the first burst only
      if (skipFirstDelay) skipFirstDelay = false;

      // Pause execution until call limit has been replenished
      else await throttle(shop, callLimit);

      let taskPromises: Promise<IShopifyTaskResponse<R>>[] = [];

      // Dispatch as many tasks we can in burst while avoiding the
      // "429: Too many requests" error
      for (let i = 0; i < callLimit - CALL_BUFFER; i++) {
        nextTask = yieldTask.next();
        if (nextTask.done) break;
        taskPromises.push(dispatchTask(nextTask.value));
      }

      // Collect task responses
      taskResults.push(...(await Promise.all(taskPromises)));
    }
    return taskResults;
  }

} as ITaskBatch<R>);

