import Link from "next/link";

export default function ProjectsLayout({ children }) {
  return (
    <section>
      <nav className="flex gap-2 border-b border-slate-200 py-4 text-sm font-semibold" aria-label="Project pages"><Link className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard/projects">All projects</Link><Link className="rounded-lg px-3 py-2 text-slate-500 transition hover:bg-emerald-50 hover:text-emerald-900" href="/dashboard/projects/route-lab">RouteLab detail</Link></nav>
      {children}
    </section>
  );
}
