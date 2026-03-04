import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, CheckSquare, Square, Trash2, Pencil, AlertCircle, Flag } from "lucide-react";
import type { Task, InsertTask } from "@shared/schema";

const categories = ["venue", "catering", "decor", "photography", "music", "attire", "invitations", "honeymoon", "legal", "general"];
const priorityColors: Record<string, string> = {
  high: "text-red-600 dark:text-red-400",
  medium: "text-amber-600 dark:text-amber-400",
  low: "text-green-600 dark:text-green-400",
};
const statusColors: Record<string, string> = {
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "in-progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

const emptyTask: InsertTask = {
  title: "", description: "", category: "general",
  status: "pending", dueDate: "", priority: "medium",
};

export default function TasksAdmin() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState<InsertTask>(emptyTask);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  const { data: tasks, isLoading } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });

  const createMutation = useMutation({
    mutationFn: async (data: InsertTask) => apiRequest("POST", "/api/tasks", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }); setDialogOpen(false); setForm(emptyTask); toast({ title: "Task added" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertTask> }) => apiRequest("PATCH", `/api/tasks/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }); setDialogOpen(false); setEditingTask(null); setForm(emptyTask); toast({ title: "Task updated" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/tasks/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }); toast({ title: "Task removed" }); },
  });

  const toggleStatus = (task: Task) => {
    const nextStatus = task.status === "completed" ? "pending" : task.status === "pending" ? "in-progress" : "completed";
    updateMutation.mutate({ id: task.id, data: { status: nextStatus } });
  };

  const filtered = tasks?.filter(t => {
    const matchesStatus = filterStatus === "all" || t.status === filterStatus;
    const matchesCategory = filterCategory === "all" || t.category === filterCategory;
    return matchesStatus && matchesCategory;
  }) || [];

  const stats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t.status === "completed").length || 0,
    inProgress: tasks?.filter(t => t.status === "in-progress").length || 0,
    pending: tasks?.filter(t => t.status === "pending").length || 0,
  };

  const openAdd = () => { setEditingTask(null); setForm(emptyTask); setDialogOpen(true); };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setForm({ title: task.title, description: task.description, category: task.category, status: task.status, dueDate: task.dueDate, priority: task.priority });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.title.trim()) { toast({ title: "Title required", variant: "destructive" }); return; }
    if (editingTask) updateMutation.mutate({ id: editingTask.id, data: form });
    else createMutation.mutate(form);
  };

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));
  const progress = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="bg-card border border-card-border rounded-md p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-cinzel text-sm tracking-wider">Wedding Progress</h3>
            <p className="font-serif text-xs text-muted-foreground italic">{stats.completed} of {stats.total} tasks completed</p>
          </div>
          <span className="font-cinzel text-2xl font-bold gold-text">{progress}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full gold-gradient rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-4 mt-3">
          {[
            { label: "Completed", value: stats.completed, color: "text-green-600 dark:text-green-400" },
            { label: "In Progress", value: stats.inProgress, color: "text-blue-600 dark:text-blue-400" },
            { label: "Pending", value: stats.pending, color: "text-amber-600 dark:text-amber-400" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`font-cinzel text-lg font-bold ${s.color}`}>{s.value}</p>
              <p className="font-serif text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 font-serif"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-36 font-serif"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd} className="font-cinzel tracking-wider text-xs" data-testid="button-add-task">
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center bg-card border border-card-border rounded-md">
            <CheckSquare className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-cinzel text-sm tracking-wider text-muted-foreground">No tasks found</p>
          </div>
        ) : (
          filtered.map(task => (
            <div
              key={task.id}
              className={`bg-card border border-card-border rounded-md p-4 shadow-sm flex items-start gap-3 ${task.status === "completed" ? "opacity-60" : ""}`}
              data-testid={`task-${task.id}`}
            >
              <button onClick={() => toggleStatus(task)} className="mt-0.5 shrink-0" data-testid={`toggle-task-${task.id}`}>
                {task.status === "completed"
                  ? <CheckSquare className="w-5 h-5 text-green-600" />
                  : <Square className="w-5 h-5 text-muted-foreground" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-1">
                  <p className={`font-serif text-sm font-medium ${task.status === "completed" ? "line-through text-muted-foreground" : ""}`}>
                    {task.title}
                  </p>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-cinzel tracking-wide ${statusColors[task.status] || statusColors.pending}`}>
                    {task.status}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-cinzel bg-muted text-muted-foreground capitalize">
                    {task.category}
                  </span>
                </div>
                {task.description && <p className="font-serif text-xs text-muted-foreground">{task.description}</p>}
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <div className={`flex items-center gap-1 ${priorityColors[task.priority]}`}>
                    <Flag className="w-3 h-3" />
                    <span className="text-xs font-cinzel capitalize">{task.priority}</span>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs font-serif text-muted-foreground">Due: {task.dueDate}</span>
                  )}
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(task)} data-testid={`button-edit-task-${task.id}`}>
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(task.id)} data-testid={`button-delete-task-${task.id}`}>
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cinzel tracking-wider">{editingTask ? "Edit Task" : "Add Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Title *</Label>
              <Input value={form.title} onChange={e => update("title", e.target.value)} placeholder="Task title" className="font-serif" data-testid="input-task-title" />
            </div>
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Description</Label>
              <Textarea value={form.description} onChange={e => update("description", e.target.value)} placeholder="Task details..." className="font-serif" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Category</Label>
                <Select value={form.category} onValueChange={v => update("category", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Priority</Label>
                <Select value={form.priority} onValueChange={v => update("priority", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Status</Label>
                <Select value={form.status} onValueChange={v => update("status", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Due Date</Label>
                <Input type="date" value={form.dueDate} onChange={e => update("dueDate", e.target.value)} className="font-serif" />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="font-cinzel text-xs tracking-wider">Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="font-cinzel text-xs tracking-wider">
              {editingTask ? "Update" : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
