"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { priorityColors, taskInitialEdit } from "@/lib/helper";
import { PriorityType, TaskWithRelations } from "@/types";
import FormItem from "../form/FormItem";
import FormTextarea from "../form/FormTextarea";
import { toast } from "sonner";
import { Form } from "../form/Form";
import SelectForm from "../form/SelectForm";
import { SelectItem } from "../ui/select";
import FormCheckbox from "../form/FormCheckbox";
import { Button } from "../ui/button";
import { setTaskAssignees, updateTask } from "@/actions/task.actions";
import { addTaskDependency, getTaskDependencies, removeTaskDependency } from "@/actions/dependency.actions";
import TaskAssigneesField from "./TaskAssigneesField";
import TaskDependencyPicker, { DependencyOption } from "./TaskDependencyPicker";

type FormValues = z.infer<typeof taskInitialEdit>;

interface Props {
  task: TaskWithRelations;
  priorities: PriorityType[] | undefined;
}

export default function TaskEditSheetBody({ task, priorities }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const client = useQueryClient();

  const [assigneeIds, setAssigneeIds] = useState<string[]>(task.assignees.map((assignee) => assignee.id));
  const [dependencies, setDependencies] = useState<DependencyOption[]>([]);
  const hasLoadedDependencies = useRef(false);

  const { data: initialDependencies } = useQuery({
    queryKey: ["taskDependencies", task.id],
    queryFn: () => getTaskDependencies(task.id),
  });

  useEffect(() => {
    if (initialDependencies && !hasLoadedDependencies.current) {
      setDependencies(
        initialDependencies.map((dep) => ({ id: dep.id, taskName: dep.taskName, projectName: dep.projectName })),
      );
      hasLoadedDependencies.current = true;
    }
  }, [initialDependencies]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      const message = await updateTask({
        id: task.id,
        taskName: values.taskName,
        description: values.description || null,
        priorityId: Number(values.priorityId),
        projectId: values.projectId,
        completed: values.completed,
        dueDate: values.dueDate ? new Date(values.dueDate) : null,
      });

      await setTaskAssignees(task.id, assigneeIds);

      const originalIds = new Set((initialDependencies ?? []).map((dep) => dep.id));
      const currentIds = new Set(dependencies.map((dep) => dep.id));

      const toAdd = dependencies.filter((dep) => !originalIds.has(dep.id));
      const toRemove = (initialDependencies ?? []).filter((dep) => !currentIds.has(dep.id));

      await Promise.all([
        ...toAdd.map((dep) => addTaskDependency(task.id, dep.id)),
        ...toRemove.map((dep) => removeTaskDependency(task.id, dep.id)),
      ]);

      return message;
    },
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      client.invalidateQueries({ queryKey: ["tasks"] });
      client.invalidateQueries({ queryKey: ["taskDependencies"] });
      client.removeQueries({ queryKey: ["editTask", task.id] });
      client.invalidateQueries({ queryKey: ["tasksGraphic"] });
      toast.success(data);
      router.replace(pathname);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(taskInitialEdit),
    defaultValues: {
      taskName: task.taskName,
      priorityId: String(task.priorityId),
      completed: task.completed,
      projectId: task.projectId,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : "",
      description: task.description ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    mutate(values);
  }

  const removeTask = () => {
    router.push(`${pathname}?editTask=${task.id}&removeTask=${task.id}`);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="mt-4">
      <FormItem
        name="taskName"
        label="Tarea"
        control={form.control}
        placeholder="Ej. Creación de un Banco para la empresa DG"
      />
      <FormTextarea
        name="description"
        label="Descripción (opcional)"
        control={form.control}
        placeholder="Detalles adicionales sobre la tarea"
      />
      <SelectForm control={form.control} label="Prioridad" name="priorityId" placeholder="Seleccione una prioridad">
        {priorities?.map((priority) => (
          <SelectItem key={priority.id} value={String(priority.id)}>
            <div className="flex gap-2 items-center capitalize">
              <div
                className="size-2 rounded-full"
                style={{ backgroundColor: priorityColors[priority.name as keyof typeof priorityColors] }}
              ></div>
              {priority.name}
            </div>
          </SelectItem>
        ))}
      </SelectForm>
      <FormItem name="dueDate" label="Fecha de finalización (opcional)" type="date" control={form.control} />
      <FormCheckbox label="Tarea completada" control={form.control} name="completed" />

      <TaskAssigneesField projectId={task.projectId} value={assigneeIds} onChange={setAssigneeIds} />

      <TaskDependencyPicker
        excludeTaskId={task.id}
        value={dependencies}
        onAdd={(option) => setDependencies((prev) => [...prev, option])}
        onRemove={(id) => setDependencies((prev) => prev.filter((dep) => dep.id !== id))}
      />

      <Button className="w-full py-5 mt-4" disabled={isPending}>
        Editar Tarea
      </Button>
      <Button onClick={removeTask} type="button" className="w-full" variant={"outline"}>
        Eliminar Tarea
      </Button>
    </Form>
  );
}
