const URL_PATTERN = /https?:\/\/[^\s]+/gi
const TRAILING_PUNCTUATION_PATTERN = /[.,!?;:)\]}]+$/u

export function parseTextWithUrls(text = '') {
  const content = String(text)
  const segments = []
  let cursor = 0

  for (const match of content.matchAll(URL_PATTERN)) {
    const matchIndex = match.index ?? 0
    const rawUrl = match[0]
    const url = rawUrl.replace(TRAILING_PUNCTUATION_PATTERN, '')
    const trailingText = rawUrl.slice(url.length)

    if (matchIndex > cursor) {
      segments.push({ type: 'text', value: content.slice(cursor, matchIndex) })
    }
    if (url) segments.push({ type: 'url', value: url })
    if (trailingText) segments.push({ type: 'text', value: trailingText })

    cursor = matchIndex + rawUrl.length
  }

  if (cursor < content.length) {
    segments.push({ type: 'text', value: content.slice(cursor) })
  }

  return segments
}
