"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { removeProjectById } from "@/actions/project.actions";

interface Props {
  pathname: string;
}

export default function ProjectRemove({ pathname }: Props) {
  const search = useSearchParams();
  const client = useQueryClient();
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: removeProjectById,
    onSuccess: (data) => {
      client.invalidateQueries({ queryKey: ["projects"] });
      toast.success(data);
      router.replace(pathname);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const removeProject = () => {
    const id = search.get("id");
    id && mutate(id);
  };

  return (
    <div className="flex justify-end gap-3">
      <Button asChild variant={"outline"}>
        <Link href={pathname}>Cancelar</Link>
      </Button>
      <Button variant={"destructive"} onClick={removeProject}>
        Eliminar
      </Button>
    </div>
  );
}
