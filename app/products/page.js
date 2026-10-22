import Link from "next/link";
import { Suspense } from "react";
import ProductSearch from "./ProductSearch";
import { products } from "./products";

const categories = ["all", "keyboards", "audio", "desk"];

export default async function ProductsPage({ searchParams }) {
  const query = await searchParams;
  const selected = typeof query.category === "string" ? query.category : "all";
  const category = categories.includes(selected) ? selected : "all";
  const visible = category === "all" ? products : products.filter((item) => item.category === category);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Search parameters · server data filtering</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">The desk shop</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">Click a category. The URL changes, the Server Component reads <code>searchParams</code>, and the product list is filtered on the server.</p>
      <div className="mt-7 flex flex-wrap gap-2" aria-label="Product categories">
        {categories.map((item) => <Link key={item} className={`rounded-full border px-4 py-2 text-sm font-bold capitalize shadow-sm transition ${category === item ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-900"}`} href={item === "all" ? "/products" : `/products?category=${item}`} aria-current={category === item ? "page" : undefined}>{item === category ? "✓ " : ""}{item}</Link>)}
      </div>
      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product) => <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg" key={product.id}><span className="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-3xl transition group-hover:scale-105" aria-hidden="true">{product.icon}</span><div className="mt-5 flex items-start justify-between gap-3"><h2 className="font-extrabold tracking-tight text-slate-900">{product.name}</h2><span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">{product.category}</span></div><p className="mt-2 text-sm leading-6 text-slate-500">{product.description}</p><span className="mt-4 block text-lg font-black text-emerald-800">${product.price}</span></article>)}
      </div>
      <Suspense fallback={<p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">Reading query in the browser…</p>}><ProductSearch /></Suspense>
      <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Page prop: <code>searchParams.category</code> = <strong>{category}</strong>. Try a value such as <code>?category=audio</code>, then compare it with the client component above.</p>
    </main>
  );
}
