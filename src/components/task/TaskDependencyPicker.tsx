"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import { ChevronsUpDown, SquareArrowOutUpRightIcon, X } from "lucide-react";
import { searchTasks } from "@/actions/dependency.actions";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";

export interface DependencyOption {
  id: string;
  taskName: string;
  projectName: string;
}

interface Props {
  excludeTaskId: string;
  value: DependencyOption[];
  onAdd: (option: DependencyOption) => void;
  onRemove: (id: string) => void;
}

export default function TaskDependencyPicker({ excludeTaskId, value, onAdd, onRemove }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    queryKey: ["searchTasks", query, excludeTaskId],
    queryFn: () => searchTasks(query, excludeTaskId),
    enabled: query.trim().length > 0,
  });

  const selectedIds = new Set(value.map((dep) => dep.id));
  const options = data?.filter((task) => !selectedIds.has(task.id)) ?? [];

  return (
    <div className="grid gap-2">
      <Label>Depende de</Label>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((dep) => (
            <Badge key={dep.id} variant="outline" className="gap-1">
              {dep.taskName} <span className="text-muted-foreground">({dep.projectName})</span>
              <button
                type="button"
                title="Ver / editar esta tarea"
                onClick={() => router.push(`${pathname}?editTask=${dep.id}`)}
              >
                <SquareArrowOutUpRightIcon className="size-3" />
              </button>
              <button type="button" title="Quitar dependencia" onClick={() => onRemove(dep.id)}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" type="button" className="justify-between">
            Buscar tarea...
            <ChevronsUpDown className="ml-2 size-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Buscar por nombre..." value={query} onValueChange={setQuery} />
            <CommandList>
              <CommandEmpty>Sin resultados</CommandEmpty>
              <CommandGroup>
                {options.map((task) => (
                  <CommandItem
                    key={task.id}
                    onSelect={() => {
                      onAdd(task);
                      setQuery("");
                    }}
                  >
                    {task.taskName}{" "}
                    <span className="ml-1 text-xs text-muted-foreground">({task.projectName})</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
