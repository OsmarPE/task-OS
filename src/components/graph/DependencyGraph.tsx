"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CheckIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { layoutGraph } from "@/lib/graph-layout";

export interface GraphTaskNode {
  id: string;
  taskName: string;
  completed: boolean;
  projectId: string;
  projectName: string;
}

export interface GraphEdge {
  taskId: string;
  dependsOnTaskId: string;
}

interface Props {
  nodes: GraphTaskNode[];
  edges: GraphEdge[];
}

type TaskNodeData = {
  label: string;
  projectName: string;
  colorVar: string;
  completed: boolean;
};

const PROJECT_COLOR_VARS = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"];

function TaskNode({ data }: NodeProps<Node<TaskNodeData>>) {
  return (
    <div
      className="rounded-lg border bg-card px-3 py-2 shadow-sm w-[220px]"
      style={{ borderLeftWidth: 4, borderLeftColor: `hsl(var(${data.colorVar}))` }}
    >
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium truncate">{data.label}</p>
        {data.completed && (
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckIcon className="size-3" />
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground truncate">{data.projectName}</p>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = { task: TaskNode };

export default function DependencyGraph({ nodes, edges }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const projectColorMap = useMemo(() => {
    const map = new Map<string, string>();
    let index = 0;

    for (const node of nodes) {
      if (!map.has(node.projectId)) {
        map.set(node.projectId, PROJECT_COLOR_VARS[index % PROJECT_COLOR_VARS.length]);
        index += 1;
      }
    }

    return map;
  }, [nodes]);

  const flowNodes = useMemo<Node<TaskNodeData>[]>(() => {
    const rawNodes: Node<TaskNodeData>[] = nodes.map((task) => ({
      id: task.id,
      type: "task",
      position: { x: 0, y: 0 },
      data: {
        label: task.taskName,
        projectName: task.projectName,
        colorVar: projectColorMap.get(task.projectId) ?? PROJECT_COLOR_VARS[0],
        completed: task.completed,
      },
    }));

    const rawEdges: Edge[] = edges.map((edge) => ({
      id: `${edge.dependsOnTaskId}-${edge.taskId}`,
      source: edge.dependsOnTaskId,
      target: edge.taskId,
    }));

    return layoutGraph(rawNodes, rawEdges);
  }, [nodes, edges, projectColorMap]);

  const flowEdges = useMemo<Edge[]>(
    () =>
      edges.map((edge) => ({
        id: `${edge.dependsOnTaskId}-${edge.taskId}`,
        source: edge.dependsOnTaskId,
        target: edge.taskId,
        animated: true,
      })),
    [edges],
  );

  return (
    <div className={cn("h-[70vh] w-full rounded-lg border")}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => router.push(`${pathname}?editTask=${node.id}`)}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  );
}
