import type { QueryFunctionContext } from "@tanstack/react-query";

import api from "./axios";

export const defaultQueryFn = async <T>({ queryKey }: QueryFunctionContext): Promise<T> => {
  const path = queryKey[0] as string;
  const { data } = await api.get(path);


  // API wraps the actual data in a `data` property
  return data.data;
};