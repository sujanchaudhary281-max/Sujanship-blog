import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-python'
import 'prismjs/themes/prism-okaidia.css'
import DOMPurify from 'dompurify'
import api from '../lib/api'
import { FiArrowLeft } from 'react-icons/fi'

const readingTime = html => Math.max(1, Math.ceil((html?.replace(/<[^>]*>/g,'').split(/\s+/).length ?? 0) / 200))

export default function Blog() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError(null)
    api.get(`/post/${id}`, { signal: controller.signal })
      .then(r => { setItem(r.data); setLoading(false) })
      .catch(e => {
        if (e.name === 'CanceledError' || e.code === 'ERR_CANCELED') return
        setError(e.response?.data?.message || e.message)
        setLoading(false)
      })
    return () => controller.abort()
  }, [id])

  useEffect(() => { if (item) Prism.highlightAll() }, [item])

  const processContent = c => c.replace(/<pre class="ql-syntax"[^>]*>/g, m =>
    m.replace('<pre class="ql-syntax"', '<pre class="ql-syntax language-javascript"'))

  const [showColdStartNotice, setShowColdStartNotice] = useState(false)

  useEffect(() => {
    let timer
    if (loading) {
      timer = setTimeout(() => setShowColdStartNotice(true), 2500)
    } else {
      setShowColdStartNotice(false)
    }
    return () => clearTimeout(timer)
  }, [loading])

  // response is a single post object (was previously an array)
  const post = Array.isArray(item) ? item[0] : item

  return (
    <div className="flex-1 bg-canvas min-h-screen">
      {loading ? (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-7 h-7 border-2 border-hairline-strong border-t-ink rounded-full animate-spin" />
          {showColdStartNotice && (
            <div className="p-3 rounded-[8px] bg-canvas-soft border border-hairline flex items-center gap-2.5 text-[13px] text-body max-w-sm animate-fade-in">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping shrink-0" />
              <span>Connecting to backend... Render server is waking up.</span>
            </div>
          )}
        </div>
      ) : error ? (
        <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
          <p className="text-[18px] font-medium text-ink mb-2">Failed to load this post</p>
          <p className="text-[14px] text-body mb-8">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-[14px] text-body hover:text-ink transition-colors"
          >
            <FiArrowLeft size={14} /> Back
          </button>
        </div>
      ) : !post ? (
        <div className="max-w-[720px] mx-auto px-6 py-24 text-center">
          <p className="text-[18px] font-medium text-ink">Post not found</p>
        </div>
      ) : (
        <article className="max-w-[720px] mx-auto px-6 pt-12 pb-24 anim-fade-up">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-1.5 text-[14px] leading-5 text-body hover:text-ink transition-colors mb-10"
          >
            <FiArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            Back
          </button>

          {/* Eyebrow */}
          {post.category && (
            <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-4">
              {post.category}
            </p>
          )}

          {/* Title — left-aligned, calmer tracking */}
          <h1 className="text-[30px] md:text-[40px] font-semibold leading-[1.1] text-ink" style={{ letterSpacing: '-1.4px' }}>
            {post.title}
          </h1>

          {/* Byline */}
          <div className="flex items-center gap-2.5 mt-6 pb-8 mb-10 border-b border-hairline">
            <span className="w-8 h-8 rounded-full bg-ink text-on-primary text-[13px] font-medium flex items-center justify-center shrink-0">S</span>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium leading-5 text-ink">Sujan</p>
              <p className="text-[12px] leading-4 text-mute">
                {new Date(post.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}{readingTime(post.content)} min read
              </p>
            </div>
          </div>

          {/* Hero image */}
          {post.image && (
            <div className="rounded-[10px] overflow-hidden mb-12 border border-hairline">
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover" />
            </div>
          )}

          <div className="blog-content" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(processContent(post.content)) }} />
        </article>
      )}
    </div>
  )
}
