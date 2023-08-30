"use client";

import { makeStore } from "@/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Provider } from "react-redux";

export default function Providers({ children }: any) {
  const [queryClient] = React.useState(() => new QueryClient());
  const store = makeStore();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
}
