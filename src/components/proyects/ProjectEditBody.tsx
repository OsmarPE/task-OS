"use client";

import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import { projectInitial } from "@/lib/helper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProject } from "@/actions/project.actions";
import FormItem from "../form/FormItem";
import { Form } from "../form/Form";
import { Button } from "../ui/button";

type FormValues = z.infer<typeof projectInitial>;

interface Props {
  id: string;
  name: string;
}

export default function ProjectEditBody({ id, name }: Props) {
  const client = useQueryClient();

  const pathname = usePathname();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: editProject,
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      client.invalidateQueries({ queryKey: ["projectEdit"] });
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
      name,
    },
  });

  async function onSubmit(data: FormValues) {
    mutate({ name: data.name, id });
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
        Editar Proyecto
      </Button>
    </Form>
  );
}
