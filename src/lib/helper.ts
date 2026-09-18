import { z } from "zod";

export const projectInitial = z.object({
  name: z.string().min(5, {
    message: "El nombre debe tener al menos 5 caracteres.",
  }),
});

export const taskInitial = z.object({
  taskName: z.string().min(5, {
    message: "El nombre debe tener al menos 5 caracteres.",
  }),
  priorityId: z.string().min(1, {
    message: "La prioridad es obligatoria",
  }),
  dueDate: z.string().optional(),
  description: z.string().optional(),
});

export const taskInitialEdit = taskInitial.merge(
  z.object({
    completed: z.boolean(),
    projectId: z.string().min(1, {
      message: "El proyecto es obligatorio",
    }),
  }),
);

export enum priorityColors {
  mayor = "#34d399",
  intermedio = "#fbbf24",
  menor = "#f87171",
}
