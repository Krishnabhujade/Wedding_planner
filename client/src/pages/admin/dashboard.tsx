import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";
import {
  Users, CheckSquare, IndianRupee, Calendar, Settings, Heart, ArrowLeft,
  LayoutDashboard, Camera, Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import GuestsAdmin from "./guests";
import TasksAdmin from "./tasks";
import BudgetAdmin from "./budget";
import type { WeddingDetails, Guest, Task, BudgetItem } from "@shared/schema";

type Tab = "overview" | "guests" | "tasks" | "budget" | "settings";

const navItems: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "guests", label: "Guests", icon: Users },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "budget", label: "Budget", icon: IndianRupee },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();

  const { data: wedding, isLoading: weddingLoading } = useQuery<WeddingDetails>({ queryKey: ["/api/wedding"] });
  const { data: guests } = useQuery<Guest[]>({ queryKey: ["/api/guests"] });
  const { data: tasks } = useQuery<Task[]>({ queryKey: ["/api/tasks"] });
  const { data: budget } = useQuery<BudgetItem[]>({ queryKey: ["/api/budget"] });

  const [settingsForm, setSettingsForm] = useState<Partial<WeddingDetails>>({});
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  if (wedding && !settingsLoaded) {
    setSettingsForm({
      brideName: wedding.brideName,
      groomName: wedding.groomName,
      weddingDate: wedding.weddingDate,
      venue: wedding.venue,
      venueAddress: wedding.venueAddress,
      story: wedding.story,
      hashtag: wedding.hashtag,
    });
    setSettingsLoaded(true);
  }

  const updateWeddingMutation = useMutation({
    mutationFn: async (data: Partial<WeddingDetails>) => apiRequest("PATCH", "/api/wedding", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/wedding"] });
      toast({ title: "Wedding details updated" });
    },
  });

  const totalGuests = guests?.length || 0;
  const confirmedGuests = guests?.filter(g => g.rsvpStatus === "confirmed").length || 0;
  const completedTasks = tasks?.filter(t => t.status === "completed").length || 0;
  const totalTasks = tasks?.length || 0;
  const totalBudget = budget?.reduce((s, i) => s + i.plannedAmount, 0) || 0;
  const spentBudget = budget?.reduce((s, i) => s + i.actualAmount, 0) || 0;

  const daysUntilWedding = wedding?.weddingDate
    ? Math.max(0, Math.floor((new Date(wedding.weddingDate + "T00:00:00").getTime() - Date.now()) / 86400000))
    : 0;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-1">
          <Heart className="w-4 h-4 text-primary fill-primary" />
          <span className="font-cinzel text-xs tracking-widest gold-text font-semibold">Admin</span>
        </div>
        <p className="font-cinzel text-sm font-bold truncate">
          {wedding?.brideName || "Bride"} & {wedding?.groomName || "Groom"}
        </p>
        <p className="font-serif text-xs text-muted-foreground italic mt-0.5">{wedding?.weddingDate || "—"}</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setActiveTab(id); setSidebarOpen(false); }}
            data-testid={`nav-${id}`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-cinzel tracking-wider transition-colors ${
              activeTab === id
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-sidebar-foreground hover-elevate"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link href="/">
          <div className="flex items-center gap-2 px-3 py-2 rounded-md font-cinzel text-xs tracking-wider text-muted-foreground cursor-pointer hover-elevate">
            <ArrowLeft className="w-4 h-4" />
            Back to Site
          </div>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex w-60 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <NavContent />
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-60 bg-sidebar border-r border-sidebar-border flex flex-col shadow-xl">
            <div className="flex justify-end p-3">
              <Button size="icon" variant="ghost" onClick={() => setSidebarOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <NavContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" className="md:hidden" onClick={() => setSidebarOpen(true)} data-testid="button-mobile-sidebar">
              <Menu className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-cinzel text-base md:text-lg font-semibold tracking-wider capitalize">
                {activeTab === "overview" ? "Dashboard" : activeTab}
              </h1>
              <p className="font-serif text-xs text-muted-foreground italic hidden md:block">
                {daysUntilWedding > 0 ? `${daysUntilWedding} days until the wedding` : "The big day is here!"}
              </p>
            </div>
          </div>
          <Link href="/">
            <Button size="sm" variant="outline" className="font-cinzel text-xs tracking-wider hidden md:flex gap-1 items-center">
              <ArrowLeft className="w-3 h-3" />
              View Site
            </Button>
          </Link>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {activeTab === "overview" && (
            <div className="space-y-6 max-w-4xl">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Days Left", value: daysUntilWedding, sub: "until wedding", icon: Calendar, onClick: () => setActiveTab("settings") },
                  { label: "Guests", value: `${confirmedGuests}/${totalGuests}`, sub: "confirmed", icon: Users, onClick: () => setActiveTab("guests") },
                  { label: "Tasks", value: `${completedTasks}/${totalTasks}`, sub: "completed", icon: CheckSquare, onClick: () => setActiveTab("tasks") },
                  { label: "Budget", value: `${Math.round(totalBudget > 0 ? (spentBudget / totalBudget) * 100 : 0)}%`, sub: "used", icon: IndianRupee, onClick: () => setActiveTab("budget") },
                ].map(({ label, value, sub, icon: Icon, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="bg-card border border-card-border rounded-md p-4 shadow-sm text-left hover-elevate w-full"
                    data-testid={`stat-card-${label.toLowerCase().replace(" ", "-")}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center">
                        <Icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="font-cinzel text-xs tracking-wider text-muted-foreground">{label}</span>
                    </div>
                    <p className="font-cinzel text-2xl font-bold gold-text">{value}</p>
                    <p className="font-serif text-xs text-muted-foreground italic">{sub}</p>
                  </button>
                ))}
              </div>

              {/* Quick Access Panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab("guests")} className="bg-card border border-card-border rounded-md p-5 text-left hover-elevate shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-cinzel text-sm tracking-wider">Guest Management</span>
                  </div>
                  <p className="font-serif text-xs text-muted-foreground">Add, edit, and track all wedding guests and their RSVPs.</p>
                </button>
                <button onClick={() => setActiveTab("tasks")} className="bg-card border border-card-border rounded-md p-5 text-left hover-elevate shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckSquare className="w-5 h-5 text-primary" />
                    <span className="font-cinzel text-sm tracking-wider">Task Checklist</span>
                  </div>
                  <p className="font-serif text-xs text-muted-foreground">Track all wedding planning tasks and stay on schedule.</p>
                </button>
                <button onClick={() => setActiveTab("budget")} className="bg-card border border-card-border rounded-md p-5 text-left hover-elevate shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <span className="font-cinzel text-sm tracking-wider">Budget Tracker</span>
                  </div>
                  <p className="font-serif text-xs text-muted-foreground">Manage wedding budget, expenses, and vendor payments.</p>
                </button>
              </div>

              {/* Recent Guests */}
              <div className="bg-card border border-card-border rounded-md p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-cinzel text-sm tracking-wider">Recent RSVPs</h3>
                  <button onClick={() => setActiveTab("guests")} className="font-cinzel text-xs text-primary tracking-wider">View All</button>
                </div>
                {guests && guests.slice(0, 5).map(g => (
                  <div key={g.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center">
                        <span className="font-cinzel text-xs text-white font-bold">{g.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-serif text-sm">{g.name}</p>
                        <p className="font-serif text-xs text-muted-foreground italic capitalize">{g.mealPreference}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-cinzel tracking-wide ${
                      g.rsvpStatus === "confirmed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      g.rsvpStatus === "declined" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}>
                      {g.rsvpStatus}
                    </span>
                  </div>
                ))}
                {(!guests || guests.length === 0) && (
                  <p className="font-serif text-sm text-muted-foreground italic text-center py-4">No guests yet</p>
                )}
              </div>
            </div>
          )}

          {activeTab === "guests" && (
            <div className="max-w-5xl">
              <GuestsAdmin />
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="max-w-3xl">
              <TasksAdmin />
            </div>
          )}

          {activeTab === "budget" && (
            <div className="max-w-5xl">
              <BudgetAdmin />
            </div>
          )}

          {activeTab === "settings" && (
            <div className="max-w-xl">
              <div className="bg-card border border-card-border rounded-md p-6 shadow-sm">
                <h2 className="font-cinzel text-lg tracking-wider mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Wedding Details
                </h2>
                {weddingLoading ? (
                  <div className="space-y-4">{[1,2,3,4].map(i => <Skeleton key={i} className="h-10 w-full" />)}</div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Bride's Name</Label>
                        <Input
                          value={settingsForm.brideName || ""}
                          onChange={e => setSettingsForm(p => ({ ...p, brideName: e.target.value }))}
                          className="font-serif"
                          data-testid="input-bride-name"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Groom's Name</Label>
                        <Input
                          value={settingsForm.groomName || ""}
                          onChange={e => setSettingsForm(p => ({ ...p, groomName: e.target.value }))}
                          className="font-serif"
                          data-testid="input-groom-name"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Wedding Date</Label>
                      <Input
                        type="date"
                        value={settingsForm.weddingDate || ""}
                        onChange={e => setSettingsForm(p => ({ ...p, weddingDate: e.target.value }))}
                        className="font-serif"
                        data-testid="input-wedding-date"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Venue</Label>
                      <Input
                        value={settingsForm.venue || ""}
                        onChange={e => setSettingsForm(p => ({ ...p, venue: e.target.value }))}
                        className="font-serif"
                        data-testid="input-venue"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Venue Address</Label>
                      <Input
                        value={settingsForm.venueAddress || ""}
                        onChange={e => setSettingsForm(p => ({ ...p, venueAddress: e.target.value }))}
                        className="font-serif"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Hashtag</Label>
                      <Input
                        value={settingsForm.hashtag || ""}
                        onChange={e => setSettingsForm(p => ({ ...p, hashtag: e.target.value }))}
                        placeholder="#YourWeddingHashtag"
                        className="font-serif"
                        data-testid="input-hashtag"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Your Story</Label>
                      <Textarea
                        value={settingsForm.story || ""}
                        onChange={e => setSettingsForm(p => ({ ...p, story: e.target.value }))}
                        className="font-serif min-h-[100px]"
                        data-testid="textarea-story"
                      />
                    </div>
                    <Button
                      onClick={() => updateWeddingMutation.mutate(settingsForm)}
                      disabled={updateWeddingMutation.isPending}
                      className="w-full font-cinzel tracking-widest text-xs gold-gradient text-white"
                      data-testid="button-save-settings"
                    >
                      {updateWeddingMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
