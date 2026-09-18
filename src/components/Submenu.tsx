"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Pencil, Plus, Trash, Users } from "lucide-react";
import { ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
  id: string;
}

export default function Submenu({ children, id }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <DropdownMenu>
      {children}
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => router.push(`${pathname}?addTask=${id}`)} className="gap-2">
          <Plus className="size-4" /> Agregar Tarea
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`${pathname}?editproject=${id}`)} className="gap-2">
          <Pencil className="size-4" /> Editar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`${pathname}?members=${id}`)} className="gap-2">
          <Users className="size-4" /> Miembros
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => router.push(`${pathname}?id=${id}`)} className="gap-2">
          <Trash className="size-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
