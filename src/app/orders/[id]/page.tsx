import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { OrderRecord } from "@/types";
import type { Metadata } from "next";

function formatDollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type OrderStatus = OrderRecord["status"];

const STEPS: { key: OrderStatus; label: string; description: string }[] = [
  {
    key: "PAID",
    label: "Paid",
    description: "Payment confirmed and order received.",
  },
  {
    key: "IN_PROGRESS",
    label: "In Progress",
    description: "Our content team is working on your placement.",
  },
  {
    key: "REVIEW",
    label: "In Review",
    description: "Placement is under editorial review before publishing.",
  },
  {
    key: "PUBLISHED",
    label: "Published",
    description: "Your link is live. Check the published URL below.",
  },
];

const STATUS_ORDER: OrderStatus[] = ["PAID", "IN_PROGRESS", "REVIEW", "PUBLISHED"];

function getStepIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status);
}

async function getOrder(id: string): Promise<OrderRecord | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/orders/${id}`,
      { cache: "no-store" }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch order");
    return res.json();
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return { title: "Order Not Found" };
  return {
    title: `Order ${id.slice(0, 8).toUpperCase()} — BB Link Marketplace`,
  };
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) notFound();

  const isCancelled = order.status === "CANCELLED";
  const currentStepIndex = isCancelled ? -1 : getStepIndex(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back nav */}
      <nav className="flex items-center gap-2 text-sm text-white/40 mb-8">
        <Link href="/orders" className="hover:text-white/70 transition-colors">
          Order Lookup
        </Link>
        <span>/</span>
        <span className="text-white/60 font-mono">
          {order.id.slice(0, 8).toUpperCase()}
        </span>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#e6edf3] tracking-tight mb-1">
            Order Details
          </h1>
          <p className="text-sm text-white/40 font-mono">
            {order.id.slice(0, 8).toUpperCase()}
          </p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="rounded-xl border border-white/8 bg-[#111827] p-6 mb-6">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-6">
            Progress
          </h2>
          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-4 top-5 bottom-5 w-px bg-white/8" />
            <div className="space-y-6">
              {STEPS.map((step, idx) => {
                const isDone = idx <= currentStepIndex;
                const isActive = idx === currentStepIndex;
                return (
                  <div key={step.key} className="flex items-start gap-4">
                    <div
                      className={`relative z-10 shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-colors ${
                        isDone
                          ? "bg-[#4ade80] border-[#4ade80] text-[#0d1117]"
                          : "bg-[#111827] border-white/15 text-white/25"
                      }`}
                    >
                      {isDone && idx < currentStepIndex ? (
                        <span>&#10003;</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>
                    <div className="pt-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          isActive
                            ? "text-[#4ade80]"
                            : isDone
                            ? "text-[#e6edf3]"
                            : "text-white/30"
                        }`}
                      >
                        {step.label}
                      </p>
                      <p
                        className={`text-xs mt-0.5 ${
                          isDone ? "text-white/50" : "text-white/20"
                        }`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {isCancelled && (
        <div className="rounded-xl border border-red-400/20 bg-red-500/8 p-4 mb-6">
          <p className="text-sm text-red-300">
            This order was cancelled. Please contact{" "}
            <a
              href="mailto:links@berrybloom.agency"
              className="underline hover:text-red-200"
            >
              links@berrybloom.agency
            </a>{" "}
            if you have questions.
          </p>
        </div>
      )}

      {/* Published URL */}
      {order.publishedUrl && (
        <div className="rounded-xl border border-[#4ade80]/20 bg-[#4ade80]/8 p-5 mb-6">
          <p className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider mb-2">
            Published URL
          </p>
          <a
            href={order.publishedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#4ade80] hover:underline break-all"
          >
            {order.publishedUrl}
          </a>
        </div>
      )}

      {/* Order details grid */}
      <div className="rounded-xl border border-white/8 bg-[#111827] divide-y divide-white/6">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Order Summary
          </h2>
        </div>
        {[
          { label: "Site", value: order.site?.name ?? order.siteId },
          { label: "Domain", value: order.site?.domain ?? "—" },
          {
            label: "Type",
            value:
              order.type === "GUEST_POST" ? "Guest Post" : "Link Insertion",
          },
          { label: "Amount Paid", value: formatDollars(order.amountPaid) },
          { label: "Date Placed", value: formatDate(order.createdAt) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-5 py-3.5 gap-4"
          >
            <span className="text-sm text-white/40">{label}</span>
            <span className="text-sm text-[#e6edf3] text-right">{value}</span>
          </div>
        ))}
      </div>

      {/* Link brief */}
      <div className="rounded-xl border border-white/8 bg-[#111827] divide-y divide-white/6 mt-4">
        <div className="px-5 py-4">
          <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
            Link Brief
          </h2>
        </div>
        {[
          { label: "Target URL", value: order.targetUrl, mono: true },
          { label: "Anchor Text", value: order.anchorText },
          {
            label: "Do-Follow",
            value:
              (order as OrderRecord & { dofollow?: boolean }).dofollow !== false
                ? "Yes"
                : "No",
          },
          ...(order.contentNotes
            ? [{ label: "Content Notes", value: order.contentNotes }]
            : []),
        ].map(({ label, value, mono }) => (
          <div
            key={label}
            className="flex items-start justify-between px-5 py-3.5 gap-4"
          >
            <span className="text-sm text-white/40 shrink-0">{label}</span>
            <span
              className={`text-sm text-[#e6edf3] text-right break-all ${
                mono ? "font-mono text-xs" : ""
              }`}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Contact */}
      <p className="mt-8 text-center text-sm text-white/30">
        Questions about this order?{" "}
        <a
          href="mailto:links@berrybloom.agency"
          className="text-[#4ade80] hover:underline"
        >
          links@berrybloom.agency
        </a>
      </p>
    </div>
  );
}
