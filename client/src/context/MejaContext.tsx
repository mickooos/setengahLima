import React, { createContext, useContext, useState, ReactNode } from "react";

interface MejaContextProps {
  noMeja: number | null;
  setNoMeja: (id: number) => void;
}

const MejaContext = createContext<MejaContextProps | undefined>(undefined);

export const MejaProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [noMeja, setNoMeja] = useState<number | null>(null);

  return (
    <MejaContext.Provider value={{ noMeja, setNoMeja }}>
      {children}
    </MejaContext.Provider>
  );
};

export const useMeja = (): MejaContextProps => {
  const context = useContext(MejaContext);
  if (!context) {
    throw new Error("useMeja must be used within a MejaProvider");
  }
  return context;
};
