import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { RiMenuFill, RiCloseLine } from 'react-icons/ri'
import useCategories from '../hooks/useCategories'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { categories } = useCategories()

  // Home is always first; category links are built from the backend so they
  // stay in sync with whatever is added/removed in the admin panel.
  const navLinks = [
    { label: 'Home', to: '/' },
    ...categories.map(c => ({ label: c.name, to: `/category/${encodeURIComponent(c.name)}` })),
  ]

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])
  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      {/* nav-bar: canvas bg, hairline border, 64px height */}
      <nav className="sticky top-0 z-50 bg-canvas border-b border-hairline">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 whitespace-nowrap group">
            <span className="w-5 h-5 rounded-[5px] bg-ink text-on-primary font-mono text-[12px] flex items-center justify-center leading-none">S</span>
            <span className="text-[15px] font-semibold leading-5 tracking-[-0.4px] text-ink">sujanship</span>
          </Link>

          {/* Nav links — stable weight, underline indicator on active */}
          <ul className="hidden md:flex items-center gap-6 flex-1 ml-2">
            {navLinks.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`relative py-1 text-[14px] leading-5 tracking-[-0.28px] transition-colors ${
                    pathname === to ? 'text-ink' : 'text-body hover:text-ink'
                  }`}
                >
                  {label}
                  {pathname === to && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-ink" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* nav-cta-ask-ai: 28px h, 6px radius, hairline border */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/ask-ai"
              className="h-7 px-2 inline-flex items-center text-[14px] font-medium leading-5 tracking-[-0.28px] text-ink bg-canvas border border-hairline rounded-[6px] hover:border-hairline-strong transition-colors whitespace-nowrap"
            >
              Ask AI
            </Link>
          </div>

          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="md:hidden p-1.5 text-body hover:text-ink transition-colors"
          >
            <RiMenuFill size={18} />
          </button>
        </div>
      </nav>

      {open && <div className="md:hidden fixed inset-0 z-[60] bg-ink/10" onClick={() => setOpen(false)} />}

      <div className={`md:hidden fixed top-0 right-0 bottom-0 z-[70] w-64 bg-canvas border-l border-hairline transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 h-16 border-b border-hairline">
          <span className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-[5px] bg-ink text-on-primary font-mono text-[12px] flex items-center justify-center leading-none">S</span>
            <span className="text-[15px] font-semibold tracking-[-0.4px] text-ink">sujanship</span>
          </span>
          <button onClick={() => setOpen(false)} className="p-1.5 text-body hover:text-ink"><RiCloseLine size={18} /></button>
        </div>
        <ul className="p-3 space-y-0.5">
          {[...navLinks, { label: 'Ask AI', to: '/ask-ai' }].map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className={`block px-3 py-2 rounded-[6px] text-[14px] leading-5 ${
                  pathname === to ? 'text-ink font-medium bg-canvas-soft-2' : 'text-body hover:text-ink hover:bg-canvas-soft'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
