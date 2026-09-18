"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Modal from "../Modal";
import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/actions/task.actions";
import { toast } from "sonner";

export default function TaskRemove() {
  const pathname = usePathname();
  const search = useSearchParams();
  const id = search.get("removeTask") ?? "";
  const open = Boolean(id);
  const router = useRouter();
  const client = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      client.invalidateQueries({ queryKey: ["tasks"] });
      client.invalidateQueries({ queryKey: ["tasksGraphic"] });
      toast.success(data);
      router.replace(pathname);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeTaskById = () => {
    mutate(id);
  };

  return (
    <Modal open={open} pathname={pathname} title="¿Desea eliminar esta tarea?" description="Estas a punto de eliminar esta tarea">
      <div className="flex justify-end gap-3">
        <Button asChild variant={"outline"}>
          <Link href={pathname}>Cancelar</Link>
        </Button>
        <Button variant={"destructive"} onClick={removeTaskById}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
}
