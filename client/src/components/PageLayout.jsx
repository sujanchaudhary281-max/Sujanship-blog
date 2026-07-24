import React from 'react'
import usePageMeta from '../hooks/usePageMeta'

// Shared shell for all static/public pages (About, Contact, legal pages).
// Mirrors the editorial layout used by CategoryPage/AskAI: 880px column,
// mono eyebrow, left-aligned title with tight tracking, hairline divider.
export default function PageLayout({ eyebrow, title, intro, meta, children }) {
  usePageMeta(meta)

  return (
    <main className="flex-1 max-w-[880px] mx-auto w-full px-6">
      <header className="pt-20 pb-8 border-b border-hairline anim-fade-up">
        {eyebrow && (
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-3">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[32px] font-semibold leading-[1.1] text-ink" style={{ letterSpacing: '-1.2px' }}>
          {title}
        </h1>
        {intro && (
          <p className="mt-4 text-[17px] leading-7 text-body max-w-[38rem]">{intro}</p>
        )}
      </header>

      <div className="py-10 anim-fade-up anim-delay-1">{children}</div>
    </main>
  )
}
