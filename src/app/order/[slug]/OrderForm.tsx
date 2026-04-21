"use client";

import { useState } from "react";
import type { SiteRecord } from "@/types";

interface Props {
  site: SiteRecord;
  orderType: "GUEST_POST" | "LINK_INSERT";
}

interface FormState {
  name: string;
  email: string;
  targetUrl: string;
  anchorText: string;
  contentNotes: string;
  dofollow: boolean;
}

export default function OrderForm({ site, orderType }: Props) {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    targetUrl: "",
    anchorText: "",
    contentNotes: "",
    dofollow: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({ ...prev, [target.name]: target.checked }));
    } else {
      setForm((prev) => ({ ...prev, [target.name]: target.value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId: site.id,
          siteSlug: site.slug,
          type: orderType,
          ...form,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? "Checkout failed. Please try again."
        );
      }

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-lg font-semibold text-[#e6edf3] mb-1">
        Your Details
      </h2>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white/60 mb-1.5"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Jane Smith"
            className="w-full rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white/60 mb-1.5"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="jane@company.com"
            className="w-full rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="targetUrl"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Target URL
        </label>
        <input
          id="targetUrl"
          name="targetUrl"
          type="url"
          required
          value={form.targetUrl}
          onChange={handleChange}
          placeholder="https://yoursite.com/page-you-want-linked"
          className="w-full rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors"
        />
        <p className="mt-1.5 text-xs text-white/30">
          The full URL you want the do-follow link pointing to.
        </p>
      </div>

      <div>
        <label
          htmlFor="anchorText"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Anchor Text
        </label>
        <input
          id="anchorText"
          name="anchorText"
          type="text"
          required
          value={form.anchorText}
          onChange={handleChange}
          placeholder="best running shoes for flat feet"
          className="w-full rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors"
        />
        <p className="mt-1.5 text-xs text-white/30">
          Exact match, partial match, or branded anchor text.
        </p>
      </div>

      <div>
        <label
          htmlFor="contentNotes"
          className="block text-sm font-medium text-white/60 mb-1.5"
        >
          Content Notes / Special Requirements{" "}
          <span className="text-white/30 font-normal">(optional)</span>
        </label>
        <textarea
          id="contentNotes"
          name="contentNotes"
          rows={4}
          value={form.contentNotes}
          onChange={handleChange}
          placeholder={
            orderType === "GUEST_POST"
              ? "Topic ideas, angle, keywords to include, any URLs to avoid..."
              : "Preferred article topic or URL to insert into, context notes..."
          }
          className="w-full rounded-lg border border-white/10 bg-[#111827] px-3.5 py-2.5 text-sm text-[#e6edf3] placeholder:text-white/25 focus:outline-none focus:ring-2 focus:ring-[#4ade80]/40 focus:border-[#4ade80]/40 transition-colors resize-none"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          id="dofollow"
          name="dofollow"
          type="checkbox"
          checked={form.dofollow}
          onChange={handleChange}
          className="h-4 w-4 rounded border border-white/20 bg-[#111827] accent-[#4ade80] cursor-pointer"
        />
        <label htmlFor="dofollow" className="text-sm text-white/60 cursor-pointer">
          Do-follow link (recommended)
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full inline-flex items-center justify-center rounded-lg bg-[#4ade80] hover:bg-[#22c55e] disabled:opacity-50 disabled:cursor-not-allowed text-[#0d1117] font-semibold px-5 py-3 text-sm transition-colors"
        >
          {submitting ? "Redirecting to payment..." : "Proceed to Payment"}
        </button>
        <p className="mt-3 text-center text-xs text-white/30">
          Secure checkout via Stripe. You will not be charged until you complete payment.
        </p>
      </div>
    </form>
  );
}
