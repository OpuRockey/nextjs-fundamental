# Next.js Layouts & Pages — The Mental Model You Actually Need

Reference: the current Next.js App Router documentation. The docs currently describe Next.js 16.3.5 and this page was updated August 25, 2026. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

The most important idea is this:

> **In the App Router, your folders define URL structure, while special files such as `page.tsx` and `layout.tsx` define what gets rendered.**

Once this clicks, a huge part of Next.js routing becomes much easier.

---

# 1. Big Picture: Next.js Routing Is File-System Based

Imagine you create this:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── blog/
    ├── page.tsx
    └── [slug]/
        └── page.tsx
```

Next.js interprets it roughly like this:

```text
app/page.tsx
        ↓
       /

app/about/page.tsx
        ↓
      /about

app/blog/page.tsx
        ↓
      /blog

app/blog/[slug]/page.tsx
        ↓
    /blog/:slug
```

So:

```text
Folder = URL segment
page.tsx = publicly accessible UI for that route
layout.tsx = shared UI surrounding routes
```

This is called **file-system based routing**. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 2. First Character: `page.tsx`

A `page.tsx` represents the UI for a particular route.

For example:

```text
app/
└── page.tsx
```

```tsx
export default function Page() {
  return <h1>Hello Next.js!</h1>
}
```

This produces:

```text
http://localhost:3000/
```

The important part is that the component is **default exported**.

```tsx
export default function Page() {
  return <h1>Hello</h1>
}
```

You cannot think of `page.tsx` as simply "a React component."

It has a special meaning to Next.js:

> "This file represents the UI of this route."

The official documentation defines a page as UI rendered on a specific route. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 3. Creating `/about`

Now:

```text
app/
├── page.tsx
└── about/
    └── page.tsx
```

`app/about/page.tsx`:

```tsx
export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>We build awesome software.</p>
    </main>
  )
}
```

URL:

```text
/about
```

Notice something important:

There is **no route configuration file**.

You don't write:

```ts
router.get('/about', ...)
```

You don't register:

```ts
{
  path: '/about',
  component: AboutPage
}
```

The folder itself establishes the route.

---

# 4. The Magic of `layout.tsx`

Now we reach one of the most important concepts in Next.js.

Suppose your application has:

```text
app/
├── layout.tsx
├── page.tsx
└── about/
    └── page.tsx
```

Your root layout could be:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>My SaaS</h1>
        </header>

        <main>{children}</main>

        <footer>
          © 2026 My SaaS
        </footer>
      </body>
    </html>
  )
}
```

Think of `children` as:

> **"Whatever page is currently being displayed inside this layout."**

So visiting:

```text
/
```

conceptually becomes:

```text
RootLayout
   │
   └── page.tsx
```

Visiting:

```text
/about
```

becomes:

```text
RootLayout
   │
   └── about/page.tsx
```

So the rendered structure is approximately:

```text
<html>
  <body>

    Header

    ┌───────────────────────┐
    │                       │
    │       PAGE            │
    │                       │
    └───────────────────────┘

    Footer

  </body>
</html>
```

The official docs describe layouts as shared UI between multiple pages, and importantly, layouts preserve state and remain interactive during navigation rather than being rerendered like a new page. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 5. Why Do We Need Layouts?

Imagine building a SaaS dashboard.

You might have:

```text
/dashboard
/dashboard/projects
/dashboard/settings
/dashboard/billing
```

All of these need:

```text
┌──────────────────────────────────────────┐
│ Logo                         User Avatar │
├──────────────┬───────────────────────────┤
│ Dashboard    │                           │
│ Projects     │       PAGE CONTENT        │
│ Billing      │                           │
│ Settings     │                           │
│              │                           │
└──────────────┴───────────────────────────┘
```

You don't want to duplicate this in every page.

Instead:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── projects/
    │   └── page.tsx
    ├── billing/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

`dashboard/layout.tsx`:

```tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="dashboard">
      <aside>
        <nav>
          <a href="/dashboard">Dashboard</a>
          <a href="/dashboard/projects">Projects</a>
          <a href="/dashboard/billing">Billing</a>
          <a href="/dashboard/settings">Settings</a>
        </nav>
      </aside>

      <main>{children}</main>
    </div>
  )
}
```

Now every page under `/dashboard` automatically gets that layout.

---

# 6. Nested Routes

Let's make the URL:

```text
/blog
```

Create:

```text
app/
└── blog/
    └── page.tsx
```

That gives:

```text
/blog
```

Now create:

```text
app/
└── blog/
    ├── page.tsx
    └── tutorials/
        └── page.tsx
```

That gives:

```text
/blog
/blog/tutorials
```

Each folder represents another URL segment.

Think:

```text
app/
│
├── blog/
│   │
│   ├── page.tsx
│   │
│   └── tutorials/
│       │
│       └── page.tsx
```

becomes:

```text
        /
        │
       blog
      /    \
   page   tutorials
            │
           page
```

URLs:

```text
/blog
/blog/tutorials
```

The docs describe this as a route being composed of multiple segments. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 7. Very Important: Folder ≠ Page

This distinction causes a lot of confusion.

Suppose:

```text
app/
└── dashboard/
    └── components/
        └── Chart.tsx
```

Does this create:

```text
/dashboard/components
```

?

**No.**

Because `components` does not contain a `page.tsx`.

You could have:

```text
app/
└── dashboard/
    ├── page.tsx
    └── components/
        ├── Chart.tsx
        └── Sidebar.tsx
```

Those are just files/folders used by your application.

The route is created when the appropriate `page.tsx` exists.

This is a powerful architectural feature.

You can colocate route-specific components:

```text
app/
└── dashboard/
    ├── page.tsx
    ├── components/
    │   ├── StatsCard.tsx
    │   └── RevenueChart.tsx
    └── lib/
        └── queries.ts
```

without accidentally exposing every file as a route.

---

# 8. Dynamic Routes — `[slug]`

Now let's build a real blog.

Imagine your database contains:

```text
id: 1
slug: nextjs-layouts
title: Understanding Next.js Layouts

id: 2
slug: server-components
title: Understanding Server Components
```

You don't want:

```text
app/blog/nextjs-layouts/page.tsx
app/blog/server-components/page.tsx
app/blog/another-post/page.tsx
```

That would be ridiculous for a CMS.

Instead:

```text
app/
└── blog/
    └── [slug]/
        └── page.tsx
```

Now:

```text
/blog/nextjs-layouts
/blog/server-components
/blog/anything
```

can all use the same page component.

The `[slug]` is a **dynamic segment**. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 9. Understanding `[slug]`

Think of:

```text
[slug]
```

as a variable.

For:

```text
/blog/nextjs-layouts
```

Next.js gives you:

```ts
slug = "nextjs-layouts"
```

For:

```text
/blog/server-components
```

you get:

```ts
slug = "server-components"
```

So:

```text
/blog/[slug]
```

is conceptually:

```text
/blog/:slug
```

But Next.js expresses it through the filesystem.

---

# 10. Getting `params`

Current Next.js uses asynchronous route props.

For:

```text
app/blog/[slug]/page.tsx
```

you can write:

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return (
    <main>
      <h1>Blog Post</h1>
      <p>Slug: {slug}</p>
    </main>
  )
}
```

Visit:

```text
/blog/nextjs-layouts
```

and:

```ts
slug
```

is:

```text
nextjs-layouts
```

The current docs explicitly show `params` as a `Promise` and access it with `await`. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 11. Dynamic Route + Database

Now things get interesting.

Imagine:

```ts
async function getPost(slug: string) {
  // Database query
}
```

Then:

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const post = await getPost(slug)

  return (
    <article>
      <h1>{post.title}</h1>

      <div>
        {post.content}
      </div>
    </article>
  )
}
```

The request flow is approximately:

```text
Browser
   │
   │ GET /blog/nextjs-layouts
   ▼
Next.js Router
   │
   │ matches
   ▼
app/blog/[slug]/page.tsx
   │
   │ slug = "nextjs-layouts"
   ▼
getPost("nextjs-layouts")
   │
   ▼
Database
   │
   ▼
Post
   │
   ▼
Rendered UI
```

This is one of the places where the App Router becomes extremely powerful because your page can perform server-side data access directly rather than needing to create an internal API endpoint merely for the page to call.

---

# 12. Nested Layouts

Now let's combine everything.

Consider:

```text
app/
├── layout.tsx
├── page.tsx
│
└── blog/
    ├── layout.tsx
    ├── page.tsx
    │
    └── [slug]/
        └── page.tsx
```

We have:

### Root layout

```text
app/layout.tsx
```

### Blog layout

```text
app/blog/layout.tsx
```

### Blog page

```text
app/blog/page.tsx
```

### Blog post page

```text
app/blog/[slug]/page.tsx
```

The nesting becomes:

```text
RootLayout
    │
    └── BlogLayout
            │
            └── BlogPostPage
```

The official docs describe exactly this nesting behavior: the root layout wraps the blog layout, which wraps the blog pages. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 13. Visualize the Layout Tree

This is one of the best mental models for Next.js.

Suppose:

```text
app/
├── layout.tsx
└── dashboard/
    ├── layout.tsx
    └── projects/
        ├── layout.tsx
        └── page.tsx
```

The final rendering tree is:

```text
RootLayout
│
└── DashboardLayout
    │
    └── ProjectsLayout
        │
        └── ProjectsPage
```

Not:

```text
RootLayout
DashboardLayout
ProjectsLayout
ProjectsPage
```

They are **nested**.

Each layout receives the next level through:

```tsx
{children}
```

---

# 14. Root Layout Is Special

The root layout:

```text
app/layout.tsx
```

is required.

It must contain:

```tsx
<html>
  <body>
    {children}
  </body>
</html>
```

For example:

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

The root layout is the outermost layout of the application and must contain the `html` and `body` elements. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 15. Search Parameters

Now let's talk about URLs like:

```text
/products?category=keyboard&sort=price
```

Everything after:

```text
?
```

is a **search parameter**.

For example:

```text
/products?category=keyboard
```

has:

```text
category=keyboard
```

as the search parameter.

In a Server Component page, you can receive:

```tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string | string[] | undefined
  }>
}) {
  const params = await searchParams

  const category = params.category

  return (
    <div>
      <h1>Products</h1>

      <p>Category: {category}</p>
    </div>
  )
}
```

So:

```text
/products?category=keyboard
```

produces:

```text
category = "keyboard"
```

The current docs note that `searchParams` is asynchronous and that using the page's `searchParams` opts that page into dynamic rendering because the value comes from the incoming request. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 16. `params` vs `searchParams`

This is extremely important.

Compare:

```text
/blog/nextjs
```

with:

```text
/blog/nextjs?comments=true
```

The first contains a **path parameter**:

```text
slug = nextjs
```

The second contains:

```text
slug = nextjs
comments = true
```

So:

### `params`

Comes from the URL path.

```text
/blog/[slug]

/blog/nextjs
       ↑
      slug
```

### `searchParams`

Comes after `?`.

```text
/blog/nextjs?comments=true

                    ↑
              search parameter
```

Think:

```text
URL
│
├── Path
│    └── params
│
└── Query string
     └── searchParams
```

---

# 17. When Should You Use `searchParams`?

The docs give a useful distinction.

Use the page's:

```tsx
searchParams
```

when the parameter affects server-side data loading.

For example:

```text
/products?page=3
```

You might query the database:

```ts
const products = await getProducts({
  page: 3,
})
```

That should happen on the server.

But suppose you already downloaded 100 products and simply want to filter them in the browser.

Then a Client Component can use:

```tsx
useSearchParams()
```

The official docs recommend the page `searchParams` when parameters need to load page data, such as database pagination/filtering, and `useSearchParams` when they're only being used on the client. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 18. Linking Between Pages

You could technically write:

```tsx
<a href="/about">About</a>
```

But Next.js provides:

```tsx
import Link from 'next/link'
```

Then:

```tsx
<Link href="/about">
  About
</Link>
```

Why?

Because `Link` enables Next.js navigation optimizations such as prefetching and client-side navigation. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

For example:

```tsx
import Link from 'next/link'

export default function HomePage() {
  return (
    <main>
      <h1>Home</h1>

      <Link href="/about">
        About Us
      </Link>
    </main>
  )
}
```

---

# 19. Dynamic Links

Suppose:

```ts
const posts = [
  {
    slug: 'nextjs-layouts',
    title: 'Next.js Layouts',
  },
  {
    slug: 'server-components',
    title: 'Server Components',
  },
]
```

You can do:

```tsx
import Link from 'next/link'

export default function Posts() {
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </li>
      ))}
    </ul>
  )
}
```

This creates:

```text
/blog/nextjs-layouts
/blog/server-components
```

The docs identify `<Link>` as the primary navigation mechanism in Next.js, while `useRouter` is available for more advanced programmatic navigation. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 20. `Link` vs `useRouter`

Think:

### Normal navigation

Use:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

### Programmatic navigation

Use:

```tsx
'use client'

import { useRouter } from 'next/navigation'

export default function LoginButton() {
  const router = useRouter()

  function handleLogin() {
    // login...
    router.push('/dashboard')
  }

  return (
    <button onClick={handleLogin}>
      Login
    </button>
  )
}
```

So:

```text
User clicks navigation link
        ↓
<Link>
```

versus:

```text
Some event happens
        ↓
JavaScript decides where to go
        ↓
router.push()
```

---

# 21. Route Props Helpers — A Newer TypeScript Feature

Current Next.js provides:

```ts
PageProps
```

and:

```ts
LayoutProps
```

as generated global helper types. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

For example:

```text
app/blog/[slug]/page.tsx
```

You can write:

```tsx
export default async function Page(
  props: PageProps<'/blog/[slug]'>
) {
  const { slug } = await props.params

  return <h1>{slug}</h1>
}
```

You don't need to manually write:

```ts
{
  params: Promise<{ slug: string }>
}
```

every time.

Next.js can infer the route structure.

---

# 22. `LayoutProps`

Similarly:

```text
app/dashboard/layout.tsx
```

could use:

```tsx
export default function Layout(
  props: LayoutProps<'/dashboard'>
) {
  return (
    <section>
      {props.children}
    </section>
  )
}
```

This becomes especially useful with more advanced routing features such as named slots / parallel routes.

The generated helpers are globally available and are generated during `next dev`, `next build`, or `next typegen`. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

---

# 23. A Real SaaS Application

Let's put everything together.

Imagine you're building:

> **AI Content SaaS**

Your routes might look like:

```text
app/
├── layout.tsx
├── page.tsx
│
├── pricing/
│   └── page.tsx
│
├── blog/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    │
    ├── projects/
    │   ├── page.tsx
    │   └── [projectId]/
    │       └── page.tsx
    │
    ├── billing/
    │   └── page.tsx
    │
    └── settings/
        └── page.tsx
```

This gives:

```text
/                         → Homepage
/pricing                  → Pricing
/blog                     → Blog
/blog/my-first-post      → Blog post
/dashboard                → Dashboard
/dashboard/projects       → Projects
/dashboard/projects/123   → Project 123
/dashboard/billing       → Billing
/dashboard/settings      → Settings
```

Now look at the layout hierarchy:

```text
RootLayout
│
├── HomePage
│
├── PricingPage
│
├── BlogLayout
│   ├── BlogPage
│   └── BlogPostPage
│
└── DashboardLayout
    ├── DashboardPage
    ├── ProjectsPage
    ├── ProjectPage
    ├── BillingPage
    └── SettingsPage
```

This is **the App Router mental model**.

---

# 24. The Most Important Architectural Idea

Here's something I want you to remember permanently:

```text
URL
 ↓
Folders
 ↓
Route segments
 ↓
Layouts + Page
 ↓
React component tree
```

For example:

```text
/dashboard/projects/123
```

maps to:

```text
app/
└── dashboard/
    ├── layout.tsx
    │
    └── projects/
        ├── layout.tsx
        │
        └── [projectId]/
            └── page.tsx
```

which creates approximately:

```text
RootLayout
    │
    └── DashboardLayout
            │
            └── ProjectsLayout
                    │
                    └── ProjectPage
```

And:

```text
projectId = "123"
```

comes from the dynamic segment.

---

# 25. Server Components — Where Does This Code Run?

By default, App Router pages and layouts are **Server Components**.

So this:

```tsx
export default async function DashboardPage() {
  const projects = await db.project.findMany()

  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>
          {project.name}
        </div>
      ))}
    </div>
  )
}
```

can execute on the server.

Conceptually:

```text
Browser
   │
   │ request
   ▼
Next.js Server
   │
   ├── page.tsx
   │
   ├── Database
   │
   └── render
   │
   ▼
Browser
```

This is one of the fundamental differences between thinking about Next.js as merely "React with routing" and understanding the App Router architecture.

---

# 26. Don't Make Everything `"use client"`

This is a common mistake.

Don't automatically do:

```tsx
'use client'
```

at the top of every page.

If your component doesn't need browser-only capabilities such as:

```text
useState
useEffect
onClick
window
localStorage
Web APIs
```

you generally don't need to make it a Client Component.

For example, this is perfectly suited to the server:

```tsx
export default async function ProductPage() {
  const product = await getProduct()

  return (
    <article>
      <h1>{product.name}</h1>
    </article>
  )
}
```

Then isolate interactivity:

```text
ProductPage
│
├── Product information
│
└── AddToCartButton ← Client Component
```

This keeps the client-side JavaScript smaller and preserves the server/client boundary.

---

# 27. A Production-Style Structure

For the SaaS application, I'd structure it roughly like:

```text
app/
├── layout.tsx
├── page.tsx
│
├── (marketing)/
│   ├── pricing/
│   │   └── page.tsx
│   └── about/
│       └── page.tsx
│
├── blog/
│   ├── layout.tsx
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
│
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── projects/
    │   ├── page.tsx
    │   └── [projectId]/
    │       └── page.tsx
    ├── billing/
    │   └── page.tsx
    └── settings/
        └── page.tsx
```

We'll get into `(marketing)` later when we study **Route Groups**.

---

# 28. Common Mistakes

## Mistake #1 — Thinking every folder creates a route

```text
app/
└── components/
    └── Button.tsx
```

doesn't mean you have:

```text
/components
```

You need the appropriate route special file.

---

## Mistake #2 — Forgetting `default`

Wrong:

```tsx
export function Page() {
  return <h1>Hello</h1>
}
```

For a page entry point, use:

```tsx
export default function Page() {
  return <h1>Hello</h1>
}
```

---

## Mistake #3 — Confusing `params` and `searchParams`

```text
/blog/hello
```

→ `params`

```text
/blog?category=nextjs
```

→ `searchParams`

---

## Mistake #4 — Creating an API just to fetch your own database

You might be tempted to do:

```text
Page
 ↓
/api/projects
 ↓
Database
```

for server-rendered page data.

Often that's unnecessary.

Instead:

```text
Page
 ↓
Database
```

directly from the server.

Route Handlers are useful when you actually need an HTTP API boundary—for example, browser/mobile clients, webhooks, third-party consumers, etc.

---

## Mistake #5 — Making the entire application Client Components

Avoid:

```tsx
'use client'
```

unless the component genuinely needs client-side behavior.

A good production architecture often looks like:

```text
Server Component
│
├── Server Component
│
├── Server Component
│
└── Client Component
      └── interactive UI
```

rather than:

```text
'use client'
Entire Application
```

---

# 29. The Ultimate Cheat Sheet

| Concept | Example | Meaning |
|---|---|---|
| `page.tsx` | `app/about/page.tsx` | Route UI |
| `layout.tsx` | `app/layout.tsx` | Shared UI |
| Folder | `app/blog/` | URL segment |
| `[slug]` | `app/blog/[slug]` | Dynamic segment |
| `params` | `{ slug }` | Path parameters |
| `searchParams` | `?page=2` | Query parameters |
| `<Link>` | `<Link href="/about">` | Navigation |
| `useRouter()` | `router.push()` | Programmatic navigation |
| `PageProps` | `PageProps<'/blog/[slug]'>` | Typed page props |
| `LayoutProps` | `LayoutProps<'/dashboard'>` | Typed layout props |

---

# 30. The Mental Model I Want You to Keep

If you remember only one diagram from this lesson, remember this:

```text
                    NEXT.JS APP ROUTER
                           │
                           ▼
                     FILE SYSTEM
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
         FOLDERS                       FILES
             │                           │
             ▼                           ▼
       URL SEGMENTS              SPECIAL FILES
                                     │
                       ┌─────────────┼─────────────┐
                       ▼             ▼             ▼
                    page.tsx     layout.tsx    other files
                       │             │
                       ▼             ▼
                     PAGE         SHARED UI
                       │             │
                       └──────┬──────┘
                              ▼
                       REACT TREE
                              │
                              ▼
                           BROWSER
```

And for:

```text
/dashboard/projects/123
```

think:

```text
app
│
└── dashboard
    │
    ├── layout.tsx
    │
    └── projects
        │
        └── [projectId]
            │
            └── page.tsx
```

which becomes:

```text
Root Layout
     │
     ▼
Dashboard Layout
     │
     ▼
Project Page
     │
     ▼
projectId = "123"
```

That mental model will make **nested routes, dynamic routes, route groups, parallel routes, intercepting routes, loading UI, error boundaries, and navigation** much easier later.

The current official documentation covers these exact building blocks—pages, layouts, nested routes, dynamic segments, search parameters, navigation, and the generated route-prop helpers. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages)

[Next.js — Layouts and Pages documentation](https://nextjs.org/docs/app/getting-started/layouts-and-pages?utm_source=chatgpt.com)

## Runnable examples

Explore the companion [Layouts and Pages examples](./layouts-and-pages-examples.md) in the app with `npm run dev`.

### What I would learn next

The natural next step is **Linking and Navigating**, because now that you understand how URLs become pages and layouts, the next question is:

> **What actually happens inside Next.js when I click `<Link href="/dashboard">`?**

That topic leads directly into **prefetching, client-side navigation, Server Components, rendering, caching, and why App Router navigation feels different from traditional full-page navigation.**

Keep exploring the App Router

- Learn Linking and Navigating
- Build the example app structure
