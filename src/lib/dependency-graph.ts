import { db } from "@/db/client";
import { taskDependencies } from "@/db/schema";

/**
 * Adding an edge taskId -> dependsOnTaskId would create a cycle if dependsOnTaskId
 * can already reach taskId by following existing "depends on" edges.
 */
export async function wouldCreateCycle(taskId: string, dependsOnTaskId: string): Promise<boolean> {
  if (taskId === dependsOnTaskId) return true;

  const edges = await db.select().from(taskDependencies);

  const adjacency = new Map<string, string[]>();
  for (const edge of edges) {
    adjacency.set(edge.taskId, [...(adjacency.get(edge.taskId) ?? []), edge.dependsOnTaskId]);
  }

  const visited = new Set<string>();
  const stack = [dependsOnTaskId];

  while (stack.length > 0) {
    const current = stack.pop() as string;

    if (current === taskId) return true;
    if (visited.has(current)) continue;

    visited.add(current);
    stack.push(...(adjacency.get(current) ?? []));
  }

  return false;
}
