"use client";

import { useSearchParams } from "next/navigation";

export default function ProductSearch() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "all";
  return <p className="mt-6 rounded-xl border border-sky-200 bg-sky-50 p-4 text-sm leading-6 text-sky-950">Client Component reads <code>useSearchParams()</code>: current category is <strong>{category}</strong>. The page also reads the same query on the server to filter product data.</p>;
}
