import React from "react";
import Content from "../components/MyOrderPage/Content";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const MyOrderPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Content />;
    </QueryClientProvider>
  );
};

export default MyOrderPage;
