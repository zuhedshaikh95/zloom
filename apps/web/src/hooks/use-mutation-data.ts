"use client";

import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";

export function useMutationData<TData = unknown, TError = unknown, TVariables = void, TContext = unknown>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>
): UseMutationResult<TData, TError, TVariables, TContext> {
  const data = useMutation<TData, TError, TVariables, TContext>(options);
  return data;
}
