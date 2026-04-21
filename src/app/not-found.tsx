import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
      <p className="text-6xl font-bold text-white/10 mb-4">404</p>
      <h1 className="text-xl font-semibold text-[#e6edf3] mb-2">
        Page not found
      </h1>
      <p className="text-sm text-white/40 mb-8">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-lg bg-[#4ade80]/10 hover:bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/20 px-5 py-2.5 text-sm font-medium transition-all"
      >
        Browse Sites
      </Link>
    </div>
  );
}
