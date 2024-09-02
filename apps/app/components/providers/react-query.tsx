"use client";
import React, { FC } from "react";

import { QueryClientProvider as Provider, QueryClient } from "react-query";

interface props {
  children: React.ReactNode;
}

const QueryClientProvider: FC<props> = ({ children }) => {
  const queryClient = new QueryClient();
  return <Provider client={queryClient}>{children}</Provider>;
};

export default QueryClientProvider;
