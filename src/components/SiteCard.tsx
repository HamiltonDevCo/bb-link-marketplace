import Link from "next/link";
import type { SiteRecord } from "@/types";

function formatPrice(cents: number) {
  return `$${Math.floor(cents / 100)}`;
}

export default function SiteCard({ site }: { site: SiteRecord }) {
  return (
    <div className="group flex flex-col rounded-xl border border-white/8 bg-[#111827] hover:border-white/16 hover:bg-[#1a2332] transition-all duration-200">
      {/* Card header */}
      <div className="p-5 border-b border-white/6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-[#e6edf3] truncate leading-5">
              {site.name}
            </h3>
            <p className="text-xs text-white/40 mt-0.5 truncate">{site.domain}</p>
          </div>
          <span className="shrink-0 inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-[#4ade80]/10 text-[#4ade80] ring-1 ring-[#4ade80]/20">
            {site.niche}
          </span>
        </div>

        {/* DR / DA badges */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1">
            <span className="text-xs font-medium text-white/50">DR</span>
            <span className="text-sm font-bold text-[#e6edf3]">{site.dr}</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-white/5 px-2.5 py-1">
            <span className="text-xs font-medium text-white/50">DA</span>
            <span className="text-sm font-bold text-[#e6edf3]">{site.da}</span>
          </div>
          {site.dofollow && (
            <div className="flex items-center gap-1.5 rounded-md bg-[#4ade80]/8 px-2.5 py-1">
              <span className="text-xs font-medium text-[#4ade80]">Do-Follow</span>
            </div>
          )}
        </div>
      </div>

      {/* Pricing + CTA */}
      <div className="p-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-white/40 mb-1">From</p>
          <p className="text-xl font-bold text-[#e6edf3]">
            {formatPrice(Math.min(site.priceGuest, site.priceLink))}
          </p>
          <p className="text-xs text-white/40 mt-1">
            Ships in {site.turnaround} days
          </p>
        </div>
        <Link
          href={`/sites/${site.slug}`}
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-[#4ade80]/10 hover:bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/20 hover:border-[#4ade80]/40 px-4 py-2 text-sm font-medium transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
