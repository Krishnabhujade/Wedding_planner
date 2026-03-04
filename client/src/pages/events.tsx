import { useQuery } from "@tanstack/react-query";
import { NavBar } from "@/components/nav-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, Shirt } from "lucide-react";
import type { WeddingDetails, Event } from "@shared/schema";
import { format } from "date-fns";

const eventTypeColors: Record<string, string> = {
  haldi: "from-yellow-400/20 to-amber-300/20 border-yellow-400/40",
  mehendi: "from-green-500/20 to-emerald-400/20 border-green-500/40",
  sangeet: "from-purple-500/20 to-violet-400/20 border-purple-400/40",
  wedding: "from-amber-500/20 to-yellow-400/20 border-amber-400/50",
  reception: "from-rose-400/20 to-pink-300/20 border-rose-400/40",
  general: "from-primary/10 to-accent/20 border-primary/30",
};

const eventTypeIcons: Record<string, string> = {
  haldi: "🌻",
  mehendi: "🌿",
  sangeet: "🎶",
  wedding: "💍",
  reception: "🥂",
  general: "✨",
};

const eventTypeDotColors: Record<string, string> = {
  haldi: "bg-yellow-400",
  mehendi: "bg-green-500",
  sangeet: "bg-purple-500",
  wedding: "bg-amber-500",
  reception: "bg-rose-400",
  general: "bg-primary",
};

export default function Events() {
  const { data: wedding } = useQuery<WeddingDetails>({ queryKey: ["/api/wedding"] });
  const { data: events, isLoading } = useQuery<Event[]>({ queryKey: ["/api/events"] });

  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr + "T12:00:00"), "EEEE, MMMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar brideName={wedding?.brideName} groomName={wedding?.groomName} />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{ background: "linear-gradient(180deg, hsl(43, 60%, 90%) 0%, transparent 100%)" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">The Celebration</p>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold gold-text mb-4">Event Schedule</h1>
          <div className="ornament-divider max-w-xs mx-auto mb-4">
            <span className="font-serif text-muted-foreground italic text-sm px-3">Five days of joy & togetherness</span>
          </div>
        </div>
      </section>

      {/* Events Timeline */}
      <section className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-6">
                  <Skeleton className="w-12 h-12 rounded-full shrink-0" />
                  <Skeleton className="flex-1 h-40 rounded-md" />
                </div>
              ))}
            </div>
          ) : events && events.length > 0 ? (
            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute left-5 top-6 bottom-6 w-px bg-gradient-to-b from-primary/60 via-primary/30 to-transparent hidden md:block" />

              <div className="space-y-8">
                {events.map((event, index) => {
                  const gradientClass = eventTypeColors[event.type] || eventTypeColors.general;
                  const dotColor = eventTypeDotColors[event.type] || eventTypeDotColors.general;
                  const icon = eventTypeIcons[event.type] || eventTypeIcons.general;

                  return (
                    <div key={event.id} className="flex gap-0 md:gap-8 items-start" data-testid={`event-card-${event.id}`}>
                      {/* Timeline dot */}
                      <div className="hidden md:flex flex-col items-center shrink-0 w-10">
                        <div className={`w-4 h-4 rounded-full ${dotColor} ring-2 ring-background ring-offset-2 z-10 mt-5`} />
                      </div>

                      {/* Card */}
                      <div className={`flex-1 rounded-md border bg-gradient-to-br ${gradientClass} p-6 hover-elevate shadow-sm transition-all`}>
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg">{icon}</span>
                              <h3 className="font-cinzel text-lg font-semibold tracking-wide">{event.name}</h3>
                            </div>
                            <p className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase">
                              {event.type}
                            </p>
                          </div>
                          <span className="font-cinzel text-xs tracking-wider text-muted-foreground bg-background/60 px-3 py-1 rounded-full border border-border">
                            Day {index + 1}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <Calendar className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-serif">{formatEventDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/80">
                            <Clock className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-serif">{event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/80 sm:col-span-2">
                            <MapPin className="w-4 h-4 text-primary shrink-0" />
                            <span className="font-serif">{event.venue}</span>
                          </div>
                          {event.dresscode && (
                            <div className="flex items-center gap-2 text-sm text-foreground/80 sm:col-span-2">
                              <Shirt className="w-4 h-4 text-primary shrink-0" />
                              <span className="font-serif">Dress Code: <span className="italic">{event.dresscode}</span></span>
                            </div>
                          )}
                        </div>

                        {event.description && (
                          <p className="mt-4 font-serif text-sm text-muted-foreground italic border-t border-border/50 pt-4">
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-serif text-muted-foreground italic">Event schedule coming soon...</p>
            </div>
          )}
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center">
        <p className="font-serif text-xs text-muted-foreground italic">Crafted with love · Shaadi Planner</p>
      </footer>
    </div>
  );
}
