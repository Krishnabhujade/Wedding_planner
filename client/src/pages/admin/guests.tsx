import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Pencil, Trash2, Users, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Guest, InsertGuest } from "@shared/schema";

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  maybe: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
};

const emptyGuest: InsertGuest = {
  name: "", email: "", phone: "", side: "both",
  rsvpStatus: "pending", mealPreference: "vegetarian",
  tableNumber: "", plusOne: false, notes: "",
};

export default function GuestsAdmin() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [form, setForm] = useState<InsertGuest>(emptyGuest);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const { data: guests, isLoading } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });

  const createMutation = useMutation({
    mutationFn: async (data: InsertGuest) => apiRequest("POST", "/api/guests", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      setDialogOpen(false);
      setForm(emptyGuest);
      toast({ title: "Guest added successfully" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertGuest> }) =>
      apiRequest("PATCH", `/api/guests/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      setDialogOpen(false);
      setEditingGuest(null);
      setForm(emptyGuest);
      toast({ title: "Guest updated" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/guests/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/guests"] });
      setDeleteConfirm(null);
      toast({ title: "Guest removed" });
    },
  });

  const filtered = guests?.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || g.rsvpStatus === filterStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const stats = {
    total: guests?.length || 0,
    confirmed: guests?.filter(g => g.rsvpStatus === "confirmed").length || 0,
    pending: guests?.filter(g => g.rsvpStatus === "pending").length || 0,
    declined: guests?.filter(g => g.rsvpStatus === "declined").length || 0,
  };

  const openAdd = () => {
    setEditingGuest(null);
    setForm(emptyGuest);
    setDialogOpen(true);
  };

  const openEdit = (guest: Guest) => {
    setEditingGuest(guest);
    setForm({
      name: guest.name, email: guest.email, phone: guest.phone,
      side: guest.side, rsvpStatus: guest.rsvpStatus,
      mealPreference: guest.mealPreference, tableNumber: guest.tableNumber,
      plusOne: guest.plusOne, notes: guest.notes,
    });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast({ title: "Name is required", variant: "destructive" });
      return;
    }
    if (editingGuest) {
      updateMutation.mutate({ id: editingGuest.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Guests", value: stats.total, icon: Users, color: "text-foreground" },
          { label: "Confirmed", value: stats.confirmed, icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
          { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-600 dark:text-amber-400" },
          { label: "Declined", value: stats.declined, icon: XCircle, color: "text-red-600 dark:text-red-400" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-card-border rounded-md p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-4 h-4 ${color}`} />
              <span className="font-cinzel text-xs tracking-wider text-muted-foreground">{label}</span>
            </div>
            <p className={`font-cinzel text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search guests..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 font-serif w-56"
              data-testid="input-search-guests"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-36 font-serif" data-testid="select-filter-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="maybe">Maybe</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={openAdd} className="font-cinzel tracking-wider text-xs" data-testid="button-add-guest">
          <Plus className="w-4 h-4 mr-1" />
          Add Guest
        </Button>
      </div>

      {/* Guest Table */}
      <div className="bg-card border border-card-border rounded-md shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[1,2,3,4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-10 h-10 text-muted-foreground/40 mx-auto mb-3" />
            <p className="font-cinzel text-sm tracking-wider text-muted-foreground">No guests found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["Name", "Contact", "Side", "Meal", "Table", "Status", ""].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-cinzel text-xs tracking-wider text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest, idx) => (
                  <tr
                    key={guest.id}
                    className={`border-b border-border/50 ${idx % 2 === 0 ? "" : "bg-muted/10"}`}
                    data-testid={`guest-row-${guest.id}`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-serif text-sm font-medium">{guest.name}</p>
                        {guest.plusOne && <span className="text-xs text-muted-foreground italic">+1</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-serif text-xs text-muted-foreground">
                        <p>{guest.email || "—"}</p>
                        <p>{guest.phone || "—"}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-serif text-xs text-muted-foreground capitalize">{guest.side}</td>
                    <td className="px-4 py-3 font-serif text-xs text-muted-foreground capitalize">{guest.mealPreference}</td>
                    <td className="px-4 py-3 font-serif text-xs text-muted-foreground">{guest.tableNumber || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-cinzel tracking-wide ${statusColors[guest.rsvpStatus] || statusColors.pending}`}>
                        {guest.rsvpStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button size="icon" variant="ghost" onClick={() => openEdit(guest)} data-testid={`button-edit-${guest.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={() => setDeleteConfirm(guest.id)} data-testid={`button-delete-${guest.id}`}>
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

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-cinzel tracking-wider">
              {editingGuest ? "Edit Guest" : "Add Guest"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Name *</Label>
              <Input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Full name" className="font-serif" data-testid="input-guest-name" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Email</Label>
                <Input value={form.email} onChange={e => update("email", e.target.value)} placeholder="email@example.com" className="font-serif" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Phone</Label>
                <Input value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91..." className="font-serif" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Side</Label>
                <Select value={form.side} onValueChange={v => update("side", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bride">Bride's</SelectItem>
                    <SelectItem value="groom">Groom's</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">RSVP</Label>
                <Select value={form.rsvpStatus} onValueChange={v => update("rsvpStatus", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Meal</Label>
                <Select value={form.mealPreference} onValueChange={v => update("mealPreference", v)}>
                  <SelectTrigger className="font-serif"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="non-vegetarian">Non-Veg</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="jain">Jain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Table #</Label>
                <Input value={form.tableNumber} onChange={e => update("tableNumber", e.target.value)} placeholder="e.g. T1" className="font-serif" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Plus One</Label>
              <Switch checked={form.plusOne} onCheckedChange={v => update("plusOne", v)} />
            </div>
            <div className="space-y-1.5">
              <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Notes</Label>
              <Textarea value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Any notes..." className="font-serif" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} className="font-cinzel text-xs tracking-wider">Cancel</Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} className="font-cinzel text-xs tracking-wider">
              {editingGuest ? "Update" : "Add Guest"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-cinzel tracking-wider">Remove Guest?</DialogTitle>
          </DialogHeader>
          <p className="font-serif text-sm text-muted-foreground">This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="font-cinzel text-xs">Cancel</Button>
            <Button variant="destructive" onClick={() => deleteConfirm && deleteMutation.mutate(deleteConfirm)} disabled={deleteMutation.isPending} className="font-cinzel text-xs tracking-wider">
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
