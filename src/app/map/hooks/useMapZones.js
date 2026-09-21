import { useMapContext } from '../context/MapProvider'

// 카드와 3D 핀은 Provider에서 조회한 동일한 목록을 사용한다.
export function useMapZoneBooths() {
  const { booths, isLoading, isError } = useMapContext()
  return { booths, isLoading, isError }
}

// 위 목록을 검색어로 필터링 (부스명/학과명/카테고리 기준 — 실제 필드명은 백엔드 응답 확정되면 맞추기)
// booths가 배열이 아닌 값으로 잘못 들어와도(방어적으로) 항상 배열을 반환한다.
export function useBoothSearch(booths, searchTerm) {
  const list = Array.isArray(booths) ? booths : []
  if (!searchTerm) return list
  const keyword = searchTerm.trim().toLowerCase()
  return list.filter((booth) =>
    [booth.name, booth.subtitle, booth.location_detail, booth.category].some((field) =>
      field?.toLowerCase().includes(keyword)
    )
  )
}
