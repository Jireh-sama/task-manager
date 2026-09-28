import TaskItem from "./TaskItem.jsx";

export default function TaskList({
  tasks,
  actionLoading,
  onToggle,
  onEdit,
  onDelete,
}) {
  return (
    <div className="flex flex-col gap-2" id="task-list">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          loading={actionLoading === task.id}
          onToggle={() => onToggle(task)}
          onEdit={() => onEdit(task)}
          onDelete={() => onDelete(task.id)}
        />
      ))}
    </div>
  );
}
