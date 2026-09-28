import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "cn";
import { Pencil, Loader2, Clock } from "lucide-react";
import HoldDeleteButton from "./HoldDeleteButton.jsx";
import { formatRelativeTime, formatExactDate } from "@/lib/utils.js";

export default function TaskItem({ task, loading, onToggle, onEdit, onDelete }) {
  const relativeTime = formatRelativeTime(task.created_at);
  const exactTime = formatExactDate(task.created_at);

  return (
    <div
      className={cn(
        "group relative flex items-center gap-3.5 rounded-xl border border-border/70 bg-card px-4 py-3.5 shadow-2xs transition-all duration-200 hover:border-border hover:bg-card/90 hover:shadow-xs",
        task.completed && "border-dashed border-border/50 bg-card/40 opacity-80",
        loading && "pointer-events-none opacity-50"
      )}
      id={`task-item-${task.id}`}
    >
      <div className="flex shrink-0 items-center self-center">
        {loading ? (
          <Loader2 className="size-4 animate-spin text-muted-foreground" />
        ) : (
          <Checkbox
            id={`task-toggle-${task.id}`}
            checked={task.completed}
            onCheckedChange={onToggle}
            aria-label={
              task.completed ? "Mark as incomplete" : "Mark as complete"
            }
            className="size-4.5 rounded-[5px]"
          />
        )}
      </div>

      <div className="min-w-0 flex-1 py-0.5">
        <p
          className={cn(
            "text-sm font-medium leading-snug break-all [overflow-wrap:anywhere] transition-colors",
            task.completed
              ? "text-muted-foreground line-through decoration-muted-foreground/60"
              : "text-foreground"
          )}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            className={cn(
              "mt-1 text-xs leading-relaxed text-muted-foreground break-all [overflow-wrap:anywhere] line-clamp-2",
              task.completed && "line-through opacity-70"
            )}
            title={task.description}
          >
            {task.description}
          </p>
        )}
        <div className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground/70">
          <span className="flex items-center gap-1 cursor-default" title={exactTime}>
            <Clock className="size-3 text-muted-foreground/60" />
            {relativeTime}
          </span>
          {task.completed && (
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
              Done
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 self-center items-center gap-1 opacity-60 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onEdit}
          disabled={loading}
          aria-label="Edit task"
          title="Edit task"
          id={`task-edit-${task.id}`}
          className="rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
        >
          <Pencil className="size-3.5" />
        </Button>
        <HoldDeleteButton
          taskId={task.id}
          disabled={loading}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}
