"use client";

import { useRouter } from "next/navigation";

export default function GoToDashboardButton() {
  const router = useRouter();
  return (
    <button className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-white/20" onClick={() => router.push("/dashboard")}>
      Open dashboard <span className="ml-2 text-emerald-200">↗</span>
    </button>
  );
}
