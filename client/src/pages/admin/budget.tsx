import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, IndianRupee, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import type { BudgetItem, InsertBudgetItem } from "@shared/schema";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const categories = ["venue", "catering", "decor", "photography", "music", "attire", "invitations", "honeymoon", "makeup", "jewelry", "transport", "mehendi", "general"];

const categoryColors = [
  "#B8860B", "#D4AC0D", "#F0C040", "#8B7355", "#C4A265",
  "#A0522D", "#CD853F", "#DEB887", "#D2691E", "#8B6914",
  "#DAA520", "#B8960C", "#9B7A00",
];

const emptyItem: InsertBudgetItem = {
  category: "general", vendor: "", description: "",
  plannedAmount: 0, actualAmount: 0, paid: false, notes: "",
};

const fmt = (n: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export default function BudgetAdmin() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [form, setForm] = useState<InsertBudgetItem>(emptyItem);

  const { data: items, isLoading } = useQuery<BudgetItem[]>({ queryKey: ["/api/budget"] });

  const createMutation = useMutation({
    mutationFn: async (data: InsertBudgetItem) => apiRequest("POST", "/api/budget", data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/budget"] }); setDialogOpen(false); setForm(emptyItem); toast({ title: "Budget item added" }); },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertBudgetItem> }) => apiRequest("PATCH", `/api/budget/${id}`, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/budget"] }); setDialogOpen(false); setEditingItem(null); setForm(emptyItem); toast({ title: "Budget item updated" }); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/budget/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/budget"] }); toast({ title: "Item removed" }); },
  });

  const totalPlanned = items?.reduce((s, i) => s + i.plannedAmount, 0) || 0;
  const totalActual = items?.reduce((s, i) => s + i.actualAmount, 0) || 0;
  const totalPaid = items?.filter(i => i.paid).reduce((s, i) => s + i.actualAmount, 0) || 0;
  const overBudget = totalActual > totalPlanned;

  const pieData = categories
    .map((cat, idx) => {
      const catItems = items?.filter(i => i.category === cat) || [];
      const total = catItems.reduce((s, i) => s + (i.actualAmount || i.plannedAmount), 0);
      return { name: cat, value: total, color: categoryColors[idx % categoryColors.length] };
    })
    .filter(d => d.value > 0);

  const openAdd = () => { setEditingItem(null); setForm(emptyItem); setDialogOpen(true); };
  const openEdit = (item: BudgetItem) => {
    setEditingItem(item);
    setForm({ category: item.category, vendor: item.vendor, description: item.description, plannedAmount: item.plannedAmount, actualAmount: item.actualAmount, paid: item.paid, notes: item.notes });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.category) { toast({ title: "Category required", variant: "destructive" }); return; }
    if (editingItem) updateMutation.mutate({ id: editingItem.id, data: form });
    else createMutation.mutate(form);
  };

  const update = (field: string, value: string | number | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const budgetUsed = totalPlanned > 0 ? Math.min((totalActual / totalPlanned) * 100, 100) : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Budget", value: fmt(totalPlanned), icon: IndianRupee, color: "text-foreground" },
          { label: "Spent So Far", value: fmt(totalActual), icon: TrendingUp, color: overBudget ? "text-red-600 dark:text-red-400" : "text-foreground" },
          { label: "Amount Paid", value: fmt(totalPaid), icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
          { label: "Remaining", value: fmt(Math.max(totalPlanned - totalActual, 0)), icon: AlertTriangle, color: overBudget ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-card-border rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="font-cinzel text-xs tracking-wider text-muted-foreground">{label}</span>
            </div>
            <p className={`font-cinzel text-lg font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar + Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-card-border rounded-md p-5 shadow-sm">
          <h3 className="font-cinzel text-sm tracking-wider mb-4">Budget Usage</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-serif text-muted-foreground">
              <span>Spent: {fmt(totalActual)}</span>
              <span>{Math.round(budgetUsed)}% of budget</span>
            </div>
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${overBudget ? "bg-destructive" : "gold-gradient"}`}
                style={{ width: `${budgetUsed}%` }}
              />
            </div>
            <div className="flex justify-between text-xs font-serif text-muted-foreground">
              <span>0</span>
              <span>{fmt(totalPlanned)}</span>
            </div>
          </div>
          {overBudget && (
            <p className="mt-3 text-xs font-serif text-red-600 dark:text-red-400 italic flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Over budget by {fmt(totalActual - totalPlanned)}
            </p>
          )}
        </div>

        {pieData.length > 0 && (
          <div className="bg-card border border-card-border rounded-md p-5 shadow-sm">
            <h3 className="font-cinzel text-sm tracking-wider mb-2">Spending by Category</h3>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value">
                  {pieData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex justify-end">
        <Button onClick={openAdd} className="font-cinzel tracking-wider text-xs" data-testid="button-add-budget">
          <Plus className="w-4 h-4 mr-1" />
          Add Item
        </Button>
      </div>

      {/* Items Table */}
      <div className="bg-card border border-card-border rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-12 w-full" />)}</div>
        ) : !items || items.length === 0 ? (
          <div className="py-16 text-center">
            <IndianRupee className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-cinzel text-sm tracking-wider text-muted-foreground">No budget items yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Category", "Vendor", "Planned", "Actual", "Paid", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-cinzel text-xs tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={item.id} className={`border-b border-border/50 ${idx % 2 === 0 ? "" : "bg-muted/10"}`} data-testid={`budget-row-${item.id}`}>
                    <td className="px-4 py-3">
                      <span className="font-cinzel text-xs tracking-wider capitalize bg-accent text-accent-foreground px-2 py-0.5 rounded-full">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-serif text-sm">{item.vendor || "—"}</p>
                        {item.description && <p className="text-xs text-muted-foreground font-serif italic">{item.description}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-serif text-sm">{fmt(item.plannedAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-serif text-sm ${item.actualAmount > item.plannedAmount ? "text-red-600 dark:text-red-400" : ""}`}>
                        {fmt(item.actualAmount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Switch
                        checked={item.paid}
                        onCheckedChange={v => updateMutation.mutate({ id: item.id, data: { paid: v } })}
                        data-testid={`switch-paid-${item.id}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(item)}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(item.id)}>
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cinzel tracking-wider">{editingItem ? "Edit Budget Item" : "Add Budget Item"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
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
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Vendor</Label>
                <Input value={form.vendor} onChange={e => update("vendor", e.target.value)} placeholder="Vendor name" className="font-serif" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Description</Label>
              <Input value={form.description} onChange={e => update("description", e.target.value)} placeholder="Brief description" className="font-serif" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Planned (₹)</Label>
                <Input type="number" value={form.plannedAmount} onChange={e => update("plannedAmount", parseFloat(e.target.value) || 0)} className="font-serif" data-testid="input-planned-amount" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Actual (₹)</Label>
                <Input type="number" value={form.actualAmount} onChange={e => update("actualAmount", parseFloat(e.target.value) || 0)} className="font-serif" data-testid="input-actual-amount" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Paid</Label>
              <Switch checked={form.paid} onCheckedChange={v => update("paid", v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Notes</Label>
              <Textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Additional notes..." className="font-serif" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="font-cinzel text-xs tracking-wider">Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="font-cinzel text-xs tracking-wider">
              {editingItem ? "Update" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
