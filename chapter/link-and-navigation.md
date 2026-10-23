# Next.js Linking & Navigating — From `<Link>` to Production-Grade Navigation

Reference: the current Next.js App Router documentation, which covers `<Link>`, prefetching, prerendering, streaming, client-side transitions, dynamic routes, and the native History API. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com) citeturn0search3 citeturn0view0

The most important idea is this:

> **Next.js navigation is not simply "change the URL." It is a coordinated process involving prefetching, server rendering, streaming, caching, and client-side transitions.**

Once you understand that, Next.js navigation becomes much easier to reason about.

---

# 1. Big Picture

Imagine you have this application:

```text
my-saas.com
│
├── /
├── dashboard
├── dashboard/settings
├── projects
├── projects/123
└── pricing
```

A traditional website might navigate like this:

```text
User clicks
    ↓
Browser requests new HTML
    ↓
Server generates HTML
    ↓
Browser downloads HTML
    ↓
Browser replaces the entire document
```

Next.js App Router tries to make this much smarter:

```text
User sees <Link>
       ↓
Next.js may PREFETCH the route
       ↓
User clicks
       ↓
CLIENT-SIDE TRANSITION
       ↓
Server sends required React Server Component payload
       ↓
Next.js updates only the necessary UI
       ↓
Shared layouts remain alive
```

And if the destination is slow:

```text
User clicks
    ↓
loading.tsx appears immediately
    ↓
Server continues rendering
    ↓
Actual page arrives
    ↓
Loading UI replaced
```

This combination of **prefetching + streaming + client-side transitions** is a major reason Next.js applications can feel like SPAs while still using server rendering. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 2. First: What Is Navigation?

Suppose you're currently here:

```text
/dashboard
```

and click:

```text
Projects
```

You want to go to:

```text
/projects
```

That's navigation.

In Next.js, there are several ways to accomplish it.

The most important one:

```tsx
<Link href="/projects">
  Projects
</Link>
```

There are also programmatic navigation APIs:

```tsx
router.push("/projects")
```

and browser History APIs:

```tsx
window.history.pushState(...)
```

We'll eventually understand all three.

---

# 3. The `<Link>` Component

The primary way to navigate between routes in the App Router is:

```tsx
import Link from "next/link";
```

Then:

```tsx
<Link href="/about">
  About
</Link>
```

For example:

```text
app/
├── page.tsx
├── about/
│   └── page.tsx
└── dashboard/
    └── page.tsx
```

Then:

```tsx
// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome</h1>

      <Link href="/about">
        About
      </Link>

      <br />

      <Link href="/dashboard">
        Dashboard
      </Link>
    </main>
  );
}
```

The resulting URLs are:

```text
/
 /about
 /dashboard
```

`<Link>` is essentially Next.js's enhanced version of the normal HTML `<a>` element. It provides features such as client-side navigation and prefetching. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages?utm_source=chatgpt.com)

---

# 4. Why Not Just Use `<a>`?

You might ask:

> "I'm a React developer. Why can't I just use `<a>`?"

You can.

For example:

```tsx
<a href="/dashboard">
  Dashboard
</a>
```

But this causes normal browser navigation.

Conceptually:

```text
<a href="/dashboard">

        ↓

Browser navigation

        ↓

New document request

        ↓

Full page reload
```

With:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

Next.js can perform:

```text
<Link>
   ↓
Prefetch
   ↓
Client-side transition
   ↓
Update route
   ↓
Preserve shared UI
```

That's a huge difference.

---

# 5. A Real Example: SaaS Dashboard

Imagine this:

```text
┌─────────────────────────────────────────────┐
│ My SaaS                                     │
│                                             │
│ Dashboard   Projects   Settings   Billing   │
│                                             │
│ ┌─────────────────────────────────────────┐ │
│ │                                         │ │
│ │            Dashboard Content            │ │
│ │                                         │ │
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

Your layout:

```tsx
// app/dashboard/layout.tsx

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/dashboard">
          Dashboard
        </Link>

        <Link href="/dashboard/projects">
          Projects
        </Link>

        <Link href="/dashboard/settings">
          Settings
        </Link>
      </nav>

      <main>
        {children}
      </main>
    </div>
  );
}
```

Now:

```text
/dashboard
```

to:

```text
/dashboard/projects
```

doesn't need to reconstruct everything.

The shared layout can remain.

Conceptually:

```text
Dashboard Layout
      │
      ├── Navigation
      │
      └── Current Page
              │
              └── Projects
```

When navigating:

```text
Dashboard Layout
      │
      ├── Navigation       ← preserved
      │
      └── Current Page
              │
              └── Settings → Projects
```

This is one of the most important App Router mental models.

---

# 6. Client-Side Navigation

Let's compare.

## Traditional `<a>`

```tsx
<a href="/projects">
  Projects
</a>
```

Conceptually:

```text
Browser
   ↓
GET /projects
   ↓
Server
   ↓
HTML
   ↓
Replace entire document
```

---

## Next.js `<Link>`

```tsx
<Link href="/projects">
  Projects
</Link>
```

Conceptually:

```text
Browser
   ↓
Next.js Router
   ↓
Request required route data
   ↓
Update route
   ↓
Preserve shared layouts
```

Next.js calls this a **client-side transition**. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

This doesn't mean the destination page necessarily renders in the browser.

This distinction is extremely important.

---

# 7. "Client-Side Navigation" Does NOT Mean "Client Rendering"

This confuses many developers.

Suppose:

```tsx
// app/projects/page.tsx

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>
          {project.name}
        </div>
      ))}
    </div>
  );
}
```

This is a **Server Component by default**.

The navigation may happen client-side:

```text
Browser
   ↓
Client-side transition
   ↓
Server
   ↓
Projects Server Component executes
   ↓
Server sends RSC payload
   ↓
Browser updates UI
```

So:

> **Client-side navigation ≠ client-side rendering.**

That's a very important Next.js concept.

---

# 8. The Magic Trick: Prefetching

Now we get to one of the coolest features.

Imagine the user sees:

```tsx
<Link href="/pricing">
  Pricing
</Link>
```

but hasn't clicked yet.

Next.js can start loading `/pricing` in the background.

That's called:

# Prefetching

The idea:

```text
User sees link
       ↓
Next.js thinks:
"They might click this."
       ↓
Background loading
       ↓
User clicks
       ↓
Route is already partially/fully available
       ↓
Navigation feels extremely fast
```

The current docs state that `<Link>` routes are automatically prefetched when links enter the viewport. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 9. Think of Prefetching Like a Restaurant

Imagine you're at a restaurant.

You haven't ordered dessert yet.

The waiter sees you looking at the dessert menu.

Instead of waiting until you order:

```text
You: "Cheesecake please."

Restaurant:
"Okay, we'll start preparing it."
```

Next.js essentially does:

```text
User sees Pricing link

Next.js:
"Maybe they'll click it."

Prepare route...
```

Then:

```text
User clicks

Next.js:
"Already prepared."
```

Navigation feels instant.

---

# 10. Static vs Dynamic Routes

Prefetching gets more interesting here.

Consider:

```text
/about
```

This may be a static route.

And:

```text
/dashboard
```

may be dynamic because it depends on user-specific data.

Next.js handles these differently.

According to the current documentation:

### Static route

The full route can be prefetched.

```text
/about

↓
Prefetch

↓
Full route available
```

### Dynamic route

Prefetching may be skipped or partially prefetched, particularly when no `loading.tsx` exists. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

Why?

Because Next.js doesn't want to perform expensive server work for every dynamic route the user might never visit.

---

# 11. Dynamic Route Example

Suppose you have:

```text
app/
└── products/
    └── [id]/
        └── page.tsx
```

Then:

```text
/products/1
/products/2
/products/3
/products/999
```

are dynamic routes.

Your page:

```tsx
// app/products/[id]/page.tsx

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
    </div>
  );
}
```

Imagine a product listing containing:

```tsx
<Link href="/products/1">
  Product 1
</Link>

<Link href="/products/2">
  Product 2
</Link>

<Link href="/products/3">
  Product 3
</Link>

...

<Link href="/products/10000">
  Product 10000
</Link>
```

It would be ridiculous to fully render every possible product page just because the links exist.

That's one reason dynamic routes have different prefetch behavior.

---

# 12. Enter `loading.tsx`

Here's where things become powerful.

Suppose:

```text
app/
└── products/
    └── [id]/
        ├── page.tsx
        └── loading.tsx
```

Create:

```tsx
// app/products/[id]/loading.tsx

export default function Loading() {
  return (
    <div>
      Loading product...
    </div>
  );
}
```

Now when the user navigates:

```text
/products/123
```

Next.js can immediately show:

```text
Loading product...
```

while the server is working.

---

# 13. Why `loading.tsx` Is So Important

Imagine your product page performs:

```text
Database query
     ↓
External API
     ↓
AI recommendation
     ↓
Product reviews
     ↓
Personalization
```

Maybe this takes:

```text
2 seconds
```

Without loading UI:

```text
Click
 ↓
.............
.............
.............
2 seconds
.............
Page appears
```

The user thinks:

> "Did I click the button?"

With `loading.tsx`:

```text
Click
 ↓
Loading skeleton
 ↓
.............
.............
Actual page
```

Much better UX.

The current Next.js docs recommend `loading.tsx` for dynamic routes because it enables immediate navigation feedback and allows partial prefetching. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 14. Streaming

Now we're getting into more advanced Next.js architecture.

Suppose your page contains:

```text
Product Page

Product Information     ← fast
Reviews                  ← slow
AI Recommendations       ← very slow
```

Without streaming:

```text
Wait for everything
       ↓
Render everything
       ↓
Send everything
```

With streaming:

```text
Product Information
       ↓
Send immediately

Reviews
       ↓
Send when ready

AI Recommendations
       ↓
Send when ready
```

Visually:

```text
0ms
┌──────────────────────────────┐
│ Product information          │
└──────────────────────────────┘

500ms
┌──────────────────────────────┐
│ Product information          │
│ Reviews loading...           │
└──────────────────────────────┘

1200ms
┌──────────────────────────────┐
│ Product information          │
│ Reviews                      │
│ AI recommendations loading...│
└──────────────────────────────┘

2000ms
┌──────────────────────────────┐
│ Product information          │
│ Reviews                      │
│ AI recommendations           │
└──────────────────────────────┘
```

This is **streaming**.

Next.js uses React's Suspense mechanism underneath for this experience. `loading.tsx` automatically provides a Suspense boundary around the page content. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 15. `loading.tsx` Is Basically a Suspense Boundary

When you write:

```text
app/dashboard/loading.tsx
```

Next.js effectively gives the route a loading boundary.

Conceptually:

```tsx
<Suspense fallback={<Loading />}>
  <DashboardPage />
</Suspense>
```

You don't have to manually write that basic boundary.

This is one of the reasons file-system conventions in Next.js are so powerful.

---

# 16. Nested Suspense

You can also create more granular loading states.

Imagine:

```text
Dashboard
│
├── User information
├── Revenue
├── Orders
└── AI insights
```

Maybe:

```text
User information → 50ms
Revenue → 100ms
Orders → 500ms
AI insights → 3000ms
```

You don't want the entire dashboard blocked by AI insights.

You could use:

```tsx
<Suspense fallback={<InsightsSkeleton />}>
  <AIInsights />
</Suspense>
```

Then:

```text
Dashboard
├── User information       ✓
├── Revenue                ✓
├── Orders                 ✓
└── AI insights            ⏳
```

This is especially valuable in AI SaaS applications.

---

# 17. The Full Navigation Pipeline

Now let's put everything together.

Suppose:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

The process can look roughly like this:

```text
                USER SEES LINK
                      │
                      ▼
                Link enters
                 viewport
                      │
                      ▼
                  PREFETCH
                      │
             ┌────────┴─────────┐
             │                  │
          Static             Dynamic
             │                  │
      Full prefetch       Partial/skip
             │                  │
             └────────┬─────────┘
                      │
                      ▼
                USER CLICKS
                      │
                      ▼
            CLIENT-SIDE TRANSITION
                      │
                      ▼
              Server rendering
                      │
                      ▼
                  STREAMING
                      │
                      ▼
              Browser receives
                RSC payload
                      │
                      ▼
              UI is updated
                      │
                      ▼
              SHARED LAYOUT
                 REMAINS
```

That's the mental model I want you to remember.

---

# 18. What Is the RSC Payload?

Because you're learning Next.js seriously, you should understand this term.

RSC = **React Server Components**.

When a Server Component renders, Next.js doesn't simply think:

> "Send this JavaScript component to the browser."

Instead, React generates a special representation of the Server Component tree.

Conceptually:

```text
Server Components
       ↓
React Server Component Payload
       ↓
Browser
       ↓
React updates UI
```

This is part of why Server Components can execute server-side while the browser still receives enough information to update the UI.

---

# 19. What Happens to Shared Layouts?

This is another important feature.

Suppose:

```text
app/
└── dashboard/
    ├── layout.tsx
    ├── page.tsx
    ├── settings/
    │   └── page.tsx
    └── projects/
        └── page.tsx
```

The layout:

```tsx
// dashboard/layout.tsx

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <Header />
      {children}
    </>
  );
}
```

Navigate:

```text
/dashboard
```

→

```text
/dashboard/settings
```

Next.js can preserve:

```text
Sidebar
Header
```

and replace:

```text
Dashboard page
```

with:

```text
Settings page
```

Conceptually:

```text
BEFORE

DashboardLayout
├── Sidebar
├── Header
└── Dashboard


AFTER

DashboardLayout
├── Sidebar       ← preserved
├── Header        ← preserved
└── Settings      ← changed
```

This is extremely useful for dashboards.

---

# 20. Dynamic Routes + `generateStaticParams`

Now consider:

```text
/blog/[slug]
```

Suppose your blog has:

```text
/blog/nextjs
/blog/react
/blog/typescript
```

You can tell Next.js which dynamic routes can be generated ahead of time using:

```tsx
export async function generateStaticParams() {
  return [
    { slug: "nextjs" },
    { slug: "react" },
    { slug: "typescript" },
  ];
}
```

Example:

```tsx
// app/blog/[slug]/page.tsx

export async function generateStaticParams() {
  const posts = await getPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
    </article>
  );
}
```

Now Next.js can know about these routes ahead of time.

The current navigation documentation specifically notes that dynamic segments without `generateStaticParams` may fall back to dynamic request-time rendering when they could otherwise be prerendered. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 21. `Link` and Dynamic Routes

You can construct dynamic links:

```tsx
<Link href={`/blog/${post.slug}`}>
  {post.title}
</Link>
```

For example:

```tsx
const posts = [
  {
    slug: "nextjs-navigation",
    title: "Next.js Navigation",
  },
  {
    slug: "server-components",
    title: "Server Components",
  },
];
```

Then:

```tsx
{posts.map((post) => (
  <Link
    key={post.slug}
    href={`/blog/${post.slug}`}
  >
    {post.title}
  </Link>
))}
```

Results:

```text
Next.js Navigation
        ↓
/blog/nextjs-navigation

Server Components
        ↓
/blog/server-components
```

This is a very common pattern.

---

# 22. Disabling Prefetching

Sometimes you don't want Next.js to prefetch.

You can do:

```tsx
<Link
  href="/expensive-report"
  prefetch={false}
>
  Expensive Report
</Link>
```

Conceptually:

```text
Normal:

Link visible
   ↓
Prefetch
   ↓
User clicks


prefetch={false}

Link visible
   ↓
Nothing
   ↓
User clicks
   ↓
Navigation begins
```

Why would you do this?

For example:

```text
10,000 product links
```

You probably don't want aggressive prefetching of everything.

---

# 23. Prefetch on Hover

The current docs show a technique for dynamically enabling prefetch when the user hovers over a link. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

Conceptually:

```text
Link visible
     ↓
Don't prefetch

User moves mouse over link
     ↓
Prefetch
```

Example:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export function HoverPrefetchLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
}
```

The interesting part is:

```tsx
prefetch={active ? null : false}
```

Initially:

```text
false
```

means don't prefetch.

After hover:

```text
null
```

returns to the default behavior.

This can be useful when you have lots of links or expensive dynamic routes.

---

# 24. `useRouter()`

Sometimes you don't have a link.

For example:

```text
Submit form
     ↓
Create project
     ↓
Navigate to /projects
```

You may want programmatic navigation.

That's where:

```tsx
useRouter()
```

comes in.

Import:

```tsx
import { useRouter } from "next/navigation";
```

Example:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function CreateProjectButton() {
  const router = useRouter();

  function createProject() {
    // Create project...

    router.push("/projects");
  }

  return (
    <button onClick={createProject}>
      Create Project
    </button>
  );
}
```

---

# 25. `<Link>` vs `router.push()`

Think:

### `<Link>`

Use when the user is navigating through a visible link.

```tsx
<Link href="/projects">
  Projects
</Link>
```

### `router.push()`

Use when navigation happens because of an application event.

```tsx
router.push("/projects");
```

For example:

```text
Login successful
       ↓
router.push("/dashboard")
```

or:

```text
Payment successful
       ↓
router.push("/billing/success")
```

or:

```text
Form submitted
       ↓
router.push(`/projects/${id}`)
```

A useful rule:

> **If it looks like a link, use `<Link>`. If navigation is a consequence of some logic/event, consider `router.push()`.**

---

# 26. `router.replace()`

Suppose you're here:

```text
/login
```

User logs in successfully.

You don't necessarily want:

```text
/dashboard
   ↓
Back
   ↓
/login
```

because going back to the login page isn't useful.

Use:

```tsx
router.replace("/dashboard");
```

Conceptually:

```text
push()

/login
   ↓
/dashboard

History:
login → dashboard
```

Back can return to login.

With:

```tsx
replace()
```

conceptually:

```text
/login

replace

/dashboard
```

The login history entry is replaced.

---

# 27. `router.back()`

You can go backward:

```tsx
router.back();
```

Equivalent conceptually to:

```js
window.history.back();
```

Useful for:

```text
Cancel
Back
Close modal
Return to previous page
```

---

# 28. `router.forward()`

Likewise:

```tsx
router.forward();
```

moves forward in browser history.

---

# 29. `router.refresh()`

This one is particularly interesting.

```tsx
router.refresh();
```

It asks Next.js to refresh the current route's server-rendered data/UI.

Import:

```tsx
import { useRouter } from "next/navigation";
```

Then:

```tsx
router.refresh();
```

Imagine:

```text
Dashboard
   ↓
User updates profile
   ↓
Server data changed
   ↓
router.refresh()
   ↓
Server Components render again
   ↓
Updated UI
```

Important:

`refresh()` is not the same thing as:

```js
window.location.reload()
```

A browser reload reloads the entire document.

`router.refresh()` works within Next.js's routing model.

---

# 30. `window.history.pushState()`

Next.js also integrates with the native browser History API.

For example:

```tsx
"use client";

export default function SortProducts() {
  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams();

    params.set("sort", sortOrder);

    window.history.pushState(
      null,
      "",
      `?${params.toString()}`
    );
  }

  return (
    <>
      <button onClick={() => updateSorting("asc")}>
        Ascending
      </button>

      <button onClick={() => updateSorting("desc")}>
        Descending
      </button>
    </>
  );
}
```

Click:

```text
Ascending
```

URL becomes:

```text
/products?sort=asc
```

Then:

```text
Descending
```

becomes:

```text
/products?sort=desc
```

The current Next.js documentation explicitly supports native `window.history.pushState()` and integrates it with the Next.js router, including `usePathname()` and `useSearchParams()`. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 31. `pushState()` vs `replaceState()`

This is a browser concept worth understanding.

### `pushState`

Adds a new history entry.

```text
/products
    ↓
pushState(?sort=asc)
    ↓
/products?sort=asc
```

History:

```text
/products
/products?sort=asc
```

Press Back:

```text
/products
```

---

### `replaceState`

Replaces the current history entry.

```text
/products
    ↓
replaceState(?sort=asc)
    ↓
/products?sort=asc
```

History doesn't get a new entry.

Press Back:

```text
Does NOT return to /products?sort=old
```

This is useful for things such as locale changes.

The current docs give locale switching as an example of `replaceState()`. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 32. Search Parameters

Suppose:

```text
/products?sort=price
```

You can read:

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function Products() {
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort");

  return (
    <div>
      Sorting by: {sort}
    </div>
  );
}
```

URL:

```text
/products?sort=price
```

Then:

```tsx
searchParams.get("sort")
```

returns:

```text
"price"
```

---

# 33. `usePathname()`

You can get the current pathname:

```tsx
"use client";

import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav>
      Current route: {pathname}
    </nav>
  );
}
```

If you're at:

```text
/dashboard/settings
```

then:

```tsx
pathname
```

is:

```text
"/dashboard/settings"
```

This is extremely useful for active navigation.

---

# 34. Active Navigation Example

Imagine:

```text
Dashboard
Projects
Settings
```

You want:

```text
Dashboard   ← active
Projects
Settings
```

You could do:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <Link
        href="/dashboard"
        className={
          pathname === "/dashboard"
            ? "active"
            : ""
        }
      >
        Dashboard
      </Link>

      <Link
        href="/dashboard/projects"
        className={
          pathname.startsWith("/dashboard/projects")
            ? "active"
            : ""
        }
      >
        Projects
      </Link>

      <Link
        href="/dashboard/settings"
        className={
          pathname.startsWith("/dashboard/settings")
            ? "active"
            : ""
        }
      >
        Settings
      </Link>
    </nav>
  );
}
```

Now your navigation knows where the user currently is.

---

# 35. Scroll Behavior

Next.js handles scrolling during client-side navigation.

Normally:

```text
Page A
   ↓
User scrolls to 3000px
   ↓
Click Page B
   ↓
Page B
   ↓
Scroll position goes to top
```

This is generally what you expect.

But suppose you have:

```text
Sticky header
height: 80px
```

The page may scroll to:

```text
element top = 0
```

and your header can cover the content.

CSS can help:

```css
html {
  scroll-padding-top: 80px;
}
```

The current docs specifically mention `scroll-padding-top` for situations involving sticky/fixed headers. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 36. Why Navigation Can Still Feel Slow

Next.js does a lot for you.

But it isn't magic.

There are several common problems.

## Problem 1 — Dynamic route without `loading.tsx`

```text
User clicks
   ↓
Server starts rendering
   ↓
Nothing visible
   ↓
User waits
```

Solution:

```text
loading.tsx
```

---

# 37. Problem 2 — Huge Client Bundle

Suppose your application loads:

```text
5 MB JavaScript
```

before hydration completes.

Then `<Link>` can't fully do its client-side work until the relevant client-side code has hydrated.

The current docs explicitly call out hydration delay and recommend reducing client JavaScript/bundle size where possible. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

This is another reason to avoid:

```tsx
"use client";
```

everywhere.

---

# 38. Server Component vs Client Component

Consider:

```tsx
// app/dashboard/page.tsx

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      {data.total}
    </div>
  );
}
```

This can remain a Server Component.

But if you need:

```tsx
useState()
```

or:

```tsx
onClick
```

then you need a Client Component.

For example:

```tsx
"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}
```

The architectural goal is:

```text
Server
├── Data fetching
├── Database
├── Authentication
└── Rendering

Browser
├── State
├── Events
├── Browser APIs
└── Interactivity
```

Keep the boundary as small as practical.

---

# 39. Production Example: AI SaaS

Let's design something closer to the applications you want to build.

Imagine:

```text
AI SaaS
│
├── /
├── pricing
├── login
│
└── dashboard
    ├── overview
    ├── projects
    │   ├── [id]
    │   └── new
    ├── usage
    └── settings
```

Navigation:

```text
Dashboard
│
├── Overview
├── Projects
├── Usage
└── Settings
```

Use:

```tsx
<Link href="/dashboard/projects">
  Projects
</Link>
```

For a project:

```tsx
<Link href={`/dashboard/projects/${project.id}`}>
  {project.name}
</Link>
```

For creating:

```text
Create Project
      ↓
Server Action
      ↓
Create database record
      ↓
router.push(`/dashboard/projects/${project.id}`)
```

For a long AI operation:

```text
Project page
│
├── Project details
├── Conversation
└── AI analysis
       │
       └── Suspense
```

This allows the fast content to appear while the AI-generated content is still being produced.

That's where Next.js navigation starts becoming much more than simple routing.

---

# 40. A Complete Mini Application

Let's build a small but realistic example.

## Structure

```text
app/
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   │
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   │
│   └── settings/
│       └── page.tsx
│
└── ui/
    └── DashboardNav.tsx
```

---

## Root Page

```tsx
// app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>My AI SaaS</h1>

      <Link href="/dashboard">
        Open Dashboard
      </Link>
    </main>
  );
}
```

---

## Dashboard Layout

```tsx
// app/dashboard/layout.tsx

import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>
        <nav>
          <Link href="/dashboard">
            Overview
          </Link>

          <Link href="/dashboard/projects">
            Projects
          </Link>

          <Link href="/dashboard/settings">
            Settings
          </Link>
        </nav>
      </aside>

      <main>
        {children}
      </main>
    </div>
  );
}
```

---

## Dashboard Page

```tsx
// app/dashboard/page.tsx

export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard</h1>

      <p>
        Welcome to your AI workspace.
      </p>
    </section>
  );
}
```

---

## Loading UI

```tsx
// app/dashboard/loading.tsx

export default function Loading() {
  return (
    <div>
      Loading dashboard...
    </div>
  );
}
```

---

## Projects

```tsx
// app/dashboard/projects/page.tsx

import Link from "next/link";

const projects = [
  {
    id: "1",
    name: "AI Content Generator",
  },
  {
    id: "2",
    name: "SEO Analyzer",
  },
];

export default function ProjectsPage() {
  return (
    <section>
      <h1>Projects</h1>

      {projects.map((project) => (
        <div key={project.id}>
          <Link
            href={`/dashboard/projects/${project.id}`}
          >
            {project.name}
          </Link>
        </div>
      ))}
    </section>
  );
}
```

---

## Dynamic Project Page

```tsx
// app/dashboard/projects/[id]/page.tsx

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <section>
      <h1>Project {id}</h1>

      <p>
        AI project details go here.
      </p>
    </section>
  );
}
```

---

# 41. The Resulting Navigation

Start:

```text
/
```

Click:

```text
Open Dashboard
```

↓

```text
/dashboard
```

Click:

```text
Projects
```

↓

```text
/dashboard/projects
```

Click:

```text
AI Content Generator
```

↓

```text
/dashboard/projects/1
```

The dashboard layout remains shared throughout:

```text
Dashboard Layout
│
├── Sidebar
├── Navigation
└── Current Page
```

Only the relevant page content changes.

---

# 42. Important Distinction: Navigation vs Rendering

You should separate these concepts in your head.

### Navigation

```text
How do we move from /a → /b?
```

### Rendering

```text
Where/how is /b generated?
```

### Prefetching

```text
Can we prepare /b before the user clicks?
```

### Streaming

```text
Can we send /b progressively?
```

### Client-side transition

```text
Can we update the current UI without a full document reload?
```

These are related, but they're not the same thing.

---

# 43. The Mental Model You Should Memorize

When you see:

```tsx
<Link href="/dashboard">
  Dashboard
</Link>
```

think:

```text
                 <Link>
                    │
                    ▼
            Is route prefetched?
               /          \
             YES           NO
              │             │
              │       Request route
              │             │
              └──────┬──────┘
                     ▼
             Server rendering
                     │
                     ▼
              RSC payload
                     │
                     ▼
                Streaming?
                  /     \
                YES      NO
                 │        │
                 ▼        ▼
             Partial    Complete
              result     result
                 │        │
                 └───┬────┘
                     ▼
            Client-side transition
                     │
                     ▼
             Preserve layouts
                     │
                     ▼
              Replace page
```

That's the real architecture.

---

# 44. Common Mistakes

## Mistake 1 — Using `<a>` everywhere

Instead of:

```tsx
<a href="/dashboard">
```

prefer:

```tsx
<Link href="/dashboard">
```

for internal Next.js routes.

---

## Mistake 2 — Thinking `<Link>` makes everything client-rendered

It doesn't.

You can have:

```text
Client-side navigation
+
Server Components
+
Server rendering
```

at the same time.

---

## Mistake 3 — Making every navigation component `"use client"`

Don't do this unnecessarily.

A simple:

```tsx
<Link href="/about">
  About
</Link>
```

doesn't mean your entire page needs to become a Client Component.

---

## Mistake 4 — Ignoring `loading.tsx`

For slow dynamic pages:

```text
No loading UI
      ↓
Bad perceived performance
```

Add:

```text
loading.tsx
```

when appropriate.

---

## Mistake 5 — Using `router.push()` for every link

Don't do:

```tsx
<button onClick={() => router.push("/about")}>
  About
</button>
```

when what you really have is a normal link.

Prefer:

```tsx
<Link href="/about">
  About
</Link>
```

You get semantics, accessibility, and Next.js navigation behavior.

---

## Mistake 6 — Huge Client Components

If you turn a huge tree into:

```tsx
"use client";
```

you can increase the amount of JavaScript the browser must download and hydrate.

That can indirectly make navigation feel slower. The current docs explicitly identify hydration and bundle size as factors that can delay prefetching. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

---

# 45. Production Architecture

For a serious SaaS, I'd think about navigation like this:

```text
                    Browser
                       │
                       ▼
                 Next.js Router
                       │
             ┌─────────┴──────────┐
             │                    │
         Prefetch              Navigation
             │                    │
             └─────────┬──────────┘
                       ▼
                Server Components
                       │
             ┌─────────┼─────────┐
             │         │         │
            Auth       DB       APIs
             │         │         │
             └─────────┼─────────┘
                       ▼
                    Render
                       │
                       ▼
                   Streaming
                       │
                       ▼
                    Browser
```

For an AI SaaS:

```text
Browser
   ↓
Next.js
   ↓
Authentication
   ↓
Authorization
   ↓
Business Logic
   ↓
AI orchestration
   ↓
LLM / Database / Tools
   ↓
Streaming
   ↓
Browser
```

This architecture is much more important than memorizing individual APIs.

---

# 46. What to Use When

| Situation | Best choice |
|---|---|
| Normal internal navigation | `<Link>` |
| External website | `<a>` |
| Navigate after an action | `router.push()` |
| Navigate and remove current history entry | `router.replace()` |
| Go back | `router.back()` |
| Go forward | `router.forward()` |
| Refresh Server Component data/UI | `router.refresh()` |
| Read current path | `usePathname()` |
| Read query parameters | `useSearchParams()` |
| Modify browser history directly | `pushState()` / `replaceState()` |
| Slow route | `loading.tsx` |
| Progressive content | `<Suspense>` / streaming |
| Reduce unnecessary prefetch | `prefetch={false}` |

---

# 47. The Most Important Concepts

If you remember only **10 things**, remember these:

### 1.

```tsx
<Link href="/dashboard">
```

is the primary navigation mechanism.

### 2.

`<Link>` provides more than an `<a>`.

It integrates with Next.js navigation and prefetching. [Next.js](https://nextjs.org/docs/app/getting-started/layouts-and-pages?utm_source=chatgpt.com)

### 3.

**Prefetching** means preparing a route before the user clicks.

### 4.

Static and dynamic routes can have different prefetch behavior.

### 5.

`loading.tsx` is extremely valuable for slow/dynamic routes.

### 6.

**Streaming** lets parts of the UI arrive as they become ready.

### 7.

Client-side navigation does **not** mean client-side rendering.

### 8.

Server Components can still participate in client-side navigation.

### 9.

Use:

```tsx
router.push()
```

when navigation is caused by application logic rather than simply clicking a link.

### 10.

Keep the Server/Client boundary small because unnecessary client JavaScript can hurt hydration and navigation performance.

---

# 48. The One Diagram to Keep in Your Head

This is the whole lesson:

```text
                       NEXT.JS NAVIGATION
                              │
             ┌────────────────┼────────────────┐
             │                │                │
             ▼                ▼                ▼
        <Link>          useRouter()       History API
             │                │                │
             ▼                ▼                ▼
        Prefetch           push()         pushState()
             │             replace()      replaceState()
             │                │                │
             └────────────────┼────────────────┘
                              ▼
                     Client-side transition
                              │
                              ▼
                     Server Components
                              │
                              ▼
                     Server Rendering
                              │
                  ┌───────────┴───────────┐
                  │                       │
                  ▼                       ▼
             loading.tsx              Streaming
                  │                       │
                  └───────────┬───────────┘
                              ▼
                       RSC Payload
                              │
                              ▼
                    Browser updates UI
                              │
                              ▼
                     Shared layouts stay
                          preserved
```

If you understand this diagram, you understand the core of **Next.js Linking and Navigating**.

The current Next.js documentation describes this navigation model around **server rendering, prefetching, streaming, and client-side transitions**, with `loading.tsx` and dynamic-route strategies used to improve perceived performance. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)


---------------------------------


The best way to learn this topic is to build one small **realistic Next.js SaaS navigation system** and use it to demonstrate every important navigation feature.

I’ll use the current App Router behavior from the official Next.js documentation. The current docs are for Next.js 16.3.5 and describe navigation around **server rendering, prefetching, streaming, client-side transitions, `loading.tsx`, `generateStaticParams`, `useLinkStatus`, and the native History API**. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

# Complete Example: SaaS Dashboard Navigation

We'll build:

```text
app/
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   │
│   ├── projects/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx
│   │       └── loading.tsx
│   │
│   └── settings/
│       └── page.tsx
│
├── products/
│   ├── page.tsx
│   └── ProductSort.tsx
│
└── ui/
    ├── DashboardNav.tsx
    ├── NavigationControls.tsx
    ├── LoadingIndicator.tsx
    └── HoverPrefetchLink.tsx
```

This example demonstrates:

- `<Link>`
- normal `<a>`
- client-side navigation
- prefetching
- disabling prefetch
- hover prefetch
- dynamic routes
- `loading.tsx`
- streaming
- `<Suspense>`
- `useRouter`
- `router.push`
- `router.replace`
- `router.back`
- `router.forward`
- `router.refresh`
- `usePathname`
- `useSearchParams`
- `useLinkStatus`
- `window.history.pushState`
- `window.history.replaceState`
- `generateStaticParams`
- shared layouts
- scroll behavior

---

# 1. Project Structure

```text
my-saas/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── dashboard/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   │
│   │   ├── projects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── loading.tsx
│   │   │
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── products/
│   │   ├── page.tsx
│   │   └── ProductSort.tsx
│   │
│   └── ui/
│       ├── DashboardNav.tsx
│       ├── NavigationControls.tsx
│       ├── LoadingIndicator.tsx
│       └── HoverPrefetchLink.tsx
│
└── ...
```

---

# 2. Root Layout

### `app/layout.tsx`

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Navigation Demo",
  description: "Next.js Linking and Navigating demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header>
          <strong>AI SaaS</strong>

          <nav>
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/products">Products</Link>

            {/* Normal browser navigation */}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
            >
              Next.js
            </a>
          </nav>
        </header>

        {children}
      </body>
    </html>
  );
}
```

### Why?

Internal navigation:

```tsx
<Link href="/dashboard">
```

should normally use `<Link>`.

External navigation:

```tsx
<a href="https://nextjs.org">
```

can use normal HTML `<a>`.

`<Link>` gives Next.js its navigation optimizations such as prefetching and client-side transitions. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 3. Home Page

### `app/page.tsx`

```tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Welcome to AI SaaS</h1>

      <p>
        This application demonstrates Next.js navigation.
      </p>

      <Link href="/dashboard">
        Open Dashboard
      </Link>
    </main>
  );
}
```

### What happens?

The user clicks:

```text
Open Dashboard
       ↓
/dashboard
```

Next.js can perform a client-side transition instead of doing a traditional full document reload. Shared layouts can remain in place. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 4. Dashboard Layout

This is where things become interesting.

### `app/dashboard/layout.tsx`

```tsx
import DashboardNav from "../ui/DashboardNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>
        <h2>Dashboard</h2>

        <DashboardNav />
      </aside>

      <main>{children}</main>
    </div>
  );
}
```

Notice:

```tsx
{children}
```

The layout stays around while different dashboard pages are rendered inside it.

For example:

```text
/dashboard
       ↓
/dashboard/projects
       ↓
/dashboard/projects/123
       ↓
/dashboard/settings
```

The dashboard layout is shared.

### Use case

This is ideal for:

- SaaS dashboards
- admin panels
- CMS
- e-commerce dashboards
- user account areas

You don't want the sidebar and header recreated as completely separate pages during navigation.

Next.js client-side transitions preserve shared layouts and UI. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 5. Dashboard Navigation

### `app/ui/DashboardNav.tsx`

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav>
      <Link
        href="/dashboard"
        className={
          isActive("/dashboard") &&
          pathname === "/dashboard"
            ? "active"
            : ""
        }
      >
        Overview
      </Link>

      <Link
        href="/dashboard/projects"
        className={
          isActive("/dashboard/projects")
            ? "active"
            : ""
        }
      >
        Projects
      </Link>

      <Link
        href="/dashboard/settings"
        className={
          isActive("/dashboard/settings")
            ? "active"
            : ""
        }
      >
        Settings
      </Link>
    </nav>
  );
}
```

---

# 6. Why `usePathname()`?

Suppose the user is here:

```text
/dashboard/projects
```

Then:

```tsx
const pathname = usePathname();
```

returns:

```text
/dashboard/projects
```

So you can determine:

```tsx
pathname === "/dashboard/projects"
```

and style that link as active.

### Use case

Common for:

```text
Sidebar
Navigation
Tabs
Breadcrumbs
Admin menus
```

---

# 7. Dashboard Page

### `app/dashboard/page.tsx`

```tsx
import Link from "next/link";

export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard Overview</h1>

      <p>
        Welcome to your AI workspace.
      </p>

      <Link href="/dashboard/projects">
        View Projects
      </Link>
    </section>
  );
}
```

---

# 8. Dashboard Loading UI

### `app/dashboard/loading.tsx`

```tsx
export default function Loading() {
  return (
    <div>
      <p>Loading dashboard...</p>
    </div>
  );
}
```

This file is special.

Next.js automatically uses it as the loading fallback for the route segment. Internally, Next.js wraps the page content in a Suspense boundary. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

Conceptually:

```tsx
<Suspense fallback={<Loading />}>
  <DashboardPage />
</Suspense>
```

You don't have to manually write that basic boundary.

---

# 9. Why `loading.tsx`?

Imagine:

```text
User clicks Projects
       ↓
Server needs 2 seconds
       ↓
Without loading.tsx

User sees nothing
       ↓
"Did the button work?"
```

With:

```text
User clicks Projects
       ↓
Loading UI
       ↓
Server finishes
       ↓
Projects
```

Much better perceived performance.

The official documentation specifically recommends `loading.tsx` for dynamic routes because it enables immediate feedback and partial prefetching. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 10. Projects Page

### `app/dashboard/projects/page.tsx`

```tsx
import Link from "next/link";

const projects = [
  {
    id: "1",
    name: "AI Content Generator",
  },
  {
    id: "2",
    name: "SEO Analyzer",
  },
  {
    id: "3",
    name: "WordPress AI Assistant",
  },
];

export default function ProjectsPage() {
  return (
    <section>
      <h1>Projects</h1>

      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/dashboard/projects/${project.id}`}>
              {project.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

Now:

```text
AI Content Generator
        ↓
/dashboard/projects/1

SEO Analyzer
        ↓
/dashboard/projects/2

WordPress AI Assistant
        ↓
/dashboard/projects/3
```

---

# 11. Dynamic Route

Our structure:

```text
projects/
└── [id]/
    └── page.tsx
```

means:

```text
/dashboard/projects/1
/dashboard/projects/2
/dashboard/projects/999
```

all use the same page component.

---

# 12. Dynamic Project Page

### `app/dashboard/projects/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";

const projects = [
  {
    id: "1",
    name: "AI Content Generator",
  },
  {
    id: "2",
    name: "SEO Analyzer",
  },
  {
    id: "3",
    name: "WordPress AI Assistant",
  },
];

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const project = projects.find(
    (project) => project.id === id
  );

  if (!project) {
    notFound();
  }

  // Simulate a slow server operation.
  await new Promise((resolve) =>
    setTimeout(resolve, 2000)
  );

  return (
    <section>
      <h1>{project.name}</h1>

      <p>Project ID: {project.id}</p>

      <p>
        This page was rendered on the server.
      </p>
    </section>
  );
}
```

There are two important concepts here.

---

# 13. `params`

For:

```text
/dashboard/projects/123
```

Next.js gives:

```tsx
params
```

containing:

```ts
{
  id: "123";
}
```

We retrieve it:

```tsx
const { id } = await params;
```

The current App Router docs show `params` as a Promise in this API shape. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 14. `generateStaticParams()`

We have:

```tsx
export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}
```

This tells Next.js:

```text
Known routes:

/dashboard/projects/1
/dashboard/projects/2
/dashboard/projects/3
```

These routes can be prerendered where the rendering configuration allows it.

### Use case

Suppose you have:

```text
/blog/[slug]
```

and 5,000 blog posts.

You could fetch the posts and return:

```ts
[
  { slug: "nextjs" },
  { slug: "react" },
  { slug: "typescript" },
]
```

The official docs note that a dynamic segment that could be prerendered but lacks `generateStaticParams` can fall back to request-time dynamic rendering. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 15. Dynamic Project Loading UI

### `app/dashboard/projects/[id]/loading.tsx`

```tsx
export default function Loading() {
  return (
    <div>
      <h2>Loading project...</h2>

      <div>
        Loading project information...
      </div>
    </div>
  );
}
```

Now our simulated:

```tsx
await new Promise((resolve) =>
  setTimeout(resolve, 2000)
);
```

gives us a chance to see the loading UI.

### Use case

Perfect for:

```text
Product details
Blog posts
AI-generated reports
Analytics dashboards
Database-heavy pages
External API requests
```

---

# 16. `router.push()`

Now let's say a button should navigate after some logic.

Create:

### `app/ui/NavigationControls.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function NavigationControls() {
  const router = useRouter();

  function goToProjects() {
    router.push("/dashboard/projects");
  }

  return (
    <div>
      <button onClick={goToProjects}>
        Go to Projects
      </button>
    </div>
  );
}
```

Add it somewhere:

### `app/dashboard/page.tsx`

```tsx
import NavigationControls from "../ui/NavigationControls";

export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard Overview</h1>

      <NavigationControls />
    </section>
  );
}
```

---

# 17. Why `router.push()`?

Use:

```tsx
router.push("/dashboard/projects");
```

when navigation is a consequence of an event.

For example:

```text
Submit form
   ↓
Create project
   ↓
Receive project ID
   ↓
Navigate
```

You could do:

```tsx
router.push(`/dashboard/projects/${projectId}`);
```

But don't use `router.push()` just to replace ordinary links.

Prefer:

```tsx
<Link href="/dashboard/projects">
```

when the user is simply clicking a link.

---

# 18. `router.replace()`

Add this to `NavigationControls.tsx`:

```tsx
function goToDashboard() {
  router.replace("/dashboard");
}
```

Complete component:

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function NavigationControls() {
  const router = useRouter();

  function goToProjects() {
    router.push("/dashboard/projects");
  }

  function goToDashboard() {
    router.replace("/dashboard");
  }

  return (
    <div>
      <button onClick={goToProjects}>
        Push: Projects
      </button>

      <button onClick={goToDashboard}>
        Replace: Dashboard
      </button>
    </div>
  );
}
```

### Difference

`push()`:

```text
/dashboard
     ↓
push
     ↓
/projects

Back → /dashboard
```

`replace()`:

```text
/login
     ↓
replace
     ↓
/dashboard

Back does not return to /login
```

### Use case for `replace()`

Excellent for:

```text
Login → Dashboard
Checkout → Success
Onboarding → Dashboard
Redirect after authentication
```

---

# 19. `router.back()`

Add:

```tsx
function goBack() {
  router.back();
}
```

Button:

```tsx
<button onClick={goBack}>
  Back
</button>
```

This uses browser history.

### Use case

Useful for:

```text
Cancel
Back button
Close detail view
Return to previous page
```

---

# 20. `router.forward()`

Add:

```tsx
function goForward() {
  router.forward();
}
```

Button:

```tsx
<button onClick={goForward}>
  Forward
</button>
```

### Use case

Useful when building custom browser-like navigation controls.

---

# 21. `router.refresh()`

Add:

```tsx
function refreshData() {
  router.refresh();
}
```

Button:

```tsx
<button onClick={refreshData}>
  Refresh Server Data
</button>
```

Suppose your Server Component does:

```tsx
const projects = await db.project.findMany();
```

and something changes the database.

Then:

```tsx
router.refresh();
```

can request the current route's updated Server Component output without doing a full browser reload.

### Important distinction

Don't confuse:

```tsx
router.refresh();
```

with:

```js
window.location.reload();
```

The latter performs a browser document reload.

### Use case

Useful after:

```text
Mutation
Database update
Server Action
Profile update
Settings change
```

when you need fresh Server Component output.

---

# 22. Complete Navigation Controls

So our final component becomes:

### `app/ui/NavigationControls.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function NavigationControls() {
  const router = useRouter();

  function goToProjects() {
    router.push("/dashboard/projects");
  }

  function replaceWithDashboard() {
    router.replace("/dashboard");
  }

  function goBack() {
    router.back();
  }

  function goForward() {
    router.forward();
  }

  function refreshData() {
    router.refresh();
  }

  return (
    <div>
      <button onClick={goToProjects}>
        Push → Projects
      </button>

      <button onClick={replaceWithDashboard}>
        Replace → Dashboard
      </button>

      <button onClick={goBack}>
        Back
      </button>

      <button onClick={goForward}>
        Forward
      </button>

      <button onClick={refreshData}>
        Refresh Server Data
      </button>
    </div>
  );
}
```

---

# 23. `useSearchParams()`

Now let's create a product page.

### `app/products/page.tsx`

```tsx
import ProductSort from "./ProductSort";

const products = [
  {
    id: 1,
    name: "AI Writer",
    price: 49,
  },
  {
    id: 2,
    name: "SEO Analyzer",
    price: 29,
  },
  {
    id: 3,
    name: "AI Assistant",
    price: 99,
  },
];

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    sort?: string;
  }>;
}) {
  const { sort } = await searchParams;

  const sortedProducts = [...products].sort(
    (a, b) => {
      if (sort === "asc") {
        return a.price - b.price;
      }

      if (sort === "desc") {
        return b.price - a.price;
      }

      return 0;
    }
  );

  return (
    <main>
      <h1>Products</h1>

      <ProductSort />

      <p>
        Current sort: {sort ?? "default"}
      </p>

      {sortedProducts.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>

          <p>${product.price}</p>
        </div>
      ))}
    </main>
  );
}
```

---

# 24. Native `pushState()`

Now:

### `app/products/ProductSort.tsx`

```tsx
"use client";

import { useSearchParams } from "next/navigation";

export default function ProductSort() {
  const searchParams = useSearchParams();

  function updateSorting(sortOrder: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sort", sortOrder);

    window.history.pushState(
      null,
      "",
      `?${params.toString()}`
    );
  }

  return (
    <div>
      <button
        onClick={() => updateSorting("asc")}
      >
        Price: Low → High
      </button>

      <button
        onClick={() => updateSorting("desc")}
      >
        Price: High → Low
      </button>
    </div>
  );
}
```

Now clicking:

```text
Price: Low → High
```

changes:

```text
/products
```

to:

```text
/products?sort=asc
```

without a full browser reload.

Next.js integrates native `pushState()` with its router so that navigation state can stay synchronized with hooks such as `useSearchParams()` and `usePathname()`. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 25. Why `pushState()`?

This is useful when changing URL state without necessarily treating it as a completely new navigation.

Typical examples:

```text
/products?sort=price
/products?filter=wordpress
/products?page=2
/products?view=grid
```

You want the URL to represent application state.

And importantly:

```text
pushState()
```

adds a history entry.

So:

```text
/products
      ↓
/products?sort=asc
      ↓
/products?sort=desc
```

The browser Back button can move through those states.

---

# 26. `replaceState()`

Sometimes you don't want every tiny state change in browser history.

For example:

```text
/products?search=a
/products?search=ai
/products?search=ai+
/products?search=ai+writer
```

You probably don't want four Back-button entries.

Use:

```tsx
window.history.replaceState(
  null,
  "",
  `?${params.toString()}`
);
```

Example:

```tsx
function updateSearch(search: string) {
  const params = new URLSearchParams(
    searchParams.toString()
  );

  params.set("search", search);

  window.history.replaceState(
    null,
    "",
    `?${params.toString()}`
  );
}
```

### Use case

Use `replaceState()` when the URL changes but you don't want to create another history entry.

---

# 27. `useLinkStatus()`

Next.js also provides:

```tsx
useLinkStatus()
```

This is especially useful on slow networks.

Create:

### `app/ui/LoadingIndicator.tsx`

```tsx
"use client";

import { useLinkStatus } from "next/link";

export default function LoadingIndicator() {
  const { pending } = useLinkStatus();

  return (
    <span
      aria-hidden
      className={
        pending
          ? "navigation-loading"
          : ""
      }
    />
  );
}
```

Then you could place it inside a link:

### `app/ui/ProjectLink.tsx`

```tsx
"use client";

import Link from "next/link";
import LoadingIndicator from "./LoadingIndicator";

export default function ProjectLink({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  return (
    <Link href={`/dashboard/projects/${id}`}>
      <LoadingIndicator />

      {name}
    </Link>
  );
}
```

The official docs recommend `useLinkStatus()` for immediate navigation feedback when prefetching hasn't completed, particularly on slow or unstable networks. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

### Use case

Imagine:

```text
User clicks
    ↓
Network is slow
    ↓
Server response takes 2 seconds
```

You can display:

```text
Loading...
```

immediately rather than leaving the user wondering whether their click worked.

---

# 28. Disable Prefetching

Suppose you have 10,000 products.

Don't necessarily do:

```tsx
{products.map(product => (
  <Link href={`/products/${product.id}`}>
    ...
  </Link>
))}
```

and blindly allow every link to prefetch.

You can disable it:

```tsx
<Link
  href={`/products/${product.id}`}
  prefetch={false}
>
  {product.name}
</Link>
```

### Use case

Good for:

```text
Huge lists
Infinite scrolling
Large tables
Thousands of links
Expensive dynamic pages
```

The trade-off is that navigation may become slower because Next.js won't prefetch the route. The official docs explicitly describe this trade-off. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 29. Hover Prefetch

Sometimes you don't want:

```text
Link appears
   ↓
Immediately prefetch
```

but you also don't want:

```text
Never prefetch
```

A useful middle ground is:

```text
Link appears
   ↓
No prefetch

User hovers
   ↓
Prefetch
```

Create:

### `app/ui/HoverPrefetchLink.tsx`

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";

export default function HoverPrefetchLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);

  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  );
}
```

Usage:

```tsx
<HoverPrefetchLink href="/dashboard/projects">
  Projects
</HoverPrefetchLink>
```

Before hover:

```text
prefetch = false
```

After hover:

```text
prefetch = null
```

which returns to Next.js's default behavior.

This pattern is documented by Next.js as a way to reduce resource usage while still prefetching likely destinations. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 30. Streaming with Nested `<Suspense>`

`loading.tsx` is great for route-level loading.

But imagine:

```text
Dashboard

Revenue
Orders
AI Insights
```

Suppose AI Insights takes 5 seconds.

You don't want:

```text
Dashboard
     ↓
Everything waits 5 seconds
```

Instead:

```text
Dashboard
Revenue       ✓
Orders        ✓
AI Insights   Loading...
```

Create:

### `app/dashboard/AIInsights.tsx`

```tsx
export default async function AIInsights() {
  await new Promise((resolve) =>
    setTimeout(resolve, 3000)
  );

  return (
    <section>
      <h2>AI Insights</h2>

      <p>
        Your traffic increased by 27%.
      </p>
    </section>
  );
}
```

Then:

### `app/dashboard/page.tsx`

```tsx
import { Suspense } from "react";
import AIInsights from "./AIInsights";

export default function DashboardPage() {
  return (
    <section>
      <h1>Dashboard</h1>

      <section>
        <h2>Revenue</h2>

        <p>$24,500</p>
      </section>

      <section>
        <h2>Orders</h2>

        <p>1,240 orders</p>
      </section>

      <Suspense
        fallback={
          <div>
            Loading AI insights...
          </div>
        }
      >
        <AIInsights />
      </Suspense>
    </section>
  );
}
```

Now:

```text
Dashboard
│
├── Revenue             ✓
│
├── Orders              ✓
│
└── AI Insights
        │
        ├── Loading...
        │
        └── eventually → AI result
```

### Why?

This is **streaming**.

The server doesn't need to wait for every component before sending content. Next.js can stream parts of the dynamic route as they become ready. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

This pattern is particularly valuable for AI applications.

---

# 31. A Real AI SaaS Flow

Imagine you're building an AI SEO SaaS.

User clicks:

```text
Analyze Article
```

You navigate:

```text
/dashboard/projects/123
```

The page contains:

```text
Project Information
       ↓
fast

SEO Score
       ↓
500ms

AI Recommendations
       ↓
5 seconds
```

Your architecture can be:

```text
/dashboard/projects/[id]/page.tsx

Project Information
       │
       ├── immediate
       │
       └── <Suspense>
               │
               └── AIRecommendations
                         │
                         └── slow
```

The user sees:

```text
Project: WordPress AI Assistant

SEO Score: 87

AI Recommendations:
Loading...
```

Then:

```text
AI Recommendations:
✓ Improve meta description
✓ Add internal links
✓ Improve heading structure
```

That is exactly the type of architecture where Next.js navigation and streaming become extremely powerful.

---

# 32. Why Shared Layouts Matter

Consider:

```text
/dashboard
```

You have:

```text
Sidebar
Header
Dashboard
```

Navigate:

```text
/dashboard/projects
```

Next.js can preserve:

```text
Sidebar
Header
```

and replace only:

```text
Dashboard
```

with:

```text
Projects
```

Then:

```text
/dashboard/projects/123
```

can replace the project list with project details.

So the UI behaves like:

```text
┌─────────────────────────────────────┐
│ Header                              │
├────────────┬────────────────────────┤
│            │                        │
│ Sidebar    │ Current Page           │
│            │                        │
│            │                        │
└────────────┴────────────────────────┘
```

The shell remains alive.

That's one of the major advantages of App Router layouts combined with client-side transitions. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 33. Scroll Behavior

Suppose you're here:

```text
/products
```

and you're scrolled to:

```text
2500px
```

You click:

```tsx
<Link href="/dashboard">
```

Next.js handles scrolling during client-side transitions.

Usually the new page moves to the top.

If you have a fixed header:

```css
header {
  position: fixed;
  top: 0;
  height: 80px;
}
```

you may need:

### `app/globals.css`

```css
html {
  scroll-padding-top: 80px;
}
```

### Why?

Without it:

```text
Page starts at:
0px

Fixed header:
0 → 80px

Content:
hidden behind header
```

With:

```css
scroll-padding-top: 80px;
```

the browser accounts for the fixed header.

Next.js documents this specifically for sticky/fixed headers. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

# 34. Complete Navigation Flow

Now let's connect everything.

Suppose the user clicks:

```tsx
<Link href="/dashboard/projects/123">
  SEO Analyzer
</Link>
```

What happens?

### Step 1 — Link becomes visible

Next.js can prefetch the route.

```text
<Link>
   ↓
Route enters viewport
   ↓
Prefetch
```

For static routes, the full route can be prefetched. For dynamic routes, Next.js may skip or partially prefetch depending on the route and loading UI. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

---

### Step 2 — User clicks

```text
Click
 ↓
Client-side transition
```

No traditional full-page reload.

---

### Step 3 — Loading UI

Because we have:

```text
[id]/
├── page.tsx
└── loading.tsx
```

Next.js has a loading fallback.

```text
Loading project...
```

---

### Step 4 — Server executes

```tsx
const { id } = await params;
```

Then:

```text
Database
External API
AI
etc.
```

can execute on the server.

---

### Step 5 — Streaming

If nested Suspense boundaries exist:

```text
Fast content
   ↓
sent first

Slow content
   ↓
sent later
```

---

### Step 6 — Browser updates

The new page appears while the shared layout remains.

```text
Dashboard Layout
│
├── Sidebar       ← preserved
├── Header        ← preserved
└── Project       ← replaced
```

This is the complete navigation architecture.

---

# 35. Important Server/Browser Boundary

Look carefully at our files.

### Server Components

These don't need:

```tsx
"use client";
```

For example:

```text
app/dashboard/page.tsx
app/dashboard/projects/page.tsx
app/dashboard/projects/[id]/page.tsx
```

They can run on the server.

### Client Components

These use:

```tsx
"use client";
```

because they need browser interactivity:

```text
DashboardNav.tsx
NavigationControls.tsx
ProductSort.tsx
LoadingIndicator.tsx
HoverPrefetchLink.tsx
```

Why?

Because they use things like:

```tsx
useState()
useRouter()
usePathname()
useSearchParams()
useLinkStatus()
onClick
window.history
```

Those require the browser/client environment.

---

# 36. Final File Structure

Your finished example looks like:

```text
app/
│
├── layout.tsx
├── page.tsx
│
├── dashboard/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── AIInsights.tsx
│   │
│   └── projects/
│       ├── page.tsx
│       │
│       └── [id]/
│           ├── page.tsx
│           └── loading.tsx
│
├── products/
│   ├── page.tsx
│   └── ProductSort.tsx
│
└── ui/
    ├── DashboardNav.tsx
    ├── NavigationControls.tsx
    ├── LoadingIndicator.tsx
    ├── ProjectLink.tsx
    └── HoverPrefetchLink.tsx
```

---

# 37. Quick Use-Case Cheat Sheet

| Feature | Code | Why use it |
|---|---|---|
| Normal internal navigation | `<Link href="/dashboard">` | Primary Next.js navigation |
| External navigation | `<a href="https://...">` | External website |
| Programmatic navigation | `router.push()` | Navigate after application logic |
| Replace history | `router.replace()` | Login/redirect flows |
| Back | `router.back()` | Custom back button |
| Forward | `router.forward()` | Custom forward navigation |
| Refresh | `router.refresh()` | Get fresh Server Component output |
| Active route | `usePathname()` | Active sidebar/tab |
| Query state | `useSearchParams()` | Filters/sorting/search |
| Add history state | `pushState()` | URL state + Back button |
| Replace history state | `replaceState()` | URL state without history entry |
| Loading route | `loading.tsx` | Immediate route feedback |
| Nested loading | `<Suspense>` | Stream slow sections independently |
| Static dynamic routes | `generateStaticParams()` | Prerender known dynamic paths |
| Slow navigation indicator | `useLinkStatus()` | Immediate feedback during transition |
| Disable prefetch | `prefetch={false}` | Avoid unnecessary prefetching |
| Hover prefetch | `prefetch={active ? null : false}` | Prefetch only likely destinations |

---

# 38. What I Want You to Remember

Don't memorize 15 APIs separately.

Think in **four layers**:

```text
                  NAVIGATION
                      │
       ┌──────────────┼──────────────┐
       │              │              │
       ▼              ▼              ▼
     <Link>       useRouter()    History API
       │              │              │
       └──────────────┼──────────────┘
                      ▼
              Client-side transition
                      │
                      ▼
               Server rendering
                      │
             ┌────────┴────────┐
             ▼                 ▼
         Prefetch           Streaming
                               │
                               ▼
                         loading.tsx
                               │
                               ▼
                        Shared layouts
                         stay alive
```

And the most important production rule is:

> **Use `<Link>` for normal navigation, `useRouter()` when navigation is caused by application logic, and the History API when you're manipulating URL/history state directly.**

Next.js then combines those with **prefetching, Server Components, streaming, and shared layouts** to make a server-rendered application feel extremely responsive. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

One correction to keep in mind from the current docs: **`useLinkStatus()` is now an important part of handling slow navigation**, especially when prefetching hasn't completed; it wasn't enough to think only in terms of `loading.tsx`. [Next.js](https://nextjs.org/docs/app/getting-started/linking-and-navigating)

[Official Next.js — Linking and Navigating](https://nextjs.org/docs/app/getting-started/linking-and-navigating?utm_source=chatgpt.com)

Explore the example further

- Add authentication redirects
- Add a real Server Action flow