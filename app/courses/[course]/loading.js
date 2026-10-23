export default function CourseLoading() {
  return (
    <main className="mx-auto max-w-5xl animate-pulse px-5 py-14 sm:px-8 sm:py-20" aria-label="Loading course" aria-busy="true">
      <div className="h-3 w-40 rounded bg-emerald-100" />
      <div className="mt-5 h-12 max-w-2xl rounded bg-slate-200" />
      <div className="mt-5 h-5 max-w-3xl rounded bg-slate-100" />
      <div className="mt-9 h-36 rounded-2xl bg-slate-100" />
      <p className="mt-5 text-sm font-semibold text-slate-500">Loading the course…</p>
    </main>
  );
}
