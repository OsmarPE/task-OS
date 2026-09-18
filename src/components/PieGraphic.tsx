"use client";

import { useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { datesGraphicType } from "@/types";

interface Props {
  data: datesGraphicType;
  totalPorcent: number;
}

const chartConfig = {
  chrome: {
    label: "Chrome",
    color: "hsl(var(--primary))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--secondary))",
  },
} satisfies ChartConfig;

export default function PieGraphic({ data, totalPorcent }: Props) {
  const { completed, incompleted } = data;

  const chartData = useMemo(
    () => [
      { browser: "Proyectos Completados ", visitors: completed, fill: "var(--color-chrome)" },
      { browser: "Restantes", visitors: incompleted, fill: "var(--color-safari)" },
    ],
    [completed, incompleted],
  );

  return (
    <Card className="flex flex-col border-0 shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl">Tareas Completados</CardTitle>
        <CardDescription className="text-center">
          Total de las tareas acompletadas de los proyectos en general
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} strokeWidth={5}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {`${totalPorcent.toFixed(0)}%`}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground"></tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-semibold leading-none">
          {completed} {completed > 0 ? "Tareas Terminadas" : "Tarea Terminada"} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          {incompleted} {completed > 0 ? "Tareas Restantes" : "Tarea Restante"}
        </div>
      </CardFooter>
    </Card>
  );
}
