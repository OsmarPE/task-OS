"use client";

import { TaskDependencyRow, TaskWithRelations } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn, formatDate, getNameProject } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { priorityColors } from "@/lib/helper";

export type TaskRow = TaskWithRelations;

function ActionsCell({ id }: { id: string }) {
  const pathname = usePathname();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`${pathname}?editTask=${id}`}>Editar</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`${pathname}?removeTask=${id}`}>Eliminar</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DependencyBadge({ dep, currentProjectId }: { dep: TaskDependencyRow; currentProjectId: string }) {
  const pathname = usePathname();

  return (
    <Link href={`${pathname}?editTask=${dep.id}`}>
      <Badge
        variant="outline"
        className={cn("border-0 rounded-3xl py-1 cursor-pointer hover:opacity-80 transition-opacity", {
          "text-amber-600 bg-amber-100": !dep.completed,
          "text-green-600 bg-green-100": dep.completed,
        })}
      >
        {dep.taskName}
        {dep.projectId !== currentProjectId ? ` (${dep.projectName})` : ""}
      </Badge>
    </Link>
  );
}

export const columns: ColumnDef<TaskRow>[] = [
  {
    accessorKey: "taskName",
    header: "Tarea",
    cell: ({ row }) => <div className="capitalize">{row.getValue("taskName")}</div>,
  },
  {
    accessorKey: "completed",
    header: "Completado",
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("border-0 rounded-3xl py-1.5", {
          "text-green-500 bg-green-100": row.getValue("completed"),
          "text-blue-500 bg-blue-100": !row.getValue("completed"),
        })}
      >
        {row.getValue("completed") ? "Completado" : "En proceso"}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "project",
    accessorFn: (row) => getNameProject(row.project),
    header: "Proyecto",
    cell: ({ row }) => <div className="lowercase">{row.getValue("project")}</div>,
  },
  {
    id: "priority",
    accessorFn: (row) => row.priority.name,
    header: () => <div className="text-left">Prioridad</div>,
    cell: ({ row }) => {
      const value = row.getValue("priority") as string;

      return (
        <div className="text-left font-medium flex items-center gap-2 capitalize">
          <div
            className="size-1.5 rounded-full"
            style={{ backgroundColor: priorityColors[value as keyof typeof priorityColors] }}
          ></div>
          {value}
        </div>
      );
    },
  },
  {
    id: "dueDate",
    header: "Vence",
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      if (!dueDate) return <span className="text-sm text-gray-400">Sin fecha</span>;

      const isOverdue = !row.original.completed && new Date(dueDate) < new Date();

      return (
        <span className={cn("text-sm", isOverdue ? "text-red-500 font-medium" : "text-muted-foreground")}>
          {formatDate(new Date(dueDate))}
        </span>
      );
    },
  },
  {
    id: "assignees",
    header: "Asignados",
    cell: ({ row }) => {
      const assignees = row.original.assignees;

      if (!assignees.length) return <span className="text-sm text-gray-400">Sin asignar</span>;

      return (
        <div className="flex -space-x-2">
          {assignees.map((assignee) => (
            <Avatar key={assignee.id} className="h-7 w-7 border-2 border-background" title={assignee.name}>
              <AvatarImage src={assignee.imageUrl} alt={assignee.name} />
              <AvatarFallback className="text-[10px]">{assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
        </div>
      );
    },
  },
  {
    id: "dependencies",
    header: "Depende de",
    cell: ({ row }) => {
      const dependencies = row.original.dependencies ?? [];

      if (!dependencies.length) return <span className="text-sm text-gray-400">—</span>;

      return (
        <div className="flex flex-wrap gap-1">
          {dependencies.map((dep) => (
            <DependencyBadge key={dep.id} dep={dep} currentProjectId={row.original.projectId} />
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Acciones",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell id={row.getValue("id")} />,
  },
];
