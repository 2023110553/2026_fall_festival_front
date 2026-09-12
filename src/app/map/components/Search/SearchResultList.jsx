import EmptyState from '../../../../components/common/EmptyState'

// 검색 결과 리스트 — 결과 없음 상태 포함
export default function SearchResultList({ results }) {
  if (results.length === 0) {
    return <EmptyState>검색 결과가 없습니다.</EmptyState>
  }

  return (
    <ul>
      {results.map((booth) => (
        <li key={booth.id}>{booth.name}</li>
      ))}
    </ul>
  )
}
