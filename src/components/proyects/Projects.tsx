"use client";

import { useQuery } from "@tanstack/react-query";
import ProjectItem from "./ProjectItem";
import ProjectList from "./ProjectList";
import { getProjects } from "@/actions/project.actions";
import { usePathname, useSearchParams } from "next/navigation";
import Modal from "../Modal";
import ProjectRemove from "./ProjectRemove";
import Loading from "../Loading";
import ProjectEdit from "./ProjectEdit";
import ProjectMembers from "./ProjectMembers";
import { useMemo } from "react";

export default function Projects() {
  const pathname = usePathname();
  const search = useSearchParams();
  const idProject = Boolean(search.get("id"));
  const idProjectEdit = Boolean(search.get("editproject"));
  const membersProjectId = search.get("members") ?? "";

  const { data, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjects(),
  });

  const projectsFinished = useMemo(() => {
    if (!data) return 0;
    return data.filter((project) => project.tasks && project.tasks.every((task) => task.completed)).length;
  }, [data]);

  if (isLoading) return <Loading className="mt-4" />;

  if (data)
    return (
      <>
        <p className="text-sm mt-3 text-gray-400">
          Haz completado <span className="text-primary">{projectsFinished} de {data.length} proyectos</span>
        </p>
        <ProjectList>
          {data.map((project) => (
            <ProjectItem key={project.id} project={project} />
          ))}
        </ProjectList>

        <Modal
          open={idProject}
          pathname={pathname}
          title="¿Deseas eliminar este proyecto?"
          description="Estas apunto de eliminar un proyecto el cual no podra ser recuperado una vez eliminado"
        >
          <ProjectRemove pathname={pathname} />
        </Modal>

        <Modal open={idProjectEdit} pathname={pathname} title="Editar proyecto" description="Modifica el nombre del proyecto">
          <ProjectEdit />
        </Modal>

        <Modal
          open={Boolean(membersProjectId)}
          pathname={pathname}
          title="Miembros del proyecto"
          description="Las personas agregadas aquí pueden ver el proyecto y asignarse tareas"
        >
          {membersProjectId && <ProjectMembers projectId={membersProjectId} />}
        </Modal>
      </>
    );
}
