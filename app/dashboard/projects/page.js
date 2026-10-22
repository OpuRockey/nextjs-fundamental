import Link from "next/link";

const projects = [{ id: "route-lab", title: "RouteLab", status: "Learning" }, { id: "garden-notes", title: "Garden Notes", status: "In progress" }, { id: "tiny-store", title: "Tiny Store", status: "Planning" }];

export default function ProjectsPage() {
  return (
    <main className="py-9 sm:py-12">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Nested layout · projects/layout.js</p>
      <h1 className="text-4xl font-black tracking-tight sm:text-6xl">Projects</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">This route adds a second nested layout inside the dashboard layout. Select a project to open its dynamic detail route.</p>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><ul className="divide-y divide-slate-100">{projects.map((project) => <li className="flex flex-wrap items-center justify-between gap-3 p-5 sm:px-6" key={project.id}><div><Link className="font-bold text-slate-900 hover:text-emerald-800" href={`/dashboard/projects/${project.id}`}>{project.title}</Link><p className="mt-1 text-xs text-slate-500">Open project details</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">{project.status}</span></li>)}</ul></div>
    </main>
  );
}
