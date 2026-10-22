"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;

    const savedTheme = window.localStorage.getItem("theme");
    return savedTheme
      ? savedTheme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
    document.body.style.backgroundColor = dark ? "#0b1220" : "";
    document.body.style.color = dark ? "#e2e8f0" : "";

    document.querySelectorAll('[class~="bg-white"], [class~="bg-white/70"], [class~="bg-white/85"]').forEach((element) => {
      element.style.backgroundColor = dark ? "#111c2e" : "";
    });
    document.querySelectorAll('[class~="bg-slate-50"], [class~="bg-slate-100"]').forEach((element) => {
      element.style.backgroundColor = dark ? "#1e293b" : "";
    });
    document.querySelectorAll('[class~="bg-emerald-50"], [class~="bg-emerald-100"], [class~="bg-sky-50"], [class~="bg-amber-50"]').forEach((element) => {
      element.style.backgroundColor = dark ? "#16352f" : "";
    });
    document.querySelectorAll('[class~="text-slate-900"]').forEach((element) => {
      element.style.color = dark ? "#f1f5f9" : "";
    });
    document.querySelectorAll('[class~="text-slate-600"]').forEach((element) => {
      element.style.color = dark ? "#cbd5e1" : "";
    });
    document.querySelectorAll('[class~="text-slate-500"], [class~="text-slate-400"]').forEach((element) => {
      element.style.color = dark ? "#94a3b8" : "";
    });
    document.querySelectorAll('[class~="text-emerald-800"]').forEach((element) => {
      element.style.color = dark ? "#6ee7b7" : "";
    });
  }

  useEffect(() => {
    applyTheme(isDark);
    window.localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  function toggleTheme() {
    setIsDark((currentTheme) => !currentTheme);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      suppressHydrationWarning
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      aria-pressed={isDark}
      className="inline-flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
