import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "../posts";
import LikeButton from "../../ui/LikeButton";

export function generateStaticParams() {
  return posts.map(({ slug }) => ({ slug }));
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = posts.find((item) => item.slug === slug);
  if (!post) notFound();

  return (
    <main className="py-12 sm:py-16">
      <p className="mb-3 text-xs font-extrabold uppercase tracking-[.17em] text-emerald-800">Dynamic segment · <code>[slug]</code> · params</p>
      <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">{post.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
      <article className="mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9"><p className="text-base leading-8 text-slate-700">{post.body}</p><p className="my-7 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-950">Current path parameter: <code>slug = "{slug}"</code></p><LikeButton /></article>
      <p className="mt-7"><Link className="font-bold text-emerald-800 hover:text-emerald-950" href="/blog">← Back to all articles</Link></p>
    </main>
  );
}
