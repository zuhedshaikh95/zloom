"use client";

import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

export function useQueryData<TData = any, TError = string>(
  params: UseQueryOptions<TData, TError, TData, QueryKey>
): UseQueryResult<TData, TError> {
  const data = useQuery<TData, TError, TData, QueryKey>(params);

  return data;
}
