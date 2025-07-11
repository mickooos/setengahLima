import React, { createContext, useContext, useState, ReactNode } from "react";

interface OrderContextType {
  orderId: string | null;
  setOrderId: (id: string | null) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

interface OrderProviderProps {
  children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orderId, setOrderId] = useState<string | null>(null);

  return (
    <OrderContext.Provider value={{ orderId, setOrderId }}>
      {children}
    </OrderContext.Provider>
  );
};

// Custom hook untuk menggunakan OrderContext
export const useOrder = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrder must be used within an OrderProvider");
  }
  return context;
};
