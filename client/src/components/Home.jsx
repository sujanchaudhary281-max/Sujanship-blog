import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import useFetchPosts from '../hooks/useFetchPosts'
import useCategories from '../hooks/useCategories'
import useFeaturedPosts from '../hooks/useFeaturedPosts'

const strip = html => html?.replace(/<[^>]*>/g, '') ?? ''
const readingTime = html => Math.max(1, Math.ceil(strip(html).split(/\s+/).length / 200))
const fmtDate = d => new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

// Invisible loader: fetches one category's posts and reports them back to Home.
// One per category, so Home works for any number of categories without
// calling hooks in a loop.
function CategoryLoader({ category, onLoaded }) {
  const { data, loading, error } = useFetchPosts(category)
  React.useEffect(() => {
    if (!loading) onLoaded(category, data || [], error)
  }, [loading, data, error, category, onLoaded])
  return null
}

function PostRow({ post }) {
  return (
    <Link
      to={`/blog/${post._id}`}
      className="row-link group flex gap-5 items-start px-3 -mx-3 py-6 rounded-[8px]"
    >
      {post.image && (
        <div className="hidden sm:block w-28 h-20 shrink-0 rounded-[6px] overflow-hidden bg-canvas-soft-2 border border-hairline">
          <img src={post.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 text-mute">
          <span className="font-mono text-[12px] leading-4">{post.category}</span>
          <span className="text-hairline-strong">·</span>
          <span className="text-[12px] leading-4">{fmtDate(post.createdAt)}</span>
        </div>
        <h3 className="text-[18px] font-medium leading-6 text-ink group-hover:text-link transition-colors">
          {post.title}
        </h3>
        <p className="mt-1.5 text-[14px] leading-6 text-body line-clamp-2">
          {strip(post.content).slice(0, 160)}
        </p>
        <span className="mt-2 inline-block font-mono text-[12px] leading-4 text-mute">
          {readingTime(post.content)} min read
        </span>
      </div>
    </Link>
  )
}

export default function Home() {
  const { categories, loading: catsLoading } = useCategories()

  // posts collected per category name, plus which categories have finished loading
  const [postsByCat, setPostsByCat] = useState({})
  const [doneCats, setDoneCats] = useState({})
  const [errored, setErrored] = useState(false)

  const handleLoaded = useCallback((category, posts, error) => {
    if (error) setErrored(true)
    setPostsByCat(prev => ({ ...prev, [category]: posts }))
    setDoneCats(prev => ({ ...prev, [category]: true }))
  }, [])

  const { data: featuredPosts } = useFeaturedPosts()

  const loading = catsLoading || (categories.length > 0 && Object.keys(doneCats).length < categories.length)

  const all = Object.values(postsByCat)
    .flat()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  // Featured is driven by the admin "featured" flag (newest featured post).
  // The Latest list drops it so it isn't shown twice.
  const featured = featuredPosts[0]
  const rest = all.filter(p => p._id !== featured?._id)

  return (
    <main className="flex-1 max-w-[880px] mx-auto w-full px-6">

      {/* Hidden loaders — one per category */}
      {categories.map(c => (
        <CategoryLoader key={c._id || c.name} category={c.name} onLoaded={handleLoaded} />
      ))}

      {/* Masthead — left-aligned, no gradient, no CTAs */}
      <header className="pt-20 pb-10 border-b border-hairline">
        <h1 className="text-[34px] font-semibold leading-[1.1] text-ink" style={{ letterSpacing: '-1.4px' }}>
          Writing on Tech &amp; Beyond
        </h1>
        <p className="mt-3 text-[17px] leading-7 text-body max-w-[34rem]">
          Notes, guides, and experiments across web, mobile apps, tools, AI, etc. — by Sujan.
        </p>
      </header>

      {/* Featured lead */}
      {featured && (
        <section className="py-10 border-b border-hairline">
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-5">Featured</p>
          <Link to={`/blog/${featured._id}`} className="group grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-7 items-center">
            {featured.image && (
              <div className="aspect-[16/10] rounded-[10px] overflow-hidden bg-canvas-soft-2 border border-hairline">
                <img src={featured.image} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-2 text-mute">
                <span className="font-mono text-[12px] leading-4">{featured.category}</span>
                <span className="text-hairline-strong">·</span>
                <span className="text-[12px] leading-4">{fmtDate(featured.createdAt)}</span>
              </div>
              <h2 className="text-[26px] font-semibold leading-[1.15] text-ink group-hover:text-link transition-colors" style={{ letterSpacing: '-0.8px' }}>
                {featured.title}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-body line-clamp-3">
                {strip(featured.content).slice(0, 220)}
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-ink text-on-primary text-[11px] font-medium flex items-center justify-center">S</span>
                <span className="text-[13px] text-body">Sujan</span>
                <span className="text-hairline-strong">·</span>
                <span className="font-mono text-[12px] text-mute">{readingTime(featured.content)} min read</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Latest — editorial list */}
      <section className="py-10">
        {rest.length > 0 && (
          <>
            <div className="flex items-baseline justify-between mb-2">
              <h2 className="text-[15px] font-semibold text-ink">Latest</h2>
              <span className="font-mono text-[12px] text-mute">{all.length} articles</span>
            </div>
            <div className="divide-y divide-hairline">
              {rest.map(post => <PostRow key={post._id} post={post} />)}
            </div>
          </>
        )}

        {/* Loading skeleton — list rows */}
        {loading && all.length === 0 && (
          <div className="divide-y divide-hairline">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-5 py-6">
                <div className="skeleton hidden sm:block w-28 h-20 rounded-[6px] shrink-0" />
                <div className="flex-1 space-y-2.5">
                  <div className="skeleton h-3 w-24 rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state — no articles */}
        {!loading && !errored && all.length === 0 && (
          <div className="py-16"><p className="text-[16px] font-medium text-ink">No articles yet.</p></div>
        )}

        {/* Error state */}
        {!loading && errored && all.length === 0 && (
          <div className="py-16">
            <p className="text-[16px] font-medium text-ink mb-1">Failed to load articles</p>
            <p className="text-[14px] text-body">Please try again later.</p>
          </div>
        )}

        {all.length > 0 && categories.length > 0 && (
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-hairline">
            {categories.map(c => (
              <Link
                key={c._id || c.name}
                to={`/category/${encodeURIComponent(c.name)}`}
                className="text-[14px] font-medium text-body hover:text-ink transition-colors"
              >
                All {c.name} articles →
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
