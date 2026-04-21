import { notFound } from "next/navigation";
import type { SiteRecord } from "@/types";
import type { Metadata } from "next";
import OrderForm from "./OrderForm";

function formatDollars(cents: number) {
  return `$${Math.floor(cents / 100)}`;
}

async function getSite(slug: string): Promise<SiteRecord | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/sites/${slug}`,
      { next: { revalidate: 300 } }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch site");
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { type } = await searchParams;
  const site = await getSite(slug);
  if (!site) return { title: "Site Not Found" };
  const label = type === "LINK_INSERT" ? "Link Insertion" : "Guest Post";
  return {
    title: `Order ${label} on ${site.name} — BB Link Marketplace`,
  };
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { slug } = await params;
  const { type } = await searchParams;

  const site = await getSite(slug);
  if (!site) notFound();

  const orderType: "GUEST_POST" | "LINK_INSERT" =
    type === "LINK_INSERT" ? "LINK_INSERT" : "GUEST_POST";

  const price =
    orderType === "LINK_INSERT" ? site.priceLink : site.priceGuest;
  const label = orderType === "LINK_INSERT" ? "Link Insertion" : "Guest Post";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Order summary header */}
      <div className="rounded-xl border border-white/8 bg-[#111827] p-5 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
              Your Order
            </p>
            <h1 className="text-xl font-bold text-[#e6edf3]">
              {label} on {site.name}
            </h1>
            <p className="text-sm text-white/40 mt-1 font-mono">{site.domain}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-white/40 mb-0.5">Total</p>
            <p className="text-2xl font-bold text-[#4ade80]">
              {formatDollars(price)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-white/6 text-xs text-white/40">
          <span>DR {site.dr}</span>
          <span>&middot;</span>
          <span>DA {site.da}</span>
          <span>&middot;</span>
          <span>{site.niche}</span>
          <span>&middot;</span>
          <span>Do-Follow</span>
          <span>&middot;</span>
          <span>Turnaround: {site.turnaround} days</span>
        </div>
      </div>

      <OrderForm site={site} orderType={orderType} />
    </div>
  );
}
