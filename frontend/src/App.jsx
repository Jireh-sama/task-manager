import { useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/TaskList.jsx";
import EditDialog from "./components/EditDialog.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Loader2, CheckSquare, Search, X, ListTodo } from "lucide-react";
import { useTasks } from "@/hooks/useTasks.js";
import { useTaskFilter } from "@/hooks/useTaskFilter.js";

export default function App() {
  const {
    tasks,
    loading,
    actionLoading,
    error,
    stats,
    loadTasks,
    createTask,
    updateTask,
    toggleTask,
    deleteTask,
  } = useTasks();

  const { filter, setFilter, searchQuery, setSearchQuery, filteredTasks } =
    useTaskFilter(tasks);

  const [editingTask, setEditingTask] = useState(null);

  const handleUpdate = async (id, data) => {
    await updateTask(id, data);
    setEditingTask(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <CheckSquare className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="font-heading text-xl font-semibold tracking-tight sm:text-2xl">
                  Task Manager
                </h1>
                <Badge variant="secondary" className="text-[11px] tabular-nums">
                  {stats.total} total
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Stay organized, focused, and on track.
              </p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {stats.total > 0 && (
          <section className="mb-6 rounded-xl border border-border/70 bg-card/60 p-4 shadow-2xs backdrop-blur-xs">
            <div className="mb-2 flex items-center justify-between text-xs">
              <span className="font-medium text-foreground">Task Progress</span>
              <span className="text-muted-foreground tabular-nums">
                {stats.completed} of {stats.total} completed ({stats.completionPercent}%)
              </span>
            </div>
            <Progress value={stats.completionPercent} className="h-1.5" />
          </section>
        )}

        <section id="create-task-section" className="mb-6">
          <TaskForm
            onSubmit={createTask}
            loading={actionLoading === "create"}
          />
        </section>

        <Separator className="mb-6" />

        {stats.total > 0 && (
          <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs
              value={filter}
              onValueChange={setFilter}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-3 sm:w-auto">
                <TabsTrigger value="all" className="text-xs">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="active" className="text-xs">
                  Active ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="completed" className="text-xs">
                  Done ({stats.completed})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-56">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 pr-7 text-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </section>
        )}

        <section id="task-list-section">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <Loader2 className="size-6 animate-spin" />
              <p className="mt-3 text-sm">Loading tasks…</p>
            </div>
          ) : error && stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={loadTasks}
              >
                Retry
              </Button>
            </div>
          ) : stats.total === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-14 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <ListTodo className="size-5" />
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                No tasks yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create your first task above to start tracking your progress.
              </p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 py-12 text-center">
              <p className="text-sm font-medium text-foreground">
                No matching tasks
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {searchQuery
                  ? `No tasks matched "${searchQuery}".`
                  : `No tasks found in the ${filter} category.`}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs"
                onClick={() => {
                  setFilter("all");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <TaskList
              tasks={filteredTasks}
              actionLoading={actionLoading}
              onToggle={toggleTask}
              onEdit={setEditingTask}
              onDelete={deleteTask}
            />
          )}
        </section>
      </div>

      <EditDialog
        task={editingTask}
        loading={actionLoading === editingTask?.id}
        onSave={(data) => handleUpdate(editingTask.id, data)}
        onClose={() => setEditingTask(null)}
      />
    </div>
  );
}
