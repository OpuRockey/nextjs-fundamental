import "./globals.css";
import Link from "next/link";
import ThemeToggle from "./ui/ThemeToggle";
import NavigationLink from "./ui/NavigationLink";

export const metadata = {
  title: "Layouts & Pages Playground",
  description: "Runnable examples for learning the Next.js App Router.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#f7f8f5] text-slate-900 antialiased selection:bg-emerald-200">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="mx-auto flex min-h-18 max-w-7xl flex-wrap items-center gap-x-10 gap-y-3 px-5 py-3 sm:px-8 lg:px-10">
            <Link href="/" className="group flex items-center gap-3 text-lg font-black tracking-tight text-slate-900">
              <span className="grid size-9 place-items-center rounded-xl bg-emerald-800 text-sm text-white shadow-lg shadow-emerald-950/15 transition group-hover:-rotate-6">R</span>
              RouteLab<span className="ml-1 hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.16em] text-emerald-800 sm:inline">Learn by building</span>
            </Link>
            <nav aria-label="Main navigation" className="order-3 flex w-full items-center gap-2 overflow-x-auto pb-1 text-sm font-semibold text-slate-500 sm:order-none sm:ml-auto sm:w-auto sm:pb-0">
              <a href="/about" className="whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-900">About · native link</a>
              {[["Blog", "/blog"], ["Products", "/products"], ["Dashboard", "/dashboard"]].map(([label, href]) => <NavigationLink key={href} href={href} className="whitespace-nowrap rounded-full px-3 py-2 transition hover:bg-emerald-50 hover:text-emerald-900">{label}</NavigationLink>)}
            </nav>
            <ThemeToggle />
          </div>
        </header>
        <div className="flex-1">{children}</div>
        <footer className="border-t border-slate-200 bg-white/70">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10">
            <span>Built to learn, one route at a time.</span><Link className="font-semibold text-emerald-800 hover:text-emerald-950" href="/">Back to examples ↑</Link>
          </div>
        </footer>
      </body>
    </html>
  );
}
