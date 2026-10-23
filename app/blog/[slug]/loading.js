export default function BlogPostLoading() {
  return (
    <main className="animate-pulse py-12 sm:py-16" aria-label="Loading article" aria-busy="true">
      <div className="h-3 w-44 rounded bg-emerald-100" />
      <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />
      <div className="mt-4 h-5 max-w-xl rounded bg-slate-100" />
      <div className="mt-8 h-56 max-w-4xl rounded-2xl bg-slate-100" />
      <p className="mt-5 text-sm font-semibold text-slate-500">Loading the article…</p>
    </main>
  );
}
