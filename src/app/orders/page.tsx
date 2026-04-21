"use client";

import { useState } from "react";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import type { OrderRecord } from "@/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function OrdersPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    setSubmitted(true);

    try {
      const res = await fetch(
        `/api/orders?email=${encodeURIComponent(email.trim())}`
      );
      if (!res.ok) throw new Error("Lookup failed");
      const data: OrderRecord[] = await res.json();
      setOrders(data);
    } catch {
      setError("Unable to look up orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setEmail("");
    setSubmitted(false);
    setOrders([]);
    setError(null);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-[#e6edf3] tracking-tight mb-3">
          Track Your Orders
        </h1>
        <p className="text-white/50 text-base">
          Enter the email address you used when placing your order.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="your@email.com"
          disabled={loading}
          className="flex-1 rounded-lg border border-white/10 bg-[#111827] px-4 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading || !email.trim()}
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] font-semibold px-5 py-2.5 text-sm transition-colors"
        >
          {loading ? "Looking up..." : "Look Up"}
        </button>
      </form>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300 text-center mb-6">
          {error}
        </div>
      )}

      {submitted && !loading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="text-center py-16 border border-white/8 rounded-xl bg-[#111827]">
              <p className="text-white/50 mb-2">
                No orders found for <strong className="text-white/70">{email}</strong>.
              </p>
              <p className="text-sm text-white/30 mb-4">
                Make sure you&apos;re using the same email you provided at checkout.
              </p>
              <button
                onClick={handleReset}
                className="text-sm text-[#4ade80] hover:underline"
              >
                Try another email
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-white/50">
                  {orders.length} order{orders.length !== 1 ? "s" : ""} for{" "}
                  <span className="text-white/70">{email}</span>
                </p>
                <button
                  onClick={handleReset}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  Change email
                </button>
              </div>
              <div className="rounded-xl border border-white/8 bg-[#111827] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/8">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider hidden sm:table-cell">
                        Site
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider hidden md:table-cell">
                        Type
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider hidden lg:table-cell">
                        Date
                      </th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-white/40 uppercase tracking-wider">
                        Link
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="hover:bg-white/3 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <Link
                            href={`/orders/${order.id}`}
                            className="text-[#4ade80] hover:underline font-mono text-xs"
                          >
                            {order.id.slice(0, 8).toUpperCase()}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-white/70 hidden sm:table-cell">
                          {order.site?.name ?? order.siteId}
                        </td>
                        <td className="px-5 py-4 text-white/50 hidden md:table-cell">
                          {order.type === "GUEST_POST" ? "Guest Post" : "Link Insertion"}
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-4 text-white/40 hidden lg:table-cell">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="px-5 py-4">
                          {order.publishedUrl ? (
                            <a
                              href={order.publishedUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#4ade80] hover:underline text-xs"
                            >
                              View Post
                            </a>
                          ) : (
                            <span className="text-white/25 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
