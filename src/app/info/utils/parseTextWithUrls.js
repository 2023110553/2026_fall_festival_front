const URL_PATTERN = /(https?:\/\/[^\s]+)/gi
const URL_START_PATTERN = /^https?:\/\//i

export function parseTextWithUrls(text = '') {
  return String(text)
    .split(URL_PATTERN)
    .filter(Boolean)
    .map((value) => ({
      type: URL_START_PATTERN.test(value) ? 'url' : 'text',
      value,
    }))
}
