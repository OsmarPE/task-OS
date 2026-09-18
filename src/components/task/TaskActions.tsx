import TaskEditSheet from "./TaskEditSheet";
import TaskRemove from "./TaskRemove";

export default function TaskActions() {
  return (
    <>
      <TaskRemove />
      <TaskEditSheet />
    </>
  );
}
