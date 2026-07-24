import React from 'react'
import { Link } from 'react-router-dom'
import useCategories from '../hooks/useCategories'

export default function Footer() {
  const year = new Date().getFullYear()
  const { categories } = useCategories()

  const categoryLinks = categories.map(c => [c.name, `/category/${encodeURIComponent(c.name)}`])

  return (
    <footer className="bg-canvas border-t border-hairline mt-auto">
      {/* footer: canvas bg, body-sm text, 64px padding */}
      <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">

        {/* Brand col */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <p className="text-[14px] font-medium leading-5 text-ink mb-3">sujanship</p>
          <p className="text-[14px] leading-5 text-body">
            Notes, guides, and experiments across web, mobile apps, tools, AI, etc. — by Sujan.
          </p>
        </div>

        {/* Navigate — caption-mono eyebrow */}
        <div>
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-4">Navigate</p>
          <ul className="space-y-2.5">
            {[['Home', '/'], ...categoryLinks, ['Ask AI', '/ask-ai']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-[14px] leading-5 text-body hover:text-ink transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Topics */}
        <div>
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-4">Topics</p>
          <ul className="space-y-2.5">
            {categoryLinks.map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-[14px] leading-5 text-body hover:text-ink transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-4">Company</p>
          <ul className="space-y-2.5">
            {[
              ['About Us', '/about'],
              ['Contact Us', '/contact'],
              ['Ask AI', '/ask-ai'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-[14px] leading-5 text-body hover:text-ink transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal */}
        <div>
          <p className="font-mono text-[12px] leading-4 text-mute uppercase tracking-[0.14em] mb-4">Legal</p>
          <ul className="space-y-2.5">
            {[
              ['Privacy Policy', '/privacy-policy'],
              ['Terms & Conditions', '/terms'],
              ['Disclaimer', '/disclaimer'],
            ].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-[14px] leading-5 text-body hover:text-ink transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-hairline px-6 py-5">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[12px] leading-4 text-mute">© {year} sujanship. All rights reserved.</p>
          <p className="font-mono text-[12px] leading-4 text-mute">Built with MERN Stack</p>
        </div>
      </div>
    </footer>
  )
}
