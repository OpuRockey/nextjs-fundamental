import Link from "next/link";

export default function BlogLayout({ children }) {
  return (
    <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
      <nav className="mt-7 flex flex-wrap gap-2 border-b border-slate-200 pb-4 text-sm font-semibold text-slate-500" aria-label="Blog navigation">
        <Link className="rounded-full bg-emerald-800 px-4 py-2 text-white" href="/blog">All articles</Link>
        <Link className="rounded-full px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-900" href="/blog/nextjs-layouts">Layouts</Link>
        <Link className="rounded-full px-4 py-2 transition hover:bg-emerald-50 hover:text-emerald-900" href="/blog/server-components">Server Components</Link>
      </nav>
      {children}
    </section>
  );
}
