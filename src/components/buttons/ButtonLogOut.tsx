"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

export default function ButtonLogOut() {
  const { signOut } = useClerk();

  return (
    <button
      onClick={() => signOut({ redirectUrl: "/" })}
      className="flex gap-3 p-2 rounded-md hover:bg-primary/5 hover:text-primary/70 transition-all items-center duration-300 cursor-pointer"
    >
      <LogOutIcon width={22} height={22} />
      <span className="md:hidden">Cerrar Sesión</span>
    </button>
  );
}
