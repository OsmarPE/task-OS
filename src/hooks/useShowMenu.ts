import { ShowMenuContext } from "@/context/ShowMenu";
import { ShowMenuContextType } from "@/types";
import { useContext } from "react";

export const useShowMenu = (): ShowMenuContextType => {
  const context = useContext(ShowMenuContext);
  if (!context) {
    throw new Error("useShowMenu debe ser usado dentro de un ShowMenuProvider");
  }
  return context;
};
