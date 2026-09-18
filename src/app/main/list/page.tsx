"use client";

import Loading from "@/components/Loading";
import { columns } from "@/components/payments/columns";
import { TableListTasks } from "@/components/Table/TableListTasks";
import TaskActions from "@/components/task/TaskActions";
import { getTasksWithPopulateProject } from "@/actions/task.actions";
import { useQuery } from "@tanstack/react-query";

export default function ListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => getTasksWithPopulateProject(),
  });

  return (
    <div>
      <h2 className="font-bold text-2xl">Tareas</h2>
      <p className="text-gray-400">Podras observar la lista de forma general de cada una de las tareas</p>
      <div className="max-w-screen-lg mt-6">
        {isLoading ? <Loading /> : <TableListTasks columns={columns} data={data ?? []} />}
      </div>

      <TaskActions />
    </div>
  );
}
