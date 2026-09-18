"use server";

import { randomUUID } from "crypto";
import { and, desc, eq, inArray, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { projectMembers, projects, taskAssignees } from "@/db/schema";
import { canAccessProject, requireUserId } from "@/lib/auth";
import { getClerkUsersByIds } from "@/lib/clerk-users";

export async function getProjects() {
  const userId = await requireUserId();

  const memberships = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.clerkUserId, userId));

  const memberProjectIds = memberships.map((m) => m.projectId);

  const projectRows = await db.query.projects.findMany({
    where: memberProjectIds.length > 0
      ? or(eq(projects.clerkUserId, userId), inArray(projects.id, memberProjectIds))
      : eq(projects.clerkUserId, userId),
    with: { tasks: true },
    orderBy: [desc(projects.createdAt)],
  });

  const taskIds = projectRows.flatMap((project) => project.tasks.map((task) => task.id));

  if (taskIds.length === 0) {
    return projectRows.map((project) => ({
      ...project,
      tasks: project.tasks.map((task) => ({ ...task, assignees: [] })),
    }));
  }

  const assigneeRows = await db
    .select()
    .from(taskAssignees)
    .where(inArray(taskAssignees.taskId, taskIds));

  const users = await getClerkUsersByIds(assigneeRows.map((row) => row.clerkUserId));

  return projectRows.map((project) => ({
    ...project,
    tasks: project.tasks.map((task) => ({
      ...task,
      assignees: assigneeRows
        .filter((assignee) => assignee.taskId === task.id)
        .map(
          (assignee) =>
            users.get(assignee.clerkUserId) ?? { id: assignee.clerkUserId, name: assignee.clerkUserId, imageUrl: "" },
        ),
    })),
  }));
}

export async function getProjectSummary(id: string) {
  const userId = await requireUserId();

  if (!(await canAccessProject(userId, id))) {
    throw new Error("Proyecto no encontrado");
  }

  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  if (!project) {
    throw new Error("Proyecto no encontrado");
  }

  return project;
}

export async function getProjectById(id: string) {
  const userId = await requireUserId();

  const project = await db.query.projects.findFirst({
    where: and(eq(projects.id, id), eq(projects.clerkUserId, userId)),
  });

  if (!project) {
    throw new Error("Proyecto no encontrado");
  }

  return project;
}

export async function addProject(name: string) {
  const userId = await requireUserId();

  await db.insert(projects).values({ id: randomUUID(), name, clerkUserId: userId });

  revalidatePath("/main/projects");

  return "Proyecto creado correctamente";
}

export async function editProject({ id, name }: { id: string; name: string }) {
  const userId = await requireUserId();

  await db
    .update(projects)
    .set({ name })
    .where(and(eq(projects.id, id), eq(projects.clerkUserId, userId)));

  revalidatePath("/main/projects");

  return "Proyecto actualizado correctamente";
}

export async function removeProjectById(id: string) {
  const userId = await requireUserId();

  await db
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.clerkUserId, userId)));

  revalidatePath("/main/projects");

  return "Proyecto eliminado correctamente";
}
