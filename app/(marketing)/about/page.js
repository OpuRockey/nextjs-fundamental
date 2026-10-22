export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Static route · route group</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">About RouteLab</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">This page lives in <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-emerald-900">app/(marketing)/about/page.js</code>. The parentheses organize related routes in the file tree, while the group name does not appear in the URL.</p>
      <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9"><h2 className="text-xl font-extrabold">Try the URL</h2><p className="mt-3 leading-7 text-slate-600">This file serves <code>/about</code>, not <code>/(marketing)/about</code>. A route becomes public when its segment contains a page file.</p></div>
    </main>
  );
}
