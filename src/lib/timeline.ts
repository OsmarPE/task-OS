import { TaskWithRelations } from "@/types";

export interface ProjectTimelineData {
  project: { id: string; name: string };
  steps: TaskWithRelations[][];
}

function computeLevels(tasks: TaskWithRelations[]) {
  const byId = new Map(tasks.map((task) => [task.id, task]));
  const levelById = new Map<string, number>();
  const visiting = new Set<string>();

  function levelOf(id: string): number {
    if (levelById.has(id)) return levelById.get(id)!;
    if (visiting.has(id)) return 0;

    visiting.add(id);

    const deps = byId.get(id)?.dependencies ?? [];
    const level = deps.length === 0 ? 0 : 1 + Math.max(...deps.map((dep) => levelOf(dep.id)));

    visiting.delete(id);
    levelById.set(id, level);

    return level;
  }

  tasks.forEach((task) => levelOf(task.id));

  return levelById;
}

export function buildProjectTimelines(tasks: TaskWithRelations[]): ProjectTimelineData[] {
  const levelById = computeLevels(tasks);

  const projectsById = new Map<string, ProjectTimelineData>();

  for (const task of tasks) {
    if (!projectsById.has(task.project.id)) {
      projectsById.set(task.project.id, {
        project: { id: task.project.id, name: task.project.name },
        steps: [],
      });
    }
  }

  for (const timeline of projectsById.values()) {
    const projectTasks = tasks.filter((task) => task.project.id === timeline.project.id);
    const maxLevel = Math.max(...projectTasks.map((task) => levelById.get(task.id) ?? 0));

    for (let level = 0; level <= maxLevel; level += 1) {
      timeline.steps.push(
        projectTasks
          .filter((task) => (levelById.get(task.id) ?? 0) === level)
          .sort((a, b) => a.taskName.localeCompare(b.taskName)),
      );
    }
  }

  return Array.from(projectsById.values()).sort((a, b) => a.project.name.localeCompare(b.project.name));
}
