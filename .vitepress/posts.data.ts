// Client-only post loader for VitePress
export type Post = {
  title: string
  date: string           // ISO YYYY-MM-DD
  href: string
  draft?: boolean
}

function fmtHrefFromPath(path: string) {
  // '/absolute/.../posts/slug.md' -> '/posts/slug.html'
  const m = path.replace(/\\/g, '/').match(/\/posts\/(.+)\.md$/)
  return m ? `/posts/${m[1]}.html` : path
}

function toMonthKey(iso: string) {
  const d = new Date(iso)
  return isNaN(+d)
    ? 'Unknown'
    : d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) // e.g. "July 2025"
}

// Vite transforms this ONLY on the client (because of .client.ts)
const modules = import.meta.glob('/posts/**/*.md', { eager: true })

const all: Post[] = Object.entries(modules).map(([path, mod]: [string, any]) => {
  const fm = mod?.frontmatter ?? mod?.__pageData?.frontmatter ?? {}
  return {
    title: fm.title ?? path.split('/').pop()?.replace(/\.md$/, '') ?? 'Untitled',
    date: fm.date ?? '1970-01-01',
    draft: fm.draft ?? false,
    href: fm.permalink ?? mod?.url ?? fmtHrefFromPath(path)
  }
}).filter(p => !p.draft)
  .sort((a, b) => (a.date < b.date ? 1 : -1))

// Group by month
const map = new Map<string, Post[]>()
for (const p of all) {
  const key = toMonthKey(p.date)
  if (!map.has(key)) map.set(key, [])
  map.get(key)!.push(p)
}
export const groups: Array<{ label: string; items: Post[] }> =
  Array.from(map.entries()).map(([label, items]) => ({ label, items }))

