import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Clock } from "lucide-react";
import { formatRelativeTime, formatExactDate } from "@/lib/utils.js";

export default function EditDialog({ task, loading, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validationError, setValidationError] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setValidationError("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) {
      setValidationError("Title is required.");
      return;
    }
    setValidationError("");
    onSave({ title: trimmed, description: description.trim() || null });
  };

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md overflow-hidden max-w-[calc(100%-2rem)]" id="edit-modal">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the title or description of this task.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex flex-col gap-4 min-w-0 max-w-full"
          onSubmit={handleSubmit}
          id="task-edit-form"
        >
          {task?.created_at && (
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2 text-xs text-muted-foreground min-w-0 max-w-full overflow-hidden">
              <Clock className="size-3.5 shrink-0 text-muted-foreground/70" />
              <span className="truncate">Created {formatExactDate(task.created_at)}</span>
              <span className="text-muted-foreground/40">•</span>
              <span className="text-muted-foreground/70 shrink-0">{formatRelativeTime(task.created_at)}</span>
            </div>
          )}

          <div className="flex flex-col gap-2 min-w-0 max-w-full">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              ref={inputRef}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (validationError) setValidationError("");
              }}
              aria-invalid={!!validationError}
              disabled={loading}
              className="min-w-0 max-w-full"
            />
            {validationError && (
              <p className="text-xs text-destructive">{validationError}</p>
            )}
          </div>

          <div className="flex flex-col gap-2 min-w-0 max-w-full">
            <div className="flex items-center justify-between">
              <Label htmlFor="edit-description">
                Description{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <span className={description.length >= 500 ? "text-xs text-destructive font-medium tabular-nums" : "text-xs text-muted-foreground/70 tabular-nums"}>
                {description.length}/500
              </span>
            </div>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              maxLength={500}
              rows={3}
              disabled={loading}
              className="resize-none text-xs min-w-0 max-w-full"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} id="edit-save-btn">
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              {loading ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
