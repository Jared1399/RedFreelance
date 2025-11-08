import React, { createContext } from "react";

const TierContext = createContext({});


export const TierProvider = ({ children }: { children: React.ReactNode }) => {
  return <TierContext.Provider value={{}}>{children}</TierContext.Provider>;
};