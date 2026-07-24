import React from 'react'

// Reusable typographic primitives for the static pages so About, Privacy,
// Terms and Disclaimer all render with identical rhythm and spacing.

export function Section({ title, children }) {
  return (
    <section className="mb-10 last:mb-0">
      {title && (
        <h2 className="text-[20px] font-semibold leading-7 text-ink mb-3" style={{ letterSpacing: '-0.4px' }}>
          {title}
        </h2>
      )}
      <div className="space-y-4 text-[15px] leading-7 text-body">{children}</div>
    </section>
  )
}

export function BulletList({ items }) {
  return (
    <ul className="space-y-2 list-disc pl-5 marker:text-hairline-strong">
      {items.map((item, i) => (
        <li key={i} className="text-[15px] leading-7 text-body">{item}</li>
      ))}
    </ul>
  )
}

// Small caption used to show the "last updated" date on legal pages.
export function UpdatedStamp({ date }) {
  return (
    <p className="font-mono text-[12px] leading-4 text-mute mb-8">Last updated: {date}</p>
  )
}
