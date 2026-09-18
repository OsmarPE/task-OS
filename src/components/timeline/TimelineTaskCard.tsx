"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskWithRelations } from "@/types";

interface Props {
  task: TaskWithRelations;
}

export default function TimelineTaskCard({ task }: Props) {
  const pathname = usePathname();
  const dependencies = task.dependencies ?? [];

  return (
    <Link
      href={`${pathname}?editTask=${task.id}`}
      className={cn(
        "block w-[220px] rounded-lg border bg-card px-3 py-2 shadow-sm transition-opacity hover:opacity-80",
        task.completed ? "border-green-200" : "border-border",
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium truncate">{task.taskName}</p>
        {task.completed && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckIcon className="size-3" />
          </span>
        )}
      </div>

      {dependencies.length > 0 && (
        <p className="mt-1 text-xs text-muted-foreground truncate">
          Depende de:{" "}
          {dependencies
            .map((dep) => (dep.projectId !== task.projectId ? `${dep.taskName} (${dep.projectName})` : dep.taskName))
            .join(", ")}
        </p>
      )}
    </Link>
  );
}
