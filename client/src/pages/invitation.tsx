import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Heart, MapPin, Calendar, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CountdownTimer } from "@/components/countdown-timer";
import { NavBar } from "@/components/nav-bar";
import type { WeddingDetails } from "@shared/schema";
import { format } from "date-fns";

export default function Invitation() {
  const { data: wedding, isLoading } = useQuery<WeddingDetails>({
    queryKey: ["/api/wedding"],
  });

  const formattedDate = wedding?.weddingDate
    ? (() => {
        try {
          return format(new Date(wedding.weddingDate + "T12:00:00"), "EEEE, MMMM d, yyyy");
        } catch {
          return wedding.weddingDate;
        }
      })()
    : "";

  return (
    <div className="min-h-screen bg-background">
      <NavBar brideName={wedding?.brideName} groomName={wedding?.groomName} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "linear-gradient(160deg, hsl(30, 35%, 12%) 0%, hsl(35, 30%, 18%) 40%, hsl(43, 40%, 22%) 100%)",
          }}
        />
        {/* Decorative overlay */}
        <div className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, hsl(43, 85%, 50%) 0%, transparent 50%), radial-gradient(circle at 80% 20%, hsl(43, 70%, 40%) 0%, transparent 40%)`,
          }}
        />

        {/* Ornamental top border */}
        <div className="absolute top-0 left-0 right-0 h-1 gold-gradient opacity-80" />
        <div className="absolute bottom-0 left-0 right-0 h-1 gold-gradient opacity-80" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-32 pt-24 max-w-3xl mx-auto">
          {/* Decorative icon */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/60" />
            <Heart className="w-5 h-5 text-primary fill-primary animate-pulse" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/60" />
          </div>

          <p className="font-cinzel text-xs md:text-sm tracking-[0.3em] text-white/60 uppercase mb-3">
            Together with their families
          </p>

          {isLoading ? (
            <div className="space-y-4 flex flex-col items-center">
              <Skeleton className="h-16 w-64 bg-white/10" />
              <Skeleton className="h-8 w-16 bg-white/10" />
              <Skeleton className="h-16 w-64 bg-white/10" />
            </div>
          ) : (
            <>
              <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg leading-tight">
                {wedding?.brideName}
              </h1>
              <div className="my-4 md:my-6 flex items-center gap-4">
                <div className="h-px w-12 bg-primary/60" />
                <span className="font-serif text-2xl md:text-3xl text-primary italic">&</span>
                <div className="h-px w-12 bg-primary/60" />
              </div>
              <h1 className="font-cinzel text-5xl md:text-7xl lg:text-8xl font-bold text-white drop-shadow-lg leading-tight">
                {wedding?.groomName}
              </h1>
            </>
          )}

          <div className="mt-8 mb-6 ornament-divider w-full max-w-xs">
            <span className="font-cinzel text-xs tracking-widest text-white/40 px-3">ARE GETTING MARRIED</span>
          </div>

          {isLoading ? (
            <Skeleton className="h-6 w-48 bg-white/10 mx-auto" />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex items-center gap-2 text-white/80">
                <Calendar className="w-4 h-4 text-primary" />
                <p className="font-cinzel text-sm md:text-base tracking-wider">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-2 text-white/70">
                <MapPin className="w-4 h-4 text-primary" />
                <p className="font-serif text-sm text-white/70 italic">{wedding?.venue}</p>
              </div>
            </div>
          )}

          <div className="mt-12 mb-10">
            <p className="font-cinzel text-xs tracking-widest text-white/50 uppercase mb-4">Counting Down</p>
            {wedding && <CountdownTimer weddingDate={wedding.weddingDate} />}
            {isLoading && (
              <div className="flex gap-4 md:gap-8 justify-center">
                {[1,2,3,4].map(i => <Skeleton key={i} className="w-20 h-20 md:w-28 md:h-28 bg-white/10" />)}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/rsvp">
              <Button size="lg" className="font-cinzel tracking-widest text-xs px-8 gold-gradient border-primary/30 text-white shadow-lg">
                RSVP Now
              </Button>
            </Link>
            <Link href="/events">
              <Button size="lg" variant="outline" className="font-cinzel tracking-widest text-xs px-8 border-white/30 text-white bg-white/10 backdrop-blur-sm">
                View Events
              </Button>
            </Link>
          </div>
        </div>

        <a href="#story" className="absolute bottom-8 z-10 flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <span className="text-xs tracking-widest font-cinzel">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </a>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Our Story</p>
          <div className="ornament-divider mb-8">
            <Heart className="w-4 h-4 text-primary fill-primary" />
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6 mx-auto" />
              <Skeleton className="h-4 w-4/6 mx-auto" />
            </div>
          ) : (
            <p className="font-serif text-lg md:text-xl italic text-foreground/80 leading-relaxed">
              "{wedding?.story}"
            </p>
          )}

          {wedding?.hashtag && (
            <p className="mt-6 font-cinzel text-sm tracking-widest text-primary">{wedding.hashtag}</p>
          )}
        </div>
      </section>

      {/* Venue Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Venue</p>
            <h2 className="font-cinzel text-2xl md:text-3xl font-semibold gold-text">{wedding?.venue}</h2>
            <p className="mt-2 font-serif text-muted-foreground italic">{wedding?.venueAddress}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: Calendar, label: "Date", value: formattedDate },
              { icon: MapPin, label: "Venue", value: wedding?.venue || "" },
              { icon: Heart, label: "Hashtag", value: wedding?.hashtag || "" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="bg-card border border-card-border rounded-md p-6 hover-elevate shadow-sm">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center mx-auto mb-3">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="font-cinzel text-xs tracking-widest text-muted-foreground uppercase mb-1">{label}</p>
                <p className="font-serif text-sm text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-4">Join Us</p>
          <h2 className="font-cinzel text-2xl md:text-3xl font-semibold mb-4">
            We'd Love to Have You
          </h2>
          <p className="font-serif text-muted-foreground italic mb-8">
            Please let us know if you can make it by filling out the RSVP form below.
          </p>
          <Link href="/rsvp">
            <Button size="lg" className="font-cinzel tracking-widest text-xs px-10 gold-gradient text-white shadow-lg">
              Confirm Attendance
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-3 h-3 text-primary fill-primary" />
          <span className="font-cinzel text-xs tracking-widest text-muted-foreground">
            {wedding?.brideName} & {wedding?.groomName}
          </span>
          <Heart className="w-3 h-3 text-primary fill-primary" />
        </div>
        <p className="font-serif text-xs text-muted-foreground italic">Made with ❤️ by Krishna Bhujade</p>
      </footer>
    </div>
  );
}
