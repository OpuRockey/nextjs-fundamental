"use client";

import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const pathname = usePathname();

  function switchLocale(locale) {
    const params = new URLSearchParams(window.location.search);
    params.set("locale", locale);
    const query = params.toString();
    window.history.replaceState(null, "", `${pathname}${query ? `?${query}` : ""}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white p-4">
      <span className="mr-2 text-sm font-bold">Locale with replaceState:</span>
      <button type="button" onClick={() => switchLocale("en")} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold hover:border-emerald-300">English</button>
      <button type="button" onClick={() => switchLocale("fr")} className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold hover:border-emerald-300">French</button>
      <span className="text-xs text-slate-500">This replaces this history entry.</span>
    </div>
  );
}
