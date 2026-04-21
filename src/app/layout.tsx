import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BB Link Marketplace — Premium Link Placements",
  description:
    "Purchase guest posts and link insertions from BerryBloom Agency's owned network of content sites. Real DR, real traffic, real results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#0d1117] text-[#e6edf3] antialiased">
        <NavBar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-white/8 bg-[#0d1117] py-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-[#4ade80] font-semibold text-sm tracking-wide uppercase">
                BerryBloom Agency
              </span>
              <span className="text-white/20 text-sm">|</span>
              <span className="text-white/40 text-sm">BB Link Marketplace</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/40">
              <a
                href="mailto:links@berrybloom.agency"
                className="hover:text-white/70 transition-colors"
              >
                links@berrybloom.agency
              </a>
              <span>&copy; {new Date().getFullYear()} BerryBloom Agency</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
