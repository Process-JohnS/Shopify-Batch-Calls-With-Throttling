
/**
 *  Blocks the thread execution for the given number of 
 *  milliseconds
 */
export const delay = (ms: number) => {
  let start = new Date().getTime(), end = start;
  while (end < start + ms) end = new Date().getTime();
};


/**
 *  Creates a generator function from an array
 */
export function* yieldArray<T>(arr: Array<T>) {
  yield* arr;
}


/**
 *  Returns a flat array from an array that contains nested 
 *  arrays of any depth
 */
export const flatten = <T>(nested: T[]): Array<T> => nested.reduce((reduced: T[], item: T): T[] => {
  return [ ...reduced, ...(item instanceof Array ? flatten(item) : [item]) ];
}, []);

