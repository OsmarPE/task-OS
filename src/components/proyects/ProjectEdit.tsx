"use client";

import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/actions/project.actions";
import { useSearchParams } from "next/navigation";
import ProjectEditBody from "./ProjectEditBody";

export default function ProjectEdit() {
  const search = useSearchParams();
  const id = search.get("editproject") ?? "";

  const { data } = useQuery({
    queryKey: ["projectEdit", id],
    queryFn: () => getProjectById(id),
    enabled: Boolean(id),
  });

  if (data) return <ProjectEditBody name={data.name} id={id} />;
}
