import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ArticleComponent from './ArticleComponent'
import useFetchPosts from '../hooks/useFetchPosts'

// Single page that works for ANY category. The category name comes from the
// URL (/category/:name) and is used both to fetch posts and as the heading,
// so new categories added in the admin panel work with no code changes.
export default function CategoryPage() {
  const { name } = useParams()
  const category = decodeURIComponent(name || '')
  const [page, setPage] = useState(1)
  const { data, total, totalPages, loading, error } = useFetchPosts(category, page)
  const [showColdStartNotice, setShowColdStartNotice] = useState(false)

  // reset to first page whenever the category changes
  useEffect(() => { setPage(1) }, [category])

  useEffect(() => {
    let timer
    if (loading) {
      timer = setTimeout(() => setShowColdStartNotice(true), 2500)
    } else {
      setShowColdStartNotice(false)
    }
    return () => clearTimeout(timer)
  }, [loading])

  return (
    <main className="flex-1 max-w-[880px] mx-auto w-full px-6">
      {/* Category header — left-aligned, mixed-case */}
      <header className="pt-20 pb-8 border-b border-hairline">
        <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-3">Category</p>
        <h1 className="text-[32px] font-semibold leading-[1.1] text-ink" style={{ letterSpacing: '-1.2px' }}>
          {category}
        </h1>
        {!loading && !error && total > 0 && (
          <p className="font-mono text-[12px] leading-4 text-mute mt-5">{total} articles</p>
        )}
      </header>

      <section className="py-8">
        {loading && (
          <div>
            {showColdStartNotice && (
              <div className="mb-6 p-3.5 rounded-[8px] bg-canvas-soft border border-hairline flex items-center gap-3 text-[13px] text-body animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
                <span>Connecting to backend... Render server is spinning up, please wait a moment.</span>
              </div>
            )}
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
          </div>
        )}
        {error && (
          <div className="py-16">
            <p className="text-[16px] font-medium text-ink mb-1">Failed to load articles</p>
            <p className="text-[14px] text-body">{error}</p>
          </div>
        )}
        {!loading && !error && (
          data?.length > 0
            ? <ArticleComponent data={data} category={category} />
            : <div className="py-16"><p className="text-[16px] font-medium text-ink">No articles yet.</p></div>
        )}

        {!loading && !error && totalPages > 1 && (
          <nav className="flex items-center justify-between mt-8 pt-6 border-t border-hairline">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-4 py-2 text-[14px] font-medium rounded-[6px] border border-hairline text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:border-hairline-strong transition-colors"
            >
              Previous
            </button>
            <span className="font-mono text-[12px] text-mute">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-4 py-2 text-[14px] font-medium rounded-[6px] border border-hairline text-ink disabled:opacity-40 disabled:cursor-not-allowed hover:border-hairline-strong transition-colors"
            >
              Next
            </button>
          </nav>
        )}
      </section>
    </main>
  )
}
