import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Loader2, Plus, Sparkles } from "lucide-react";

export default function TaskForm({ onSubmit, loading }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError("Title is required.");
      return;
    }
    setValidationError("");
    onSubmit({ title: trimmed, description: description.trim() || null });
    setTitle("");
    setDescription("");
  };

  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <Card className="rounded-xl border border-border/70 bg-card/70 shadow-xs backdrop-blur-xs transition-all duration-200 hover:border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4.5 px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold tracking-tight">
              Create New Task
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Add details and stay ahead of your schedule.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-0">
        <form
          className="flex flex-col gap-3.5 min-w-0 max-w-full"
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          id="task-create-form"
        >
          <div className="flex flex-col gap-1.5 min-w-0 max-w-full">
            <Label htmlFor="task-title" className="text-xs font-medium text-foreground/90">
              Task Title
            </Label>
            <Input
              id="task-title"
              placeholder="e.g. Review pull request or buy groceries"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              aria-invalid={!!validationError}
              disabled={loading}
              className="h-9 text-sm min-w-0 max-w-full"
              autoFocus
            />
            {validationError && (
              <p className="text-xs text-destructive">{validationError}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5 min-w-0 max-w-full">
            <div className="flex items-center justify-between">
              <Label htmlFor="task-description" className="text-xs font-medium text-foreground/90">
                Description{" "}
                <span className="text-[11px] font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground/60">
                <span className={description.length >= 500 ? "text-destructive font-medium tabular-nums" : "tabular-nums"}>
                  {description.length}/500
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">Ctrl+Enter to save</span>
              </div>
            </div>
            <Textarea
              id="task-description"
              placeholder="Add extra context, notes, or links…"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={2}
              disabled={loading}
              className="min-h-16 text-xs resize-none min-w-0 max-w-full"
            />
          </div>

          <div className="flex items-center justify-end pt-1">
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              id="task-submit-btn"
              className="h-8 gap-1.5 px-3.5 text-xs font-medium transition-transform active:scale-95"
            >
              {loading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Plus className="size-3.5" />
              )}
              {loading ? "Adding Task…" : "Add Task"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
