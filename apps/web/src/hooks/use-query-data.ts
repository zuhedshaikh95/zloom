"use client";

import { useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export function useQueryData<
  DataT = any,
  ErrorT = string,
  QueryKeyT extends ReadonlyArray<unknown> = ReadonlyArray<unknown>
>(params: UseQueryOptions<DataT, ErrorT, DataT, QueryKeyT>): UseQueryResult<DataT, ErrorT> {
  const data = useQuery<DataT, ErrorT, DataT, QueryKeyT>(params);

  return data;
}
