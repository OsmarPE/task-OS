"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import SheetModal from "../sheet/SheetModal";
import { getTaskById } from "@/actions/task.actions";
import { getPriorities } from "@/actions/priority.actions";
import TaskEditSheetBody from "./TaskEditSheetBody";
import Loading from "../Loading";

export default function TaskEditSheet() {
  const search = useSearchParams();
  const id = search.get("editTask") ?? "";
  const open = Boolean(id);

  const { data, isLoading } = useQuery({
    queryKey: ["editTask", id],
    queryFn: () => getTaskById(id),
    enabled: open,
  });

  const { data: priorities } = useQuery({
    queryKey: ["priorities"],
    queryFn: getPriorities,
  });

  return (
    <SheetModal
      title="Editar Tarea"
      description="Puedes modificar o eliminar la informacion de la tarea"
      open={open}
    >
      {isLoading ? <Loading className="mt-4" /> : data ? <TaskEditSheetBody task={data} priorities={priorities} /> : null}
    </SheetModal>
  );
}
