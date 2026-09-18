"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import {
  applyPrimaryColor,
  defaultPrimaryColorId,
  getPresetById,
  PRIMARY_COLOR_STORAGE_KEY,
} from "@/lib/theme-colors";

interface PrimaryColorContextType {
  colorId: string;
  setColorId: (id: string) => void;
}

const PrimaryColorContext = createContext<PrimaryColorContextType | undefined>(undefined);

export function PrimaryColorProvider({ children }: { children: ReactNode }) {
  const [colorId, setColorIdState] = useState(() => {
    if (typeof window === "undefined") return defaultPrimaryColorId;
    return window.localStorage.getItem(PRIMARY_COLOR_STORAGE_KEY) ?? defaultPrimaryColorId;
  });

  const setColorId = (id: string) => {
    const preset = getPresetById(id);
    applyPrimaryColor(preset.primary);
    window.localStorage.setItem(PRIMARY_COLOR_STORAGE_KEY, preset.id);
    setColorIdState(preset.id);
  };

  return (
    <PrimaryColorContext.Provider value={{ colorId, setColorId }}>
      {children}
    </PrimaryColorContext.Provider>
  );
}

export function usePrimaryColor() {
  const context = useContext(PrimaryColorContext);

  if (!context) {
    throw new Error("usePrimaryColor debe usarse dentro de un PrimaryColorProvider");
  }

  return context;
}
