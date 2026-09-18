"use client";

import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProgressMenu from "@/components/ProgressMenu";
import Modal from "@/components/Modal";
import Projects from "@/components/proyects/Projects";
import ProjectFormAdd from "@/components/proyects/ProjectFormAdd";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import TaskFormAdd from "@/components/task/TaskFormAdd";
import TaskEditSheet from "@/components/task/TaskEditSheet";
import TaskRemove from "@/components/task/TaskRemove";

export default function ProjectsPage() {
  const search = useSearchParams();
  const pathname = usePathname();
  const showFormAdd = Boolean(search.get("add"));
  const showModalAddTask = Boolean(search.get("addTask"));

  return (
    <div className="max-w-screen-2xl">
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between">
        <div>
          <h2 className="font-bold text-2xl">Mis Proyectos</h2>
          <p className="text-gray-400">Aqui podras ver tus proyectos y tu progreso</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <ProgressMenu />
          <Button asChild>
            <Link href={`${pathname}?add=true`} className="gap-1 w-full md:w-auto">
              <PlusIcon width={16} height={16} />
              Agregar
            </Link>
          </Button>
          <Modal open={showFormAdd} pathname={pathname} title="Agregar Proyecto" description="Ingrese la información relacionado con el proyecto">
            <ProjectFormAdd />
          </Modal>
          <Modal open={showModalAddTask} pathname={pathname} title="Agregar Tarea Nueva">
            <TaskFormAdd />
          </Modal>
        </div>
      </div>
      <Projects />
      <TaskEditSheet />
      <TaskRemove />
    </div>
  );
}
