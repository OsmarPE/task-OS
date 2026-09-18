"use server";

import { and, eq, inArray, like, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { projects, taskDependencies, tasks } from "@/db/schema";
import { canAccessProject, getAccessibleProjectIds, requireUserId } from "@/lib/auth";
import { wouldCreateCycle } from "@/lib/dependency-graph";

export async function searchTasks(query: string, excludeTaskId?: string) {
  const userId = await requireUserId();
  const projectIds = await getAccessibleProjectIds(userId);

  if (projectIds.length === 0 || query.trim().length === 0) return [];

  const rows = await db
    .select({
      id: tasks.id,
      taskName: tasks.taskName,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(
      and(
        inArray(tasks.projectId, projectIds),
        like(tasks.taskName, `%${query}%`),
        excludeTaskId ? ne(tasks.id, excludeTaskId) : undefined,
      ),
    )
    .limit(20);

  return rows;
}

export async function getTaskDependencies(taskId: string) {
  const rows = await db
    .select({
      id: tasks.id,
      taskName: tasks.taskName,
      completed: tasks.completed,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.dependsOnTaskId, tasks.id))
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(eq(taskDependencies.taskId, taskId));

  return rows;
}

export async function getDependencyGraph() {
  const userId = await requireUserId();
  const projectIds = await getAccessibleProjectIds(userId);

  if (projectIds.length === 0) return { nodes: [], edges: [] };

  const nodes = await db
    .select({
      id: tasks.id,
      taskName: tasks.taskName,
      completed: tasks.completed,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(tasks)
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(inArray(tasks.projectId, projectIds));

  const taskIds = nodes.map((node) => node.id);

  const edgeRows = taskIds.length > 0
    ? await db.select().from(taskDependencies).where(inArray(taskDependencies.taskId, taskIds))
    : [];

  const validTaskIds = new Set(taskIds);
  const edges = edgeRows
    .filter((edge) => validTaskIds.has(edge.dependsOnTaskId))
    .map((edge) => ({ taskId: edge.taskId, dependsOnTaskId: edge.dependsOnTaskId }));

  return { nodes, edges };
}

export async function getTaskDependents(taskId: string) {
  const rows = await db
    .select({
      id: tasks.id,
      taskName: tasks.taskName,
      completed: tasks.completed,
      projectId: tasks.projectId,
      projectName: projects.name,
    })
    .from(taskDependencies)
    .innerJoin(tasks, eq(taskDependencies.taskId, tasks.id))
    .innerJoin(projects, eq(tasks.projectId, projects.id))
    .where(eq(taskDependencies.dependsOnTaskId, taskId));

  return rows;
}

export async function addTaskDependency(taskId: string, dependsOnTaskId: string) {
  const userId = await requireUserId();

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));
  const [dependsOnTask] = await db.select().from(tasks).where(eq(tasks.id, dependsOnTaskId));

  if (!task || !dependsOnTask) {
    throw new Error("Tarea no encontrada");
  }

  if (
    !(await canAccessProject(userId, task.projectId)) ||
    !(await canAccessProject(userId, dependsOnTask.projectId))
  ) {
    throw new Error("No tienes acceso a una de las tareas");
  }

  if (taskId === dependsOnTaskId) {
    throw new Error("Una tarea no puede depender de sí misma");
  }

  if (await wouldCreateCycle(taskId, dependsOnTaskId)) {
    throw new Error("Esto crearía una dependencia circular");
  }

  await db
    .insert(taskDependencies)
    .values({ taskId, dependsOnTaskId })
    .onDuplicateKeyUpdate({ set: { taskId } });

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return "Dependencia agregada correctamente";
}

export async function removeTaskDependency(taskId: string, dependsOnTaskId: string) {
  const userId = await requireUserId();

  const [task] = await db.select().from(tasks).where(eq(tasks.id, taskId));

  if (!task || !(await canAccessProject(userId, task.projectId))) {
    throw new Error("Tarea no encontrada");
  }

  await db
    .delete(taskDependencies)
    .where(and(eq(taskDependencies.taskId, taskId), eq(taskDependencies.dependsOnTaskId, dependsOnTaskId)));

  revalidatePath("/main/projects");
  revalidatePath("/main/list");

  return "Dependencia eliminada correctamente";
}
