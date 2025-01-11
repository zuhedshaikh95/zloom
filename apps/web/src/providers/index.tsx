"use client";

import store from "@/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";

type Props = Readonly<{
  children: React.ReactNode;
}>;

const query = new QueryClient();

const Providers: React.FC<Props> = ({ children }) => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={query}>{children}</QueryClientProvider>
    </Provider>
  );
};

export default Providers;
