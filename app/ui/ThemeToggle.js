"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  function applyTheme(dark) {
    document.documentElement.classList.toggle("dark", dark);
  }

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(savedTheme ? savedTheme === "dark" : prefersDark);
  }, []);

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
