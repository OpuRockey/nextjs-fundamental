export default function DashboardLoading() {
  return (
    <main className="animate-pulse py-10 sm:py-14" aria-label="Loading dashboard" aria-busy="true">
      <div className="h-3 w-40 rounded bg-emerald-100" />
      <div className="mt-5 h-12 max-w-xl rounded bg-slate-200" />
      <div className="mt-4 h-5 max-w-2xl rounded bg-slate-100" />
      <div className="mt-8 h-44 rounded-2xl bg-slate-100" />
      <p className="mt-5 text-sm font-semibold text-slate-500">Loading your workspace…</p>
    </main>
  );
}
