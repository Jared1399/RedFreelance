import React, { createContext } from "react";

const UserContext = createContext({});


export const GigProvider = ({ children }: { children: React.ReactNode }) => {
  return <UserContext.Provider value={{}}>{children}</UserContext.Provider>;
};