"use client";

import { useSearchParams } from "next/navigation";

export default function SortableProducts({ products }) {
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort");
  const sorted = [...products].sort((a, b) => {
    if (sort === "asc") return a.price - b.price;
    if (sort === "desc") return b.price - a.price;
    return 0;
  });

  return (
    <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((product) => (
        <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg" key={product.id}>
          <span className="text-3xl" aria-hidden="true">{product.icon}</span>
          <h2 className="mt-4 text-lg font-extrabold tracking-tight">{product.name}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
          <div className="mt-5 flex items-center justify-between"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-800">{product.category}</span><strong className="text-lg text-emerald-900">${product.price}</strong></div>
        </article>
      ))}
    </div>
  );
}
