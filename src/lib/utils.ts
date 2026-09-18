import { datesGraphicType, ProjectType, TaskType } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTaskCompleted = (tasks: TaskType[]) => {
  return tasks.reduce((prev, value) => (value.completed ? prev + 1 : prev), 0);
};

export const getCompletedTasks = (tasks: TaskType[]): datesGraphicType => {
  return tasks.reduce(
    (prev, current) =>
      current.completed
        ? { ...prev, completed: prev.completed + 1 }
        : { ...prev, incompleted: prev.incompleted + 1 },
    {
      completed: 0,
      incompleted: 0,
    },
  );
};

export const formatDate = (date: Date) => {
  return Intl.DateTimeFormat("es-mx", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(date);
};

export const getNameProject = (project: ProjectType) => project?.name ?? "";

export const calculatePorcent = (x: number, total: number) => {
  return total > 0 ? (x * 100) / total : 0;
};
