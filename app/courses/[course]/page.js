const courses = {
  nextjs: { title: "Next.js App Router", detail: "Build routes with folders, pages, nested layouts, and dynamic segments." },
  react: { title: "React Foundations", detail: "Compose interfaces from reusable components and props." },
};

export default async function CoursePage({ params, searchParams }) {
  const [{ course }, query] = await Promise.all([params, searchParams]);

  // The slow query variant makes the loading boundary easy to observe in the demo.
  if (query.slow === "1") {
    await new Promise((resolve) => setTimeout(resolve, 1800));
  }

  const item = courses[course] || { title: `Course: ${course}`, detail: "This dynamic route still renders for any course segment." };

  return <main className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20"><p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Dynamic route · <code>[course]</code></p><h1 className="text-4xl font-black tracking-tight sm:text-6xl">{item.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">{item.detail}</p><div className="mt-9 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">Captured path value: <code>course = "{course}"</code></p><p className="mt-4 text-slate-600">Try <code>/courses/react</code> and <code>/courses/nextjs</code>. Both URLs use this one page component.</p></div></main>;
}
