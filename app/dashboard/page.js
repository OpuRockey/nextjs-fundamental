import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="py-10 sm:py-14">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Nested route · shared layout</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Your workspace</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">The dashboard layout wraps this page and all dashboard descendants. Its sidebar remains shared while the content changes.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="text-xl font-extrabold">Project activity</h2><p className="mt-2 text-sm text-slate-500">3 projects · 2 drafts · all systems ready</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">All systems go</span></div><Link className="mt-6 inline-flex font-bold text-emerald-800 hover:text-emerald-950" href="/dashboard/projects">View projects <span className="ml-2">→</span></Link></div>
    </main>
  );
}
