"use client";

import { useQuery } from "@tanstack/react-query";
import { getDependencyGraph } from "@/actions/dependency.actions";
import DependencyGraph from "@/components/graph/DependencyGraph";
import TaskEditSheet from "@/components/task/TaskEditSheet";
import TaskRemove from "@/components/task/TaskRemove";
import Loading from "@/components/Loading";

export default function GraphPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dependencyGraph"],
    queryFn: getDependencyGraph,
  });

  return (
    <div className="max-w-screen-2xl grid gap-6">
      <div>
        <h2 className="font-bold text-2xl">Grafo de dependencias</h2>
        <p className="text-gray-400">
          Todas tus tareas y cómo se relacionan entre sí, sin importar el proyecto
        </p>
      </div>

      {isLoading ? (
        <Loading className="mt-4" />
      ) : data && data.nodes.length > 0 ? (
        <DependencyGraph nodes={data.nodes} edges={data.edges} />
      ) : (
        <p className="text-sm text-gray-400">Todavía no tienes tareas para mostrar en el grafo.</p>
      )}

      <TaskEditSheet />
      <TaskRemove />
    </div>
  );
}
