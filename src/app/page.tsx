"use client";

import { useState, useEffect, useMemo } from "react";
import SiteCard from "@/components/SiteCard";
import type { SiteRecord } from "@/types";

const NICHES = [
  "All Niches",
  "Health & Wellness",
  "Finance",
  "Technology",
  "Home & Garden",
  "Travel",
  "Food & Beverage",
  "Pets",
  "Sports & Fitness",
  "Business",
  "Lifestyle",
];

type SortKey = "price_asc" | "price_desc" | "dr_desc" | "dr_asc";

export default function HomePage() {
  const [sites, setSites] = useState<SiteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNiche, setSelectedNiche] = useState("All Niches");
  const [sortKey, setSortKey] = useState<SortKey>("dr_desc");

  useEffect(() => {
    fetch("/api/sites")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load sites");
        return r.json();
      })
      .then((data: SiteRecord[]) => {
        setSites(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Unable to load the site catalog. Please try again.");
        setLoading(false);
      });
  }, []);

  const availableNiches = useMemo(() => {
    const found = Array.from(new Set(sites.map((s) => s.niche))).sort();
    return ["All Niches", ...found];
  }, [sites]);

  const filtered = useMemo(() => {
    let list = sites.filter((s) => s.active);
    if (selectedNiche !== "All Niches") {
      list = list.filter((s) => s.niche === selectedNiche);
    }
    switch (sortKey) {
      case "price_asc":
        return list.sort(
          (a, b) =>
            Math.min(a.priceGuest, a.priceLink) -
            Math.min(b.priceGuest, b.priceLink)
        );
      case "price_desc":
        return list.sort(
          (a, b) =>
            Math.min(b.priceGuest, b.priceLink) -
            Math.min(a.priceGuest, a.priceLink)
        );
      case "dr_asc":
        return list.sort((a, b) => a.dr - b.dr);
      case "dr_desc":
      default:
        return list.sort((a, b) => b.dr - a.dr);
    }
  }, [sites, selectedNiche, sortKey]);

  const displayNiches = availableNiches.length > 1 ? availableNiches : NICHES;

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-white/8 bg-gradient-to-b from-[#111827] to-[#0d1117]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(74,222,128,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#4ade80]/20 bg-[#4ade80]/8 px-3 py-1 text-xs font-medium text-[#4ade80] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
            23 Owned Sites — Not a Network Reseller
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#e6edf3] leading-tight tracking-tight mb-5">
            Premium Link Placements from
            <br />
            <span className="text-[#4ade80]">BerryBloom Agency&apos;s</span> Owned Network
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/50 leading-relaxed mb-10">
            Every site in our catalog is owned and operated by BerryBloom Agency. No
            middlemen, no PBNs, no risk of deindexing. Guest posts and link insertions
            on real content sites with real traffic.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <span className="text-[#4ade80] font-semibold text-base">100%</span>
              Do-Follow Links
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#4ade80] font-semibold text-base">23</span>
              Owned Sites
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#4ade80] font-semibold text-base">3–7</span>
              Day Turnaround
            </div>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-[#4ade80] font-semibold text-base">DR 20+</span>
              Average
            </div>
          </div>
        </div>
      </section>

      {/* Filter bar */}
      <div className="sticky top-16 z-40 border-b border-white/8 bg-[#0d1117]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <label htmlFor="niche-filter" className="text-xs font-medium text-white/40 shrink-0">
              Niche
            </label>
            <select
              id="niche-filter"
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              className="appearance-none bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-[#4ade80]/40 cursor-pointer"
            >
              {displayNiches.map((n) => (
                <option key={n} value={n} className="bg-[#111827]">
                  {n}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs font-medium text-white/40 shrink-0">
              Order by
            </label>
            <select
              id="sort-select"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="appearance-none bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-sm text-[#e6edf3] focus:outline-none focus:ring-1 focus:ring-[#4ade80]/40 cursor-pointer"
            >
              <option value="dr_desc" className="bg-[#111827]">DR (High to Low)</option>
              <option value="dr_asc" className="bg-[#111827]">DR (Low to High)</option>
              <option value="price_asc" className="bg-[#111827]">Price (Low to High)</option>
              <option value="price_desc" className="bg-[#111827]">Price (High to Low)</option>
            </select>
          </div>
          {!loading && !error && (
            <span className="text-xs text-white/30 shrink-0">
              {filtered.length} site{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* Catalog */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="h-52 rounded-xl border border-white/8 bg-[#111827] animate-pulse"
              />
            ))}
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-white/50 mb-2">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm text-[#4ade80] hover:underline"
              >
                Reload
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-white/50 text-base mb-1">No sites match your filters.</p>
              <button
                onClick={() => setSelectedNiche("All Niches")}
                className="text-sm text-[#4ade80] hover:underline"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((site) => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
