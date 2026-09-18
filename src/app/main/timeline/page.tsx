"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTasksWithPopulateProject } from "@/actions/task.actions";
import { buildProjectTimelines } from "@/lib/timeline";
import ProjectTimeline from "@/components/timeline/ProjectTimeline";
import TaskEditSheet from "@/components/task/TaskEditSheet";
import TaskRemove from "@/components/task/TaskRemove";
import Loading from "@/components/Loading";

export default function TimelinePage() {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksWithPopulateProject(),
  });

  const timelines = useMemo(() => buildProjectTimelines(data ?? []), [data]);

  return (
    <div className="max-w-screen-2xl grid gap-8">
      <div>
        <h2 className="font-bold text-2xl">Línea de tiempo</h2>
        <p className="text-gray-400">
          El orden en que se pueden ir completando las tareas de cada proyecto, según sus dependencias
        </p>
      </div>

      {isLoading ? (
        <Loading className="mt-4" />
      ) : timelines.length > 0 ? (
        <div className="grid gap-10">
          {timelines.map((timeline) => (
            <ProjectTimeline key={timeline.project.id} timeline={timeline} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">Todavía no tienes tareas para mostrar.</p>
      )}

      <TaskEditSheet />
      <TaskRemove />
    </div>
  );
}
