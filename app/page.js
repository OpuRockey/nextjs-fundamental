import Link from "next/link";
import LikeButton from "./ui/LikeButton";
import GoToDashboardButton from "./ui/GoToDashboardButton";
import HoverPrefetchLink from "./ui/HoverPrefetchLink";
import LocaleSwitcher from "./ui/LocaleSwitcher";

const examples = [
  ["Static routes", "/about", "Folders plus page.js create routes."],
  ["Nested layouts", "/blog", "A blog layout wraps its index and post pages."],
  ["Dynamic route params", "/blog/nextjs-layouts", "Read a post slug from params."],
  ["Search parameters", "/products?category=keyboards", "Filter server data from the URL query."],
  ["Client search params", "/products?category=audio", "A Client Component reads the same query string."],
  ["Nested dashboard", "/dashboard/projects", "Shared dashboard and projects layouts."],
  ["Dynamic course", "/courses/nextjs", "One page handles different course names."],
  ["Route group", "/pricing", "The (marketing) folder organizes routes without adding a URL segment."],
  ["Streaming fallback", "/courses/nextjs", "A loading.js skeleton streams while the dynamic course resolves."],
  ["Native history sort", "/products", "pushState updates sort and keeps Back/Forward history."],
  ["Locale history", "/", "replaceState updates the locale without adding a history entry."],
];

export default function HomePage() {
  return (
    <main className="mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pt-16 lg:px-10 lg:pb-28 lg:pt-20">
      <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 px-7 py-10 text-white shadow-2xl shadow-emerald-950/15 sm:px-12 sm:py-14 lg:px-16 lg:py-16">
        <div className="absolute -right-12 -top-24 -z-10 size-80 rounded-full bg-lime-300/20 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 -z-10 size-72 rounded-full bg-teal-300/20 blur-3xl" />
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.17em] text-emerald-100"><span className="size-1.5 rounded-full bg-lime-300" /> A hands-on App Router playground</p>
        <h1 className="max-w-3xl text-5xl font-black leading-[.98] tracking-[-.065em] sm:text-6xl lg:text-7xl">Layouts &amp; Pages<span className="text-lime-300">.</span></h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-emerald-50/80 sm:text-lg sm:leading-8">
          Learn how folders become URLs, pages render route content, and layouts keep the whole experience connected.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-lime-300 px-5 text-sm font-extrabold text-emerald-950 shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-lime-200" href="/blog">Explore the blog <span aria-hidden="true">↗</span></Link>
        <GoToDashboardButton />
        </div>
      </section>
      <section className="mt-16 sm:mt-20" aria-label="Routing examples">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-800">Explore the playground</p><h2 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Pick a route. See the pattern.</h2></div>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500">11 interactive examples</span>
        </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {examples.map(([title, href, description], index) => (
          <Link className="group relative flex min-h-56 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-950/8" href={href} key={title}>
            <div className="flex items-center justify-between"><span className="grid size-9 place-items-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-800 transition group-hover:bg-emerald-800 group-hover:text-white">{String(index + 1).padStart(2, "0")}</span><span className="text-slate-300 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-emerald-700" aria-hidden="true">↗</span></div>
            <h3 className="mt-7 text-base font-extrabold tracking-tight text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            <span className="mt-auto pt-5 text-xs font-bold text-emerald-800">Open example <span aria-hidden="true">→</span></span>
          </Link>
        ))}
      </div>
      </section>
      <section className="mt-6 grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 sm:grid-cols-2 sm:p-8" aria-label="Navigation optimization demos">
        <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-emerald-800">Prefetch control</p><h2 className="text-xl font-black">Prefetch only when likely</h2><p className="mt-2 text-sm leading-6 text-slate-600">This link starts with prefetch disabled, then opts into the default behavior after pointer hover or keyboard focus. Link prefetching starts after hydration.</p><HoverPrefetchLink href="/blog/server-components" className="mt-4 inline-flex rounded-xl bg-emerald-800 px-4 py-3 text-sm font-bold text-white">Hover or focus to prefetch →</HoverPrefetchLink></div>
        <div className="flex items-center"><LocaleSwitcher /></div>
      </section>
      <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-8" aria-label="Loading UI demo">
        <p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-amber-900">Loading UI demo</p>
        <h2 className="text-xl font-black tracking-tight text-slate-900">See the fallback on demand</h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">This link disables prefetching and the demo route waits 1.8 seconds, making its loading skeleton visible even on a fast connection.</p>
        <Link prefetch={false} href="/courses/nextjs?slow=1" className="mt-4 inline-flex rounded-xl bg-amber-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-amber-950">Show course loading state →</Link>
      </section>
      <section className="mt-6 flex flex-col gap-6 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div><p className="mb-2 text-xs font-extrabold uppercase tracking-[.16em] text-emerald-800">A little client-side interactivity</p><h2 className="text-xl font-black tracking-tight text-slate-900 sm:text-2xl">Server by default. Interactive where it counts.</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">This like button needs browser state, so only this small component is a Client Component.</p></div>
        <LikeButton />
      </section>
    </main>
  );
}
