// Utility helpers for blog app

/**
 * Cleanly extracts a description preview snippet from HTML post content.
 * - Removes h1-h6 headings to prevent titles/headings inside content from repeating in post cards.
 * - Converts block elements (p, div, li, etc.) and line breaks to spaces so words don't get glued together.
 * - Decodes common HTML entities.
 * - Truncates cleanly to requested max length with an ellipsis.
 */
export const getPostDescription = (html, maxLength = 160) => {
  if (!html) return ''

  // 1. Strip out heading tags (h1-h6) and their inner text so headings inside content aren't duplicated in description
  let cleaned = html.replace(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi, '')

  // 2. Convert block tag boundaries and breaks into single spaces to avoid glued words
  let text = cleaned
    .replace(/<\/(p|div|li|blockquote|section|article|h[1-6])>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, '')

  // 3. Decode common HTML entities
  text = text
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')

  // 4. Collapse multiple spaces into one space
  text = text.replace(/\s+/g, ' ').trim()

  // Fallback: If removing headings left nothing (e.g. content only had h1/h2), keep text from headings
  if (!text) {
    text = html
      .replace(/<\/(p|div|li|blockquote|section|article|h[1-6])>/gi, ' ')
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim()
  }

  if (maxLength && text.length > maxLength) {
    return text.slice(0, maxLength).trim() + '…'
  }

  return text
}

export const stripHtml = (html) => {
  if (!html) return ''
  return html.replace(/<[^>]*>/g, '')
}
