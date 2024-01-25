const idsRecord: Record<string, number> = {};
export function useId<const T extends string>(name: string, values: T[]): Record<T, string> {
  const count = idsRecord[name] !== undefined ? idsRecord[name]++ : (idsRecord[name] = 0);

  return toObject(values, (item) => `${name}-${count}-${item}`);
}

function toObject<const T extends string, R>(values: T[], map: (value: T) => R): Record<T, R> {
  return values.reduce(
    (result, item) => {
      result[item] = map(item);
      return result;
    },
    {} as Record<T, R>
  );
}
