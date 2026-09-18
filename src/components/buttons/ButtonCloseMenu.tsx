"use client";

import { useShowMenu } from "@/hooks/useShowMenu";
import { Menu } from "lucide-react";

export default function ButtonCloseMenu() {
  const { toggleMenu } = useShowMenu();

  return (
    <button onClick={toggleMenu} className="absolute left-3 top-8 -translate-y-1/2 md:hidden">
      <Menu width={24} height={24} className="text-primary" />
    </button>
  );
}
