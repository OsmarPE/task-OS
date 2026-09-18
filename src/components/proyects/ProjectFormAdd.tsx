"use client";

import { projectInitial } from "@/lib/helper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "../form/Form";
import FormItem from "../form/FormItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProject } from "@/actions/project.actions";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";

type FormValues = z.infer<typeof projectInitial>;

export default function ProjectFormAdd() {
  const client = useQueryClient();

  const pathname = usePathname();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: addProject,
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      toast.success(data);
      router.replace(pathname);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(projectInitial),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: FormValues) {
    mutate(data.name);
  }

  return (
    <Form form={form} onSubmit={onSubmit}>
      <FormItem
        name="name"
        label="Proyecto"
        control={form.control}
        placeholder="Ej. Creación de un Banco para la empresa DG"
      />
      <Button className="block ml-auto mt-4" type="submit">
        Agregar Proyecto
      </Button>
    </Form>
  );
}
