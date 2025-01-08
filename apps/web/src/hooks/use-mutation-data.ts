"use client";

import { useMutation, UseMutationOptions, UseMutationResult } from "@tanstack/react-query";

export function useMutationData<DataT = unknown, ErrorT = unknown, VariablesT = void, ContextT = unknown>(
  options: UseMutationOptions<DataT, ErrorT, VariablesT, ContextT>
): UseMutationResult<DataT, ErrorT, VariablesT, ContextT> {
  const data = useMutation<DataT, ErrorT, VariablesT, ContextT>(options);

  return data;
}
