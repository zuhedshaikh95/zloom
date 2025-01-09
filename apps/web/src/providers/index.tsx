"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const query = new QueryClient();

const Providers: React.FC<Props> = ({ children }) => {
  return <QueryClientProvider client={query}>{children}</QueryClientProvider>;
};

export default Providers;
