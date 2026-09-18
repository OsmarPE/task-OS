"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  CircleIcon,
  ListTodoIcon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";
import { getProjectSummary } from "@/actions/project.actions";
import { getTasksByProject } from "@/actions/task.actions";
import { getProjectMembers } from "@/actions/member.actions";
import { columns } from "@/components/payments/columns";
import { TableListTasks } from "@/components/Table/TableListTasks";
import TaskEditSheet from "@/components/task/TaskEditSheet";
import TaskRemove from "@/components/task/TaskRemove";
import TaskFormAdd from "@/components/task/TaskFormAdd";
import Modal from "@/components/Modal";
import ProjectMembers from "@/components/proyects/ProjectMembers";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { calculateTaskCompleted, cn, formatDate } from "@/lib/utils";
import type { ComponentType, SVGProps } from "react";

interface StatTileProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  value: number;
  tone?: "default" | "good";
}

function StatTile({ icon: Icon, label, value, tone = "default" }: StatTileProps) {
  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
            tone === "good" ? "bg-green-100 text-green-600" : "bg-primary/10 text-primary",
          )}
        >
          <Icon className="size-4" />
        </div>
        <div>
          <p className="text-2xl font-bold leading-none">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const pathname = usePathname();
  const search = useSearchParams();
  const showModalAddTask = Boolean(search.get("addTask"));
  const { userId, isLoaded } = useAuth();
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const hasAppliedDefaultFilter = useRef(false);

  useEffect(() => {
    if (isLoaded && userId && !hasAppliedDefaultFilter.current) {
      setAssigneeFilter(userId);
      hasAppliedDefaultFilter.current = true;
    }
  }, [isLoaded, userId]);

  const { data: project, isLoading: isLoadingProject } = useQuery({
    queryKey: ["projectSummary", id],
    queryFn: () => getProjectSummary(id),
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ["projectTasks", id],
    queryFn: () => getTasksByProject(id),
  });

  const { data: members } = useQuery({
    queryKey: ["projectMembers", id],
    queryFn: () => getProjectMembers(id),
    enabled: Boolean(id),
  });

  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    if (assigneeFilter === "all") return tasks;
    if (assigneeFilter === "unassigned") return tasks.filter((task) => task.assignees.length === 0);
    return tasks.filter((task) => task.assignees.some((assignee) => assignee.id === assigneeFilter));
  }, [tasks, assigneeFilter]);

  const taskSize = tasks?.length ?? 0;
  const taskCompleted = useMemo(() => (tasks ? calculateTaskCompleted(tasks) : 0), [tasks]);
  const porcent = taskSize > 0 ? (taskCompleted * 100) / taskSize : 0;

  if (isLoadingProject) return <Loading className="mt-4" />;

  if (!project) return null;

  return (
    <div className="max-w-screen-2xl grid gap-6">
      <div>
        <Link
          href="/main/projects"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeftIcon className="size-3.5" /> Proyectos
        </Link>
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:justify-between mt-2">
          <div>
            <h2 className="font-bold text-2xl md:text-3xl">{project.name}</h2>
            <p className="text-gray-400 text-sm">Creado el {formatDate(new Date(project.createdAt))}</p>
          </div>
          <Button asChild>
            <Link href={`${pathname}?addTask=${id}`} className="gap-1">
              <PlusIcon width={16} height={16} />
              Agregar Tarea
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <StatTile icon={ListTodoIcon} label="Tareas totales" value={taskSize} />
        <StatTile icon={CheckCircle2Icon} label="Completadas" value={taskCompleted} tone="good" />
        <StatTile icon={CircleIcon} label="Pendientes" value={taskSize - taskCompleted} />
        <StatTile icon={UsersIcon} label="Miembros" value={members?.length ?? 0} />
      </div>

      {taskSize > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <p className="font-medium">Progreso general</p>
              <span className="text-muted-foreground">{porcent.toFixed(0)}%</span>
            </div>
            <Progress value={porcent} className="h-2" />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card>
          <CardHeader className="flex-row items-center justify-between gap-4 space-y-0">
            <CardTitle className="text-base">Tareas</CardTitle>
            <Select value={assigneeFilter} onValueChange={setAssigneeFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por persona" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las personas</SelectItem>
                <SelectItem value="unassigned">Sin asignar</SelectItem>
                {members?.map((member) => (
                  <SelectItem key={member.clerkUserId} value={member.clerkUserId}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {isLoadingTasks ? <Loading /> : <TableListTasks columns={columns} data={filteredTasks} />}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Miembros</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectMembers projectId={id} />
          </CardContent>
        </Card>
      </div>

      <Modal open={showModalAddTask} pathname={pathname} title="Agregar Tarea Nueva">
        <TaskFormAdd />
      </Modal>
      <TaskEditSheet />
      <TaskRemove />
    </div>
  );
}
