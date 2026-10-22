import Link from "next/link";

export default function DashboardLayout({ children }) {
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-9 lg:px-10 lg:py-10">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-28">
        <h2 className="mb-3 px-3 pt-1 text-[11px] font-extrabold uppercase tracking-[.17em] text-slate-400">Workspace</h2>
        <nav className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-1" aria-label="Dashboard navigation">
          <Link className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard">Overview</Link>
          <Link className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard/projects">Projects</Link>
          <Link className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard/billing">Billing</Link>
          <Link className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard/settings">Settings</Link>
        </nav>
      </aside>
      <section className="min-w-0">
        <div className="flex flex-col gap-1 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"><strong className="text-sm font-bold text-slate-900">Good afternoon, learner</strong><span className="text-xs leading-5 text-slate-500">This shared layout wraps every dashboard route.</span></div>
        {children}
      </section>
    </div>
  );
}
