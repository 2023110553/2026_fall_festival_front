const URL_PATTERN = /https?:\/\/[^\s]+/gi
const TRAILING_PUNCTUATION_PATTERN = /[.,!?;:…。，、"'”’>]+$/u
const KOREAN_PARTICLE_PATTERN = /(에서|으로|에게|까지|부터|처럼|보다|하고|이며|이면|에는|에도|으로는|으로도|로는|로도|을|를|은|는|이|가|와|과|도|만|에|로)$/u
const CLOSING_DELIMITERS = {
  ')': '(',
  ']': '[',
  '}': '{',
}

function stripUnmatchedClosingDelimiters(value) {
  let url = value
  let trailingText = ''

  while (url) {
    const closing = url.at(-1)
    const opening = CLOSING_DELIMITERS[closing]
    if (!opening) break

    const openingCount = [...url].filter((character) => character === opening).length
    const closingCount = [...url].filter((character) => character === closing).length
    if (closingCount <= openingCount) break

    url = url.slice(0, -1)
    trailingText = closing + trailingText
  }

  return { url, trailingText }
}

function splitUrlAndTrailingText(rawUrl) {
  let url = rawUrl
  let trailingText = ''

  const punctuation = url.match(TRAILING_PUNCTUATION_PATTERN)?.[0] ?? ''
  if (punctuation) {
    url = url.slice(0, -punctuation.length)
    trailingText = punctuation
  }

  const delimiterResult = stripUnmatchedClosingDelimiters(url)
  url = delimiterResult.url
  trailingText = delimiterResult.trailingText + trailingText

  const particle = url.match(KOREAN_PARTICLE_PATTERN)?.[0] ?? ''
  if (particle) {
    url = url.slice(0, -particle.length)
    trailingText = particle + trailingText
  }

  return { url, trailingText }
}

export function parseTextWithUrls(text = '') {
  const content = text == null ? '' : String(text)
  const segments = []
  let cursor = 0

  for (const match of content.matchAll(URL_PATTERN)) {
    const matchIndex = match.index ?? 0
    const rawUrl = match[0]
    const { url, trailingText } = splitUrlAndTrailingText(rawUrl)

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
