import { useEffect } from 'react'

const SITE = 'sujanship'
const BASE_TITLE = 'sujanship — MERN Stack & Generative AI Articles'

// Lightweight SEO helper: sets the document title and updates/creates the
// meta description + Open Graph title so each public page is indexable on its
// own. Restores the site defaults on unmount so client-side navigation between
// pages never leaves a stale title behind.
export default function usePageMeta({ title, description } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE}` : BASE_TITLE
    document.title = fullTitle

    const setMeta = (selector, attr, name, content) => {
      if (!content) return
      let el = document.head.querySelector(selector)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('meta[name="description"]', 'name', 'description', description)
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMeta('meta[property="og:description"]', 'property', 'og:description', description)

    return () => {
      document.title = BASE_TITLE
      const desc = document.head.querySelector('meta[name="description"]')
      if (desc) desc.setAttribute('content', 'In-depth articles on MERN Stack, Generative AI, and modern web development.')
    }
  }, [title, description])
}
