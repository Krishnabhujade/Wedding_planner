import { useQuery, useMutation } from "@tanstack/react-query";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Heart, Send, CheckCircle } from "lucide-react";
import type { WeddingDetails } from "@shared/schema";
import { useState } from "react";

export default function RSVPPage() {
  const { data: wedding } = useQuery<WeddingDetails>({ queryKey: ["/api/wedding"] });
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    rsvpStatus: "confirmed",
    mealPreference: "vegetarian",
    plusOne: false,
    side: "both",
    notes: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/guests/rsvp", form);
    },
    onSuccess: () => {
      setSubmitted(true);
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    mutation.mutate();
  };

  const update = (field: string, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <NavBar brideName={wedding?.brideName} groomName={wedding?.groomName} />
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center py-16">
            <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-cinzel text-2xl md:text-3xl font-bold mb-3 gold-text">
              {form.rsvpStatus === "confirmed" ? "We'll See You There!" : "Thank You for Letting Us Know"}
            </h2>
            <p className="font-serif text-muted-foreground italic mb-6">
              {form.rsvpStatus === "confirmed"
                ? `Thank you, ${form.name}! We're so excited to celebrate with you.`
                : `Thank you, ${form.name}. We'll miss you and keep you in our hearts.`}
            </p>
            {form.rsvpStatus === "confirmed" && (
              <p className="font-cinzel text-xs tracking-widest text-primary">{wedding?.hashtag}</p>
            )}
            <Heart className="w-6 h-6 text-primary fill-primary mx-auto mt-6 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar brideName={wedding?.brideName} groomName={wedding?.groomName} />

      {/* Hero */}
      <section className="relative pt-32 pb-12 px-4 text-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-40"
          style={{ background: "linear-gradient(180deg, hsl(43, 60%, 90%) 0%, transparent 100%)" }}
        />
        <div className="relative z-10 max-w-xl mx-auto">
          <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Kindly Reply</p>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold gold-text mb-4">RSVP</h1>
          <div className="ornament-divider max-w-xs mx-auto mb-4">
            <span className="font-serif text-muted-foreground italic text-sm px-3">
              {wedding?.brideName} & {wedding?.groomName} request your presence
            </span>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24 px-4">
        <div className="max-w-lg mx-auto">
          <div className="bg-card border border-card-border rounded-md p-6 md:p-8 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Full Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={e => update("name", e.target.value)}
                  placeholder="Your full name"
                  className="font-serif"
                  data-testid="input-name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={e => update("email", e.target.value)}
                    placeholder="your@email.com"
                    className="font-serif"
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={e => update("phone", e.target.value)}
                    placeholder="+91 9999999999"
                    className="font-serif"
                    data-testid="input-phone"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Will you attend?</Label>
                <Select value={form.rsvpStatus} onValueChange={v => update("rsvpStatus", v)}>
                  <SelectTrigger data-testid="select-rsvp-status" className="font-serif">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Joyfully Accepts</SelectItem>
                    <SelectItem value="declined">Regretfully Declines</SelectItem>
                    <SelectItem value="maybe">Maybe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {form.rsvpStatus !== "declined" && (
                <>
                  <div className="space-y-1.5">
                    <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Meal Preference</Label>
                    <Select value={form.mealPreference} onValueChange={v => update("mealPreference", v)}>
                      <SelectTrigger data-testid="select-meal" className="font-serif">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vegetarian">Vegetarian</SelectItem>
                        <SelectItem value="non-vegetarian">Non-Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Family Side</Label>
                    <Select value={form.side} onValueChange={v => update("side", v)}>
                      <SelectTrigger data-testid="select-side" className="font-serif">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bride">Bride's Side</SelectItem>
                        <SelectItem value="groom">Groom's Side</SelectItem>
                        <SelectItem value="both">Both / Friend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-2 border-t border-border">
                    <div>
                      <p className="font-cinzel text-xs tracking-wider text-foreground">Bringing a Plus One?</p>
                      <p className="font-serif text-xs text-muted-foreground italic">Will you be bringing a guest?</p>
                    </div>
                    <Switch
                      checked={form.plusOne}
                      onCheckedChange={v => update("plusOne", v)}
                      data-testid="switch-plus-one"
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="notes" className="font-cinzel text-xs tracking-wider text-muted-foreground uppercase">Special Notes</Label>
                <Textarea
                  id="notes"
                  value={form.notes}
                  onChange={e => update("notes", e.target.value)}
                  placeholder="Dietary restrictions, accessibility needs, or a personal message..."
                  className="font-serif min-h-[80px]"
                  data-testid="textarea-notes"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-cinzel tracking-widest text-xs gold-gradient text-white shadow-md"
                disabled={mutation.isPending}
                data-testid="button-submit-rsvp"
              >
                {mutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send RSVP
                  </>
                )}
              </Button>
            </form>
          </div>

          <p className="text-center font-serif text-xs text-muted-foreground italic mt-6">
            Please RSVP by {wedding?.weddingDate ? (() => {
              try {
                const d = new Date(wedding.weddingDate + "T12:00:00");
                d.setDate(d.getDate() - 30);
                return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
              } catch { return "30 days before the wedding"; }
            })() : "30 days before the wedding"}
          </p>
        </div>
      </section>

      <footer className="py-8 border-t border-border text-center">
        <p className="font-serif text-xs text-muted-foreground italic">Crafted with love · Shaadi Planner</p>
      </footer>
    </div>
  );
}
