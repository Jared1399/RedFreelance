import React, { createContext } from "react";

const SearchGigContext = createContext({});


export const SearchGigProvider = ({ children }: { children: React.ReactNode }) => {
  return <SearchGigContext.Provider value={{}}>{children}</SearchGigContext.Provider>;
};