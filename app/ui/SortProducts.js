"use client";

import { useSearchParams } from "next/navigation";

export default function SortProducts() {
  const searchParams = useSearchParams();
  const sortOrder = searchParams.get("sort") || "default";

  function updateSorting(order) {
    const params = new URLSearchParams(searchParams.toString());
    if (order === "default") params.delete("sort");
    else params.set("sort", order);
    const query = params.toString();
    window.history.pushState(null, "", query ? `?${query}` : window.location.pathname);
  }

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4">
      <span className="mr-2 text-sm font-bold text-slate-700">Sort with pushState:</span>
      {[["default", "Featured"], ["asc", "Price: low to high"], ["desc", "Price: high to low"]].map(([value, label]) => (
        <button key={value} type="button" onClick={() => updateSorting(value)} aria-pressed={sortOrder === value} className={`rounded-full border px-3 py-2 text-xs font-bold transition ${sortOrder === value ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 text-slate-600 hover:border-emerald-300"}`}>
          {label}
        </button>
      ))}
      <span className="text-xs text-slate-500">Back and Forward restore the previous sort.</span>
    </div>
  );
}
