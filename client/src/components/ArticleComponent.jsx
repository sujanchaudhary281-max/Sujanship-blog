import React from 'react'
import { Link } from 'react-router-dom'

const strip = html => html?.replace(/<[^>]*>/g, '') ?? ''
const readingTime = html => Math.max(1, Math.ceil(strip(html).split(/\s+/).length / 200))
const fmtDate = d => new Date(d || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const ArticleComponent = ({ data, category }) => (
  <div className="divide-y divide-hairline">
    {data.map(post => (
      <Link
        to={`/blog/${post._id}`}
        key={post._id}
        className="row-link group flex gap-5 items-start px-3 -mx-3 py-6 rounded-[8px]"
      >
        {post.image && (
          <div className="hidden sm:block w-28 h-20 shrink-0 rounded-[6px] overflow-hidden bg-canvas-soft-2 border border-hairline">
            <img src={post.image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 text-mute">
            <span className="font-mono text-[12px] leading-4">{category}</span>
            <span className="text-hairline-strong">·</span>
            <span className="text-[12px] leading-4">{fmtDate(post.createdAt)}</span>
          </div>
          <h2 className="text-[18px] font-medium leading-6 text-ink group-hover:text-link transition-colors">
            {post.title}
          </h2>
          <p className="mt-1.5 text-[14px] leading-6 text-body line-clamp-2">
            {strip(post.content).slice(0, 160)}
          </p>
          <span className="mt-2 inline-block font-mono text-[12px] leading-4 text-mute">
            {readingTime(post.content)} min read
          </span>
        </div>
      </Link>
    ))}
  </div>
)

export default React.memo(ArticleComponent)
