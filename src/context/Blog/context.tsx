import React, { createContext } from "react";

const BlogContext = createContext({});


export const BlogProvider = ({ children }: { children: React.ReactNode }) => {
  return <BlogContext.Provider value={{}}>{children}</BlogContext.Provider>;
};