
export const delay = (ms: number) => {
  let start = new Date().getTime(), end = start;
  while (end < start + ms) end = new Date().getTime();
};

export function* yieldArray<T>(arr: Array<T>) {
  yield* arr;
}
