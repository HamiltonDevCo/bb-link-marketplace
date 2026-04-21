import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[#0d1117]/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-2 h-2 rounded-full bg-[#4ade80] group-hover:bg-[#22c55e] transition-colors" />
          <span className="font-semibold text-[#e6edf3] tracking-tight text-sm">
            BB Link Marketplace
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="px-4 py-2 text-sm text-white/60 hover:text-white/90 hover:bg-white/5 rounded-md transition-colors"
          >
            Browse Sites
          </Link>
          <Link
            href="/orders"
            className="px-4 py-2 text-sm text-white/60 hover:text-white/90 hover:bg-white/5 rounded-md transition-colors"
          >
            Track Order
          </Link>
        </nav>
      </div>
    </header>
  );
}
