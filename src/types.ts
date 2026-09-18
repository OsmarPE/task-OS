import type { ComponentType } from "react";

export interface PriorityType {
  id: number;
  name: string;
}

export interface ProjectType {
  id: string;
  name: string;
  clerkUserId: string;
  createdAt: Date;
}

export interface TaskType {
  id: string;
  taskName: string;
  description: string | null;
  completed: boolean;
  priorityId: number;
  projectId: string;
  dueDate: Date | null;
  createdAt: Date;
}

export interface ClerkUserSummary {
  id: string;
  name: string;
  imageUrl: string;
}

export type ProjectWithTasks = ProjectType & {
  tasks: (TaskType & { assignees: ClerkUserSummary[] })[];
};

export type ProjectMember = ClerkUserSummary & { clerkUserId: string; isOwner: boolean };

export type TaskDependencyRow = {
  id: string;
  taskName: string;
  completed: boolean;
  projectId: string;
  projectName: string;
};

export type TaskWithRelations = TaskType & {
  priority: PriorityType;
  project: ProjectType;
  assignees: ClerkUserSummary[];
  dependencies?: TaskDependencyRow[];
};

export type TaskAdd = Pick<TaskType, "taskName" | "description" | "priorityId" | "projectId" | "dueDate">;
export type TaskEdit = Pick<
  TaskType,
  "id" | "taskName" | "description" | "priorityId" | "projectId" | "completed" | "dueDate"
>;

export type datesGraphicType = { completed: number; incompleted: number };

export interface ShowMenuContextType {
  showMenu: boolean;
  toggleMenu: () => void;
}

export type typeLink = {
  href: string;
  Icon: ComponentType<{ width?: number; height?: number; className?: string }>;
  name: string;
};

