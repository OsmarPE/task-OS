"use server";

import { randomUUID } from "crypto";
import { eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { projects, taskAssignees, taskDependencies, tasks } from "@/db/schema";
import { canAccessProject, getAccessibleProjectIds, requireUserId } from "@/lib/auth";
import { getClerkUsersByIds } from "@/lib/clerk-users";
import { TaskAdd, TaskEdit } from "@/types";

async function attachAssignees<T extends { id: string }>(rows: T[]) {
  if (rows.length === 0) return rows.map((row) => ({ ...row, assignees: [] }));

  const taskIds = rows.map((row) => row.id);
  const assigneeRows = await db
    .select()
    .from(taskAssignees)
    .where(inArray(taskAssignees.taskId, taskIds));

  const users = await getClerkUsersByIds(assigneeRows.map((row) => row.clerkUserId));

  return rows.map((row) => ({
    ...row,
    assignees: assigneeRows
      .filter((assignee) => assignee.taskId === row.id)
      .map((assignee) => users.get(assignee.clerkUserId) ?? {
        id: assignee.clerkUserId,
        name: assignee.clerkUserId,
        imageUrl: "",
      }),
  }));
}

async function attachDependencies<T extends { id: string }>(rows: T[]) {
  if (rows.length === 0) return rows.map((row) => ({ ...row, dependencies: [] }));

  const taskIds = rows.map((row) => row.id);

  const dependencyRows = await db
    .select({
      taskId: taskDependencies.taskId,
      id: tasks.id,
      taskName: tasks.taskName,
      completed: tasks.completed,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.dependsOnTaskId, tasks.id))
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(inArray(taskDependencies.taskId, taskIds));

  return rows.map((row) => ({
    ...row,
    dependencies: dependencyRows.filter((dep) => dep.taskId === row.id),
  }));
}

export async function getTasks() {
  const userId = await requireUserId();
  const projectIds = await getAccessibleProjectIds(userId);

  if (projectIds.length === 0) return [];

  return db.select().from(tasks).where(inArray(tasks.projectId, projectIds));
}

export async function getTasksWithPopulateProject() {
  const userId = await requireUserId();
  const projectIds = await getAccessibleProjectIds(userId);

  if (projectIds.length === 0) return [];

  const rows = await db.query.tasks.findMany({
    where: inArray(tasks.projectId, projectIds),
    with: { project: true, priority: true },
  });

  return attachDependencies(await attachAssignees(rows));
}

export async function getTasksByProject(projectId: string) {
  const userId = await requireUserId();

  if (!(await canAccessProject(userId, projectId))) {
    throw new Error("Proyecto no encontrado");
  }

  const rows = await db.query.tasks.findMany({
    where: eq(tasks.projectId, projectId),
    with: { project: true, priority: true },
  });

  return attachDependencies(await attachAssignees(rows));
}

export async function getTaskById(id: string) {
  const userId = await requireUserId();

  const task = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
    with: { project: true, priority: true },
  });

  if (!task || !(await canAccessProject(userId, task.projectId))) {
    throw new Error("Tarea no encontrada");
  }

  const [withAssignees] = await attachAssignees([task]);

  return withAssignees;
}

export async function getTaskAssignees(taskId: string) {
  const rows = await db.select().from(taskAssignees).where(eq(taskAssignees.taskId, taskId));
  const users = await getClerkUsersByIds(rows.map((row) => row.clerkUserId));

  return rows.map(
    (row) => users.get(row.clerkUserId) ?? { id: row.clerkUserId, name: row.clerkUserId, imageUrl: "" },
  );
}

export async function setTaskAssignees(taskId: string, clerkUserIds: string[]) {
  const userId = await requireUserId();

  const task = await db.query.tasks.findFirst({ where: eq(tasks.id, taskId) });

  if (!task || !(await canAccessProject(userId, task.projectId))) {
    throw new Error("Tarea no encontrada");
  }

  await db.delete(taskAssignees).where(eq(taskAssignees.taskId, taskId));

  const uniqueIds = [...new Set(clerkUserIds)];

  if (uniqueIds.length > 0) {
    await db.insert(taskAssignees).values(uniqueIds.map((clerkUserId) => ({ taskId, clerkUserId })));
  }

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return "Asignados actualizados correctamente";
}

export async function addTask({ projectId, taskName, description, priorityId, dueDate }: TaskAdd) {
  const userId = await requireUserId();

  if (!(await canAccessProject(userId, projectId))) {
    throw new Error("Proyecto no encontrado");
  }

  const id = randomUUID();

  await db.insert(tasks).values({ id, taskName, description, priorityId, projectId, dueDate });

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return { id, message: "Tarea creada correctamente" };
}

export async function updateTask(task: TaskEdit) {
  const userId = await requireUserId();

  const existing = await db.query.tasks.findFirst({
    where: eq(tasks.id, task.id),
  });

  if (!existing || !(await canAccessProject(userId, existing.projectId))) {
    throw new Error("Tarea no encontrada");
  }

  if (!(await canAccessProject(userId, task.projectId))) {
    throw new Error("Proyecto no encontrado");
  }

  await db
    .update(tasks)
    .set({
      taskName: task.taskName,
      description: task.description,
      priorityId: task.priorityId,
      projectId: task.projectId,
      completed: task.completed,
      dueDate: task.dueDate,
    })
    .where(eq(tasks.id, task.id));

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return "Tarea actualizada correctamente";
}

export async function deleteTask(id: string) {
  const userId = await requireUserId();

  const existing = await db.query.tasks.findFirst({
    where: eq(tasks.id, id),
  });

  if (!existing || !(await canAccessProject(userId, existing.projectId))) {
    throw new Error("Tarea no encontrada");
  }

  await db.delete(tasks).where(eq(tasks.id, id));

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return "Tarea eliminada correctamente";
}
