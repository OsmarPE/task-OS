"use client";

import { ShowMenuContextType } from "@/types";
import { createContext, useState, ReactNode } from "react";

export const ShowMenuContext = createContext<ShowMenuContextType | undefined>(
  undefined,
);

export const ShowMenuProvider = ({ children }: { children: ReactNode }) => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prevShowMenu) => !prevShowMenu);
  };

  return (
    <ShowMenuContext.Provider value={{ showMenu, toggleMenu }}>
      {children}
    </ShowMenuContext.Provider>
  );
};
