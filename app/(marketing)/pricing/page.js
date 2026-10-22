export default function PricingPage() {
  return (
    <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Route groups · /pricing</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Simple pricing</h1>
      <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">This route is stored under <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm text-emerald-900">(marketing)</code> to keep the app organized. That folder is omitted from the public URL, so this is <code>/pricing</code>.</p>
      <div className="mt-10 max-w-lg rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-8 shadow-lg shadow-emerald-950/5"><div className="text-sm font-bold text-emerald-800">STARTER</div><h2 className="mt-3 text-3xl font-black">Free<span className="text-base font-semibold text-slate-500"> / forever</span></h2><p className="mt-3 text-slate-600">Unlimited learning examples. No checkout flow required.</p></div>
    </main>
  );
}
