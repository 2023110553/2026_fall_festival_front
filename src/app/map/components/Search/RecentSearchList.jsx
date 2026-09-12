const STORAGE_KEY = 'fall-festival-recent-searches'

// 최근 검색어 — 로그인 여부와 무관하게 기기별로 남으면 되므로 localStorage로 처리 (백엔드 불필요, 팀 합의사항)
export function getRecentSearches() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? []
  } catch {
    return []
  }
}

export function addRecentSearch(term) {
  const next = [term, ...getRecentSearches().filter((t) => t !== term)].slice(0, 10)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function removeRecentSearch(term) {
  const next = getRecentSearches().filter((t) => t !== term)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

export function clearRecentSearches() {
  localStorage.removeItem(STORAGE_KEY)
  return []
}

export default function RecentSearchList({ onSelect }) {
  const recent = getRecentSearches()

  if (recent.length === 0) return null

  return (
    <ul>
      {recent.map((term) => (
        <li key={term} onClick={() => onSelect(term)}>
          {term}
        </li>
      ))}
    </ul>
  )
}
