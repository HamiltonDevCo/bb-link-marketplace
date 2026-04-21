import { notFound } from "next/navigation";
import Link from "next/link";
import type { SiteRecord } from "@/types";
import type { Metadata } from "next";

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
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const site = await getSite(slug);
  if (!site) return { title: "Site Not Found" };
  return {
    title: `${site.name} — BB Link Marketplace`,
    description: `DR ${site.dr} | ${site.niche} | Guest posts from ${formatDollars(site.priceGuest)}, link insertions from ${formatDollars(site.priceLink)}.`,
  };
}

const faqs = [
  {
    q: "Are these links do-follow?",
    a: "Yes. Every link placed through BB Link Marketplace is do-follow by default. We do not offer nofollow placements — if a site only supports nofollow, it is not in our catalog.",
  },
  {
    q: "Will the link stay live permanently?",
    a: "All placements are permanent. We own every site in the catalog, so there is no risk of the article or link being removed by a third-party publisher.",
  },
  {
    q: "Can I see the article before it goes live?",
    a: "For guest post orders, a draft is sent to you for review before publishing. Link insertions go live within the stated turnaround without a preview step, though you are welcome to provide placement guidance in the content notes.",
  },
  {
    q: "What anchor text policies apply?",
    a: "We accept exact match, partial match, and branded anchors. We recommend a mix for natural link profiles. We reserve the right to adjust anchors that appear spammy or that could cause a manual action.",
  },
  {
    q: "Do you accept all niches?",
    a: "We do not accept orders related to gambling, adult content, pharmaceuticals without a prescription, weapons, or any content that violates our terms. All other niches are accepted on a site-by-site basis depending on topical relevance.",
  },
];

export default async function SiteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const site = await getSite(slug);

  if (!site) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
        <Link href="/" className="hover:text-white/70 transition-colors">
          Browse Sites
        </Link>
        <span>/</span>
        <span className="text-white/60">{site.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-2">
          <h1 className="text-3xl font-bold text-[#e6edf3] tracking-tight">
            {site.name}
          </h1>
          <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-[#4ade80]/10 text-[#4ade80] ring-1 ring-[#4ade80]/20 mt-1">
            {site.niche}
          </span>
        </div>
        <p className="text-white/40 text-sm font-mono">{site.domain}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
        {[
          { label: "Domain Rating", value: site.dr },
          { label: "Domain Authority", value: site.da },
          { label: "Guest Post", value: formatDollars(site.priceGuest) },
          { label: "Link Insertion", value: formatDollars(site.priceLink) },
          { label: "Turnaround", value: `${site.turnaround}d` },
          { label: "Link Type", value: site.dofollow ? "Do-Follow" : "Nofollow" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-white/8 bg-[#111827] p-4 text-center"
          >
            <p className="text-xs text-white/40 mb-1 leading-tight">{label}</p>
            <p
              className={`text-lg font-bold ${
                label === "Link Type" && site.dofollow
                  ? "text-[#4ade80]"
                  : "text-[#e6edf3]"
              }`}
            >
              {String(value)}
            </p>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="rounded-xl border border-white/8 bg-[#111827] p-6 mb-8">
        <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
          About This Site
        </h2>
        <p className="text-[#e6edf3]/80 leading-relaxed">{site.description}</p>
      </div>

      {/* Order option cards */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {/* Guest Post */}
        <div className="rounded-xl border border-white/10 bg-[#111827] hover:border-[#4ade80]/30 transition-colors p-6 flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
              Guest Post
            </p>
            <p className="text-3xl font-bold text-[#e6edf3]">
              {formatDollars(site.priceGuest)}
            </p>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {[
              "600–900 word original article",
              "1 do-follow link to your URL",
              `Published within ${site.turnaround} business days`,
              "Draft review before publishing",
              "Permanent placement",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-[#4ade80] mt-0.5 shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={`/order/${site.slug}?type=GUEST_POST`}
            className="w-full inline-flex items-center justify-center rounded-lg bg-[#4ade80] hover:bg-[#22c55e] text-[#0d1117] font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Order Now
          </Link>
        </div>

        {/* Link Insertion */}
        <div className="rounded-xl border border-white/10 bg-[#111827] hover:border-[#4ade80]/30 transition-colors p-6 flex flex-col">
          <div className="mb-4">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
              Link Insertion
            </p>
            <p className="text-3xl font-bold text-[#e6edf3]">
              {formatDollars(site.priceLink)}
            </p>
          </div>
          <ul className="space-y-2 mb-6 flex-1">
            {[
              "Link added to existing published article",
              "Do-follow, contextually relevant placement",
              `Live within ${Math.max(1, site.turnaround - 1)} business days`,
              "No content creation needed",
              "Permanent placement",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-white/60">
                <span className="text-[#4ade80] mt-0.5 shrink-0">&#10003;</span>
                {item}
              </li>
            ))}
          </ul>
          <Link
            href={`/order/${site.slug}?type=LINK_INSERT`}
            className="w-full inline-flex items-center justify-center rounded-lg bg-white/8 hover:bg-white/12 text-[#e6edf3] border border-white/12 hover:border-white/20 font-semibold px-5 py-2.5 text-sm transition-colors"
          >
            Order Now
          </Link>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h2 className="text-xl font-bold text-[#e6edf3] mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-white/8 bg-[#111827] overflow-hidden"
            >
              <summary className="flex items-center justify-between px-5 py-4 cursor-pointer text-sm font-medium text-[#e6edf3] list-none select-none">
                {q}
                <span className="ml-4 shrink-0 text-white/40 group-open:rotate-45 transition-transform duration-200 text-lg leading-none">
                  +
                </span>
              </summary>
              <div className="px-5 pb-4 text-sm text-white/60 leading-relaxed border-t border-white/6 pt-3">
                {a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
