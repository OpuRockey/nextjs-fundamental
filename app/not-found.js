import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-4xl flex-col items-center justify-center px-5 py-20 text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-emerald-100 text-2xl font-black text-emerald-900">?</span>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[.18em] text-emerald-800">404 · Route not found</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-6xl">This page took a wrong turn.</h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">That URL does not match one of our examples. Head back to the route map and try another path.</p>
      <Link className="mt-8 inline-flex min-h-12 items-center justify-center rounded-xl bg-emerald-800 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-emerald-900" href="/">Back to RouteLab</Link>
    </main>
  );
}
