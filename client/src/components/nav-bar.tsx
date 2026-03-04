import { Link, useLocation } from "wouter";
import { useState } from "react";
import { Menu, X, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Invitation" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/rsvp", label: "RSVP" },
];

export function NavBar({ brideName, groomName }: { brideName?: string; groomName?: string }) {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary fill-primary" />
            <span className="font-cinzel text-sm md:text-base font-semibold tracking-widest gold-text">
              {brideName || "Priya"} & {groomName || "Arjun"}
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`px-4 py-2 text-sm tracking-wider font-cinzel cursor-pointer transition-colors rounded-md ${
                  location === link.href
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}>
                  {link.label}
                </span>
              </Link>
            ))}
            <Link href="/admin">
              <Button size="sm" variant="outline" className="ml-2 font-cinzel tracking-wider text-xs">
                Admin
              </Button>
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover-elevate"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/98 backdrop-blur-md px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-4 py-2.5 text-sm tracking-wider font-cinzel cursor-pointer rounded-md ${
                  location === link.href
                    ? "text-primary font-semibold bg-accent"
                    : "text-foreground"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </span>
            </Link>
          ))}
          <Link href="/admin">
            <span
              className="block px-4 py-2.5 text-sm tracking-wider font-cinzel cursor-pointer rounded-md text-muted-foreground"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </span>
          </Link>
        </div>
      )}
    </nav>
  );
}
