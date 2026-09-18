"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Submenu from "../Submenu";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import { EllipsisVerticalIcon } from "lucide-react";
import { ProjectWithTasks, TaskType } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { calculateTaskCompleted, cn, formatDate } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckedState } from "@radix-ui/react-checkbox";
import { toast } from "sonner";
import { updateTask } from "@/actions/task.actions";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Props {
  project: ProjectWithTasks;
}

export default function ProjectItem({ project }: Props) {
  const { name, tasks, createdAt, id } = project;

  const pathname = usePathname();

  const taskSize = tasks.length;
  const taskCompleted = calculateTaskCompleted(tasks);
  const porcent = taskSize > 0 ? (taskCompleted * 100) / taskSize : 0;
  const dateTask = new Date(createdAt);
  const isToday = dateTask.toLocaleDateString() === new Date().toLocaleDateString();

  const client = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: updateTask,
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChangeStatus = (status: CheckedState, task: TaskType) => {
    mutate(
      {
        id: task.id,
        taskName: task.taskName,
        description: task.description,
        priorityId: task.priorityId,
        projectId: task.projectId,
        dueDate: task.dueDate,
        completed: status as boolean,
      },
      {
        onSuccess: (data) => {
          client.invalidateQueries({ queryKey: ["projects"] });
          client.removeQueries({ queryKey: ["editTask", task.id] });
          client.invalidateQueries({ queryKey: ["tasksGraphic"] });
          toast.success(data);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader className="flex-row justify-between items-start">
        <div>
          <CardTitle className="text-lg">
            <Link href={`/main/projects/${id}`} className="hover:text-primary transition-colors">
              {name}
            </Link>
          </CardTitle>
          <CardDescription>{isToday ? "Hoy" : formatDate(dateTask)}</CardDescription>
        </div>
        <Submenu id={id}>
          <DropdownMenuTrigger>
            <EllipsisVerticalIcon width={14} height={14} />
          </DropdownMenuTrigger>
        </Submenu>
      </CardHeader>
      <CardContent>
        <ul className="grid gap-0.5 text-sm">
          {taskSize > 0 ? (
            tasks.map((task) => (
              <li key={task.id} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <div className={cn("size-1.5 rounded-full", { "bg-green-400": task.completed, "bg-red-500": !task.completed })}></div>
                  <Button asChild className="p-0 h-auto text-foreground font-normal flex-1" variant="link">
                    <Link
                      href={`${pathname}?editTask=${task.id}`}
                      className="whitespace-break-spaces"
                      title={task.description ?? undefined}
                    >
                      {task.taskName}
                    </Link>
                  </Button>
                </span>
                <div className="flex items-center gap-2">
                  {task.assignees.length > 0 && (
                    <div className="flex -space-x-2">
                      {task.assignees.map((assignee) => (
                        <Avatar key={assignee.id} className="h-5 w-5 border-2 border-background" title={assignee.name}>
                          <AvatarImage src={assignee.imageUrl} alt={assignee.name} />
                          <AvatarFallback className="text-[8px]">{assignee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  )}
                  <Checkbox
                    onCheckedChange={(value) => handleChangeStatus(value, task)}
                    className="disabled:opacity-100"
                    defaultChecked={task.completed}
                    disabled={isPending}
                  />
                </div>
              </li>
            ))
          ) : (
            <div>
              <p className="text-sm text-gray-400">
                No hay tareas,{" "}
                <Button asChild className="inline-block p-0 h-auto" variant={"link"}>
                  <Link href={`${pathname}?addTask=${id}`}>¿Quiere agregar uno nuevo?</Link>
                </Button>
              </p>
            </div>
          )}
        </ul>
      </CardContent>
      {taskSize > 0 && (
        <CardFooter className="flex-col">
          <Progress value={porcent} className="h-1 mt-8" />
          <div className="flex w-full items-center justify-between text-sm text-gray-400 mt-2">
            <p>Progreso</p>
            <span>{porcent.toFixed(2)}%</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
