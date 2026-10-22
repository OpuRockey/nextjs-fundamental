import Link from "next/link";

const projectNames = { "route-lab": "RouteLab", "garden-notes": "Garden Notes", "tiny-store": "Tiny Store" };

export default async function ProjectDetailPage({ params }) {
  const { projectId } = await params;
  const name = projectNames[projectId] || "A new project";

  return (
    <main className="py-9 sm:py-12">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Nested dynamic route · params</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">{name}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">This detail page receives <code>projectId</code> from <code>app/dashboard/projects/[projectId]/page.js</code>.</p>
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><p className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">Current path value: <code>projectId = "{projectId}"</code></p><p className="mt-4 text-slate-600">Render a real database record here in a production application.</p><Link className="mt-4 inline-flex font-bold text-emerald-800 hover:text-emerald-950" href="/dashboard/projects">← All projects</Link></div>
    </main>
  );
}
