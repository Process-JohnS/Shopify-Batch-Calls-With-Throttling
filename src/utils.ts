
export const delay = (ms: number) => {
  let start = new Date().getTime(), end = start;
  while (end < start + ms) end = new Date().getTime();
};

export function* yieldArray<T>(arr: Array<T>) {
  yield* arr;
}

export const flatten = <T>(nested: T[]): Array<T> => nested.reduce((reduced: T[], item: T): T[] => {
  return [ ...reduced, ...(item instanceof Array ? flatten(item) : [item]) ];
}, []);

