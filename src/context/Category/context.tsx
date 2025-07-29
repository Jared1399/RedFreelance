import React, { createContext } from "react";

const CategoryContext = createContext({});


export const CategoryProvider = ({ children }: { children: React.ReactNode }) => {
  return <CategoryContext.Provider value={{}}>{children}</CategoryContext.Provider>;
};