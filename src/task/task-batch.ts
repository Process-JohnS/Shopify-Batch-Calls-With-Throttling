
import Shopify from 'shopify-api-node';
import {
  ITaskBatch,
  IShopifyTask,
  IShopifyCreateTask,
  IShopifyUpdateTask,
  IShopifyDeleteTask,
  IShopifyTaskResponse,
  TaskResponse,
  ResponseError
} from '../common/types';
import { throttle } from './../rate-limiting/throttle';
import { yieldArray } from '../utils/utils';
import { CALL_BUFFER } from '../common/constants';


/**
 *  Dispatches a single task
 */
export const dispatchTask = async <R>(task: IShopifyTask<R>): Promise<IShopifyTaskResponse<R>> => {
  let response: TaskResponse<R> = [];

  try {
    response = await task.dispatch();
  } catch (err) {

    response = err.response.body as ResponseError;
    let action = task.actionType.toUpperCase();
    let errors = JSON.stringify(response.errors, null, 0).replace(/\\n/g, '');

    // Log errors
    if (task.logger) {
      switch (task.actionType) {
        case 'create':
          let resourceTitle = (task as IShopifyCreateTask<R>).resourceTitle;
          task.logger.writeRow(action, resourceTitle, errors);
          break;
      }
    }

    // Print errors
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
        break;
    }
    console.log(`${action} error${resourceName ? ` for "${resourceName}"` : ''}: ${errors}`);

  }
  return { response } as IShopifyTaskResponse<R>;
}


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

