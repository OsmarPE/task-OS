import { Fragment } from "react";
import { ArrowRightIcon } from "lucide-react";
import { ProjectTimelineData } from "@/lib/timeline";
import TimelineTaskCard from "./TimelineTaskCard";

interface Props {
  timeline: ProjectTimelineData;
}

export default function ProjectTimeline({ timeline }: Props) {
  return (
    <div>
      <h3 className="font-semibold mb-3">{timeline.project.name}</h3>
      <div className="flex items-start gap-3 overflow-x-auto pb-2">
        {timeline.steps.map((stepTasks, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <ArrowRightIcon className="mt-6 size-5 shrink-0 text-muted-foreground" />
            )}
            <div className="flex flex-col gap-2 shrink-0">
              {stepTasks.map((task) => (
                <TimelineTaskCard key={task.id} task={task} />
              ))}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
