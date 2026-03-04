import { useQuery } from "@tanstack/react-query";
import { NavBar } from "@/components/nav-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Heart } from "lucide-react";
import type { WeddingDetails, GalleryPhoto } from "@shared/schema";
import { useState } from "react";

const categories = ["all", "pre-wedding", "ceremony", "reception", "candid"];

export default function Gallery() {
  const { data: wedding } = useQuery<WeddingDetails>({ queryKey: ["/api/wedding"] });
  const { data: photos, isLoading } = useQuery<GalleryPhoto[]>({ queryKey: ["/api/gallery"] });
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);

  const filtered = photos?.filter(p => activeCategory === "all" || p.category === activeCategory) || [];

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
          <p className="font-cinzel text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Memories</p>
          <h1 className="font-cinzel text-3xl md:text-5xl font-bold gold-text mb-4">Photo Gallery</h1>
          <div className="ornament-divider max-w-xs mx-auto mb-4">
            <span className="font-serif text-muted-foreground italic text-sm px-3">Cherishing every moment</span>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-testid={`filter-${cat}`}
                className={`px-4 py-1.5 rounded-full font-cinzel text-xs tracking-wider border transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card text-muted-foreground border-border hover-elevate"
                }`}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="px-4 pb-24">
        <div className="max-w-5xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-md" />
              ))}
            </div>
          ) : filtered.length > 0 ? (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
              {filtered.map((photo) => (
                <div
                  key={photo.id}
                  className="break-inside-avoid cursor-pointer group relative rounded-md overflow-hidden shadow-sm hover-elevate"
                  onClick={() => setSelected(photo)}
                  data-testid={`photo-${photo.id}`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || "Wedding photo"}
                    className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    style={{ display: "block" }}
                  />
                  {photo.caption && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <p className="text-white text-xs font-serif italic">{photo.caption}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Camera className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="font-cinzel text-sm tracking-wider text-muted-foreground">Gallery coming soon</p>
              <p className="font-serif text-sm text-muted-foreground/60 italic mt-2">Photos will be added after the wedding</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-3xl w-full relative"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.caption || "Wedding photo"}
              className="w-full max-h-[80vh] object-contain rounded-md"
            />
            {selected.caption && (
              <p className="mt-3 text-center text-white/80 font-serif italic text-sm">{selected.caption}</p>
            )}
            <button
              onClick={() => setSelected(null)}
              className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover-elevate"
              data-testid="button-close-lightbox"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <footer className="py-8 border-t border-border text-center">
        <div className="flex items-center justify-center gap-2">
          <Heart className="w-3 h-3 text-primary fill-primary" />
          <p className="font-serif text-xs text-muted-foreground italic">Shaadi Planner</p>
          <Heart className="w-3 h-3 text-primary fill-primary" />
        </div>
      </footer>
    </div>
  );
}
