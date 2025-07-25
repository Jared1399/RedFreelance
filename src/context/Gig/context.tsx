import React, { createContext } from "react";

const GigContext = createContext({});


export const GigProvider = ({ children }: { children: React.ReactNode }) => {
  return <GigContext.Provider value={{}}>{children}</GigContext.Provider>;
};