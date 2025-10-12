import { Dispatch, useState } from "react";

function zip(keys: string[], values: Array<unknown>) {
  if (keys.length != values.length) return undefined;

  const zipped = keys.map((key, i) => [key, values[i]]);
  return Object.fromEntries(zipped);
}

export interface State<T> {
  value: T,
  set: React.Dispatch<React.SetStateAction<T>>
}

export function createState<T>(state: [T, Dispatch<React.SetStateAction<T>>]): State<T> {
  return zip(["value", "set"], state);
}

export function useCreateState<T>(value: T): State<T> {
  return createState(useState(value));
}

