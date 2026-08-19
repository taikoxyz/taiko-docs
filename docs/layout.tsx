import type { ReactNode } from 'react'

// Injected by `vite.define` in vocs.config.ts so the resolved site URL is a
// compile-time constant in both the prerender and the browser bundle.
declare const __DOCS_SITE_URL__: string

/**
 * Route-dependent `<head>` tags.
 *
 * Vocs evaluates `config.head` once per page while prerendering and never
 * again, so anything derived from the route there freezes at whichever page
 * the visitor landed on and goes stale on client-side navigation. Tags
 * that depend on the current route therefore live here instead: Vocs mounts
 * this component inside the router (see `virtual:consumer-components`), so it
 * re-renders on every navigation, and React 19 hoists `<link>`/`<meta>` into
 * `<head>` when prerendering *and* in the browser. The prerendered HTML keeps
 * the same tags it had before -- React emits them now instead of the config
 * hook.
 *
 * Path-independent tags (og:site_name, og:locale, twitter:site, robots) stay
 * in `config.head`; re-rendering constants buys nothing.
 */
export default function Layout({ children, path }: { children: ReactNode; path: string }) {
  const url = canonicalUrl(path)
  return (
    <>
      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:url" content={url} />}
      {children}
    </>
  )
}

/**
 * `path` is the matched route, so it is already free of trailing slashes,
 * query strings, and hashes. Vocs registers a `.html` alias for every page --
 * point those at the extensionless URL that actually gets prerendered. The
 * catch-all 404 route (`*`) has no canonical URL, so it gets no tags.
 */
function canonicalUrl(path: string) {
  if (path === '*') return undefined
  return `${__DOCS_SITE_URL__}${path.replace(/\.html$/, '')}`
}
