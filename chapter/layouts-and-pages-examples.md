# Layouts and Pages: Runnable Examples

Run the app with `npm run dev`, then open [http://localhost:3000](http://localhost:3000). The home page links to each example.

## Route map

| URL | Example file | Topic |
|---|---|---|
| `/` | `app/page.js` | Page entry point, route index, dynamic links |
| `/about` | `app/(marketing)/about/page.js` | Static route and route group |
| `/pricing` | `app/(marketing)/pricing/page.js` | Route group does not add a URL segment |
| `/blog` | `app/blog/page.js` | Nested route, list of dynamic links |
| `/blog/nextjs-layouts` | `app/blog/[slug]/page.js` | Dynamic segment, async `params`, not-found handling |
| `/dashboard` | `app/dashboard/page.js` | Nested route under a shared dashboard layout |
| `/dashboard/projects` | `app/dashboard/projects/page.js` | Nested layout tree |
| `/dashboard/projects/route-lab` | `app/dashboard/projects/[projectId]/page.js` | Nested dynamic route and async `params` |
| `/dashboard/billing` | `app/dashboard/billing/page.js` | Shared layout reused by sibling routes |
| `/dashboard/settings` | `app/dashboard/settings/page.js` | Shared layout reused by sibling routes |
| `/products?category=keyboards` | `app/products/page.js` | Async `searchParams`, server-side filtering |
| `/courses/nextjs` | `app/courses/[course]/page.js` | One dynamic page serving many values |

The blog also demonstrates nested layouts at `app/blog/layout.js`; the dashboard example nests `app/dashboard/layout.js` around `app/dashboard/projects/layout.js`.

## What to try

1. From `/`, open **Field notes**, then open either article. The URL changes from `/blog` to `/blog/<slug>`, but the blog navigation remains around the page because `blog/layout.js` wraps both routes.
2. Open `/dashboard/projects/route-lab`. The root layout, dashboard layout, and projects layout wrap the dynamic project page in that order. Change the final segment to `garden-notes` to see the same page read another `projectId`.
3. Select a category on `/products`. The URL query changes, the page awaits `searchParams`, and the server filters the local product data. The small `ProductSearch` Client Component independently reads the query with `useSearchParams`.
4. Click **Like this example**. Only `app/ui/LikeButton.js` needs client state. Click **Open dashboard with useRouter** to see programmatic navigation from a Client Component.
5. Open `/about` and `/pricing`. Their source files live under `(marketing)`, but the parenthesized route group is absent from both URLs.
6. Open `/courses/react` and `/courses/nextjs`. Both resolve through `app/courses/[course]/page.js`.

## File-system routing and page files

Folders correspond to URL segments. A `page.js` supplies the UI for a public route; ordinary files such as `posts.js`, `products.js`, and `ProductSearch.js` can be colocated without creating routes. Page components are default exports. The root `app/layout.js` is required and supplies the document's `<html>` and `<body>`; it also shows the app-wide header and footer.

## Layout nesting

Layouts receive `children`, which is the next page or nested layout. The examples compose like this:

```text
app/layout.js
├── app/blog/layout.js
│   └── blog page or blog/[slug] page
└── app/dashboard/layout.js
    ├── dashboard page
    ├── billing or settings page
    └── app/dashboard/projects/layout.js
        └── projects page or projects/[projectId] page
```

The shared shell is implemented with Next.js `<Link>` components. Layouts are preserved during client-side navigation, so shared UI can remain interactive as child routes change.

## Dynamic route props

In this JavaScript project, dynamic pages await `params` directly:

```js
export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  // Find and render the matching post.
}
```

The installed Next.js version also generates global TypeScript helpers. In a TypeScript project, the equivalent page can use:

```tsx
export default async function BlogPostPage(
  props: PageProps<'/blog/[slug]'>
) {
  const { slug } = await props.params
  return <h1>{slug}</h1>
}
```

And a layout can use:

```tsx
export default function DashboardLayout(
  props: LayoutProps<'/dashboard'>
) {
  return <section>{props.children}</section>
}
```

`PageProps` and `LayoutProps` are generated types, not runtime functions. They are available in TypeScript projects after running `next dev`, `next build`, or `next typegen`.

## Search parameters

`app/products/page.js` awaits `searchParams`, validates the requested category against an allowlist, and filters data on the server. The value is request-specific, so using the page prop opts the route into dynamic rendering. `ProductSearch.js` shows the other case: a Client Component reads the current query with `useSearchParams`. It is under `<Suspense>` in the page.

Use page `searchParams` when the query determines server-side data. Use `useSearchParams` when a client component needs to read query state in the browser. Path values like `/blog/nextjs-layouts` belong to `params`; values after `?`, like `/products?category=audio`, belong to `searchParams`.

## Server and Client Components

Pages and layouts here are Server Components by default. Blog/course/project data is read in server code, and no API route is needed just to have a page fetch its own data. `LikeButton`, `GoToDashboardButton`, and `ProductSearch` are Client Components because they use state, event handlers, router navigation, or a browser navigation hook. Keep the client boundary around the smallest interactive component that needs it.

## Deliberate simplifications

The blog posts, products, and projects are small in-memory examples so the routes work without credentials or a database. Replace those arrays/objects with your data source when adapting the patterns. The page examples intentionally use `.js` to match this repository; TypeScript helper examples above are illustrative and belong in a TypeScript app.
