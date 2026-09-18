"use client";

import { useState } from "react";
import { taskInitial } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../form/Form";
import FormItem from "../form/FormItem";
import FormTextarea from "../form/FormTextarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { addTask, setTaskAssignees } from "@/actions/task.actions";
import SelectForm from "../form/SelectForm";
import { SelectItem } from "../ui/select";
import { getPriorities } from "@/actions/priority.actions";
import { Button } from "../ui/button";
import TaskAssigneesField from "./TaskAssigneesField";

type FormValues = z.infer<typeof taskInitial>;

export default function TaskFormAdd() {
  const search = useSearchParams();
  const projectId = search.get("addTask") ?? "";
  const client = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);

  const { mutate } = useMutation({
    mutationFn: async (values: FormValues) => {
      const { id, message } = await addTask({
        taskName: values.taskName,
        description: values.description || null,
        priorityId: Number(values.priorityId),
        projectId,
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
      });

      if (assigneeIds.length > 0) {
        await setTaskAssignees(id, assigneeIds);
      }

      return message;
    },
    onSuccess: (message) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      client.invalidateQueries({ queryKey: ["tasksGraphic"] });
      toast.success(message);
      router.push(pathname);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { data } = useQuery({
    queryKey: ["priorities"],
    queryFn: getPriorities,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(taskInitial),
    defaultValues: {
      taskName: "",
      priorityId: "",
      dueDate: "",
      description: "",
    },
  });

  async function onSubmit(values: FormValues) {
    mutate(values);
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormItem
        name="taskName"
        label="Nombre de la Tarea"
        control={form.control}
        placeholder="Ej. Configuración de la Base de datos"
      />
      <FormTextarea
        name="description"
        label="Descripción (opcional)"
        control={form.control}
        placeholder="Detalles adicionales sobre la tarea"
      />
      <SelectForm label="Prioridad" placeholder="Seleccionar Prioridad" name="priorityId" control={form.control}>
        {data?.map(({ id, name }) => (
          <SelectItem key={id} value={String(id)}>
            {name}
          </SelectItem>
        ))}
      </SelectForm>
      <FormItem
        name="dueDate"
        label="Fecha de finalización (opcional)"
        type="date"
        control={form.control}
      />
      <TaskAssigneesField projectId={projectId} value={assigneeIds} onChange={setAssigneeIds} />
      <Button className="block ml-auto mt-4" type="submit">
        Agregar Tarea
      </Button>
    </Form>
  );
}
