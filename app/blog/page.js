import Link from "next/link";
import { posts } from "./posts";

export default function BlogIndexPage() {
  return (
    <main className="py-12 sm:py-16">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Nested route · nested layout</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Field notes<span className="text-emerald-700">.</span></h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">The blog layout stays around while the page content changes. Each post link is built from its slug.</p>
      <div className="mt-9 grid gap-4 md:grid-cols-2">
          {posts.map((post, index) => <article className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/5" key={post.slug}><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-emerald-800">{post.category} · 0{index + 1}</span><h2 className="mt-5 text-xl font-extrabold tracking-tight"><Link className="transition group-hover:text-emerald-800" href={`/blog/${post.slug}`}>{post.title}</Link></h2><p className="mt-2 text-sm leading-6 text-slate-600">{post.excerpt}</p><Link className="mt-5 inline-flex text-sm font-bold text-emerald-800" href={`/blog/${post.slug}`}>Read article <span className="ml-2 transition group-hover:translate-x-1">→</span></Link></article>)}
      </div>
    </main>
  );
}
