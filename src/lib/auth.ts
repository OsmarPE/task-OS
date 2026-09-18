import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { projectMembers, projects } from "@/db/schema";

export async function requireUserId() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No autenticado");
  }

  return userId;
}

export async function canAccessProject(userId: string, projectId: string): Promise<boolean> {
  const [owned] = await db
    .select({ id: projects.id })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.clerkUserId, userId)));

  if (owned) return true;

  const [member] = await db
    .select({ projectId: projectMembers.projectId })
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.clerkUserId, userId)));

  return Boolean(member);
}

export async function requireProjectAccess(projectId: string) {
  const userId = await requireUserId();

  if (!(await canAccessProject(userId, projectId))) {
    throw new Error("No tienes acceso a este proyecto");
  }

  return userId;
}

export async function getAccessibleProjectIds(userId: string) {
  const owned = await db
    .select({ id: projects.id })
    .from(projects)
    .where(eq(projects.clerkUserId, userId));

  const memberOf = await db
    .select({ id: projectMembers.projectId })
    .from(projectMembers)
    .where(eq(projectMembers.clerkUserId, userId));

  return [...new Set([...owned.map((row) => row.id), ...memberOf.map((row) => row.id)])];
}
