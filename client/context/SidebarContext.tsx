import { IChildren } from "@/types";
import { createContext, useContext, useState } from "react";

interface ISidebarContext {
  isHiddenSidebar: boolean;
  setIsHiddenSidebar: (value: boolean) => void;
}

export const SidebarContext = createContext<ISidebarContext>(
  {} as ISidebarContext
);

const useSidebarContext = () => useContext(SidebarContext);

const SidebarContextProvider = ({ children }: IChildren) => {
  const [isHiddenSidebar, setIsHiddenSidebar] = useState(false);
  const value = { isHiddenSidebar, setIsHiddenSidebar };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export { useSidebarContext, SidebarContextProvider };
