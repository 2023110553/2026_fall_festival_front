import { useEffect, useState } from 'react'
import { getZoneBooths } from '../../../api/map'
import { useMapContext } from '../context/MapProvider'

// 지도 메인 진입 시 현재 선택된 구역의 부스 목록을 1회 호출해서 들고 있는 훅.
// 검색은 서버 재호출 없이 이 목록을 클라이언트에서 필터링하는 방식으로 처리
// (map-section-scope-and-roles.md "검색 방식 제안 — 클라이언트 사이드 필터링" 참고)
export function useMapZoneBooths() {
  const { zoneId } = useMapContext()
  const [booths, setBooths] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false
    setIsLoading(true)
    getZoneBooths(zoneId)
      .then((res) => {
        if (!ignore) setBooths(res.data)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [zoneId])

  return { booths, isLoading }
}

// 위 목록을 검색어로 필터링 (부스명/학과명/카테고리 기준 — 실제 필드명은 백엔드 응답 확정되면 맞추기)
export function useBoothSearch(booths, searchTerm) {
  if (!searchTerm) return booths
  const keyword = searchTerm.trim().toLowerCase()
  return booths.filter((booth) =>
    [booth.name, booth.department, booth.category].some((field) =>
      field?.toLowerCase().includes(keyword)
    )
  )
}
