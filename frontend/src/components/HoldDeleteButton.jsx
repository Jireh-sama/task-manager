import { Trash2 } from "lucide-react";
import { cn } from "cn";
import { useHoldProgress } from "@/hooks/useHoldProgress.js";

const RADIUS = 12;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function HoldDeleteButton({
  onDelete,
  disabled = false,
  taskId,
  className,
  holdDuration = 750,
}) {
  const { progress, isHolding, holdProps } = useHoldProgress({
    duration: holdDuration,
    onComplete: onDelete,
    disabled,
  });

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <button
      type="button"
      id={`task-delete-${taskId}`}
      disabled={disabled}
      aria-label="Hold to delete task"
      title="Hold to delete (0.75s)"
      {...holdProps}
      className={cn(
        "relative flex size-7 shrink-0 items-center justify-center rounded-full transition-all select-none touch-none outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
        "text-muted-foreground hover:text-destructive hover:bg-muted/60",
        isHolding && "text-destructive bg-destructive/10 scale-95",
        disabled && "pointer-events-none opacity-50",
        className
      )}
    >
      <svg
        className={cn(
          "pointer-events-none absolute inset-0 size-full -rotate-90 transition-opacity duration-150",
          isHolding ? "opacity-100" : "opacity-0"
        )}
        viewBox="0 0 28 28"
        fill="none"
        aria-hidden="true"
      >
        <circle
          cx="14"
          cy="14"
          r={RADIUS}
          strokeWidth="2.5"
          stroke="currentColor"
          className="text-destructive/20"
        />
        <circle
          cx="14"
          cy="14"
          r={RADIUS}
          strokeWidth="2.5"
          stroke="currentColor"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-destructive"
        />
      </svg>

      <Trash2
        className={cn(
          "size-3.5 transition-transform duration-150",
          isHolding && "scale-110"
        )}
      />
    </button>
  );
}
