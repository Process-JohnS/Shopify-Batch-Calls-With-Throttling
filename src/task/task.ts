import {
  IShopifyTask,
  IShopifyCreateTask,
  IShopifyUpdateTask,
  IShopifyDeleteTask,
  IShopifyTaskResponse,
  TaskResponse,
  ResponseError
} from '../common/types';


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

