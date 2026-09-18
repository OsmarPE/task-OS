"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { projectMembers, projects } from "@/db/schema";
import { requireProjectAccess, requireUserId } from "@/lib/auth";
import { getClerkUserById, getClerkUsersByIds } from "@/lib/clerk-users";

async function requireProjectOwner(projectId: string) {
  const userId = await requireUserId();

  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.clerkUserId, userId)));

  if (!project) {
    throw new Error("Solo el dueño del proyecto puede gestionar los miembros");
  }

  return project;
}

export async function getProjectMembers(projectId: string) {
  await requireProjectAccess(projectId);

  const [project] = await db.select().from(projects).where(eq(projects.id, projectId));

  if (!project) throw new Error("Proyecto no encontrado");

  const members = await db
    .select()
    .from(projectMembers)
    .where(eq(projectMembers.projectId, projectId));

  const ids = [project.clerkUserId, ...members.map((m) => m.clerkUserId)];
  const users = await getClerkUsersByIds(ids);

  return [
    {
      clerkUserId: project.clerkUserId,
      isOwner: true,
      ...(users.get(project.clerkUserId) ?? { id: project.clerkUserId, name: project.clerkUserId, imageUrl: "" }),
    },
    ...members.map((member) => ({
      clerkUserId: member.clerkUserId,
      isOwner: false,
      ...(users.get(member.clerkUserId) ?? {
        id: member.clerkUserId,
        name: member.clerkUserId,
        imageUrl: "",
      }),
    })),
  ];
}

export async function addProjectMember(projectId: string, clerkUserId: string) {
  const project = await requireProjectOwner(projectId);

  if (project.clerkUserId === clerkUserId) {
    throw new Error("Esa persona ya es el dueño del proyecto");
  }

  const user = await getClerkUserById(clerkUserId);

  if (!user) {
    throw new Error("No existe ningún usuario con ese Clerk User ID");
  }

  const [existing] = await db
    .select()
    .from(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.clerkUserId, clerkUserId)));

  if (existing) {
    throw new Error("Esa persona ya es miembro del proyecto");
  }

  await db.insert(projectMembers).values({ projectId, clerkUserId });

  revalidatePath("/main/projects");

  return `${user.name} fue agregado al proyecto`;
}

export async function removeProjectMember(projectId: string, clerkUserId: string) {
  await requireProjectOwner(projectId);

  await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, projectId), eq(projectMembers.clerkUserId, clerkUserId)));

  revalidatePath("/main/projects");

  return "Miembro eliminado del proyecto";
}
