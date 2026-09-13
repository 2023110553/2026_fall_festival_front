import { useEffect, useState } from 'react'
import { getZoneBooths } from '../../../api/map'
import { useMapContext } from '../context/MapProvider'

// 지도 메인 진입 시 현재 선택된 구역의 부스 목록을 1회 호출해서 들고 있는 훅.
// 검색은 서버 재호출 없이 이 목록을 클라이언트에서 필터링하는 방식으로 처리
// (map-section-scope-and-roles.md "검색 방식 제안 — 클라이언트 사이드 필터링" 참고)
//
// 2026-09-13 방어코드 추가: 백엔드 미기동/VITE_API_BASE_URL 미설정 상황에서
// axios가 200과 함께 (Vite 개발서버의 SPA 폴백) HTML 문자열을 res.data로 돌려주는
// 경우가 있었음 — 그러면 booths가 배열이 아니게 되어 이 훅을 쓰는 화면 전체가
// "filtered.map is not a function"류 에러로 크래시했음(BoothCardList에서 실제 발생).
// 응답이 배열이 아니면 빈 배열로 무시하고, 요청 자체가 실패해도(.catch) 에러 상태만
// 남기고 렌더는 항상 안전한 값(배열)으로 유지되게 함.
export function useMapZoneBooths() {
  const { zoneId } = useMapContext()
  const [booths, setBooths] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    let ignore = false
    setIsLoading(true)
    setIsError(false)
    getZoneBooths(zoneId)
      .then((res) => {
        if (ignore) return
        // 정상 응답이면 배열이어야 한다 — 아니면(백엔드 미연결 시 HTML 폴백 등)
        // 화면을 깨뜨리지 않도록 빈 배열 + 에러 상태로 처리.
        if (Array.isArray(res.data)) {
          setBooths(res.data)
        } else {
          console.error('[useMapZoneBooths] 부스 목록 응답이 배열이 아님 — VITE_API_BASE_URL 설정을 확인하세요.', res.data)
          setBooths([])
          setIsError(true)
        }
      })
      .catch((err) => {
        if (ignore) return
        console.error('[useMapZoneBooths] 부스 목록 조회 실패', err)
        setBooths([])
        setIsError(true)
      })
      .finally(() => {
        if (!ignore) setIsLoading(false)
      })
    return () => {
      ignore = true
    }
  }, [zoneId])

  return { booths, isLoading, isError }
}

// 위 목록을 검색어로 필터링 (부스명/학과명/카테고리 기준 — 실제 필드명은 백엔드 응답 확정되면 맞추기)
// booths가 배열이 아닌 값으로 잘못 들어와도(방어적으로) 항상 배열을 반환한다.
export function useBoothSearch(booths, searchTerm) {
  const list = Array.isArray(booths) ? booths : []
  if (!searchTerm) return list
  const keyword = searchTerm.trim().toLowerCase()
  return list.filter((booth) =>
    [booth.name, booth.department, booth.category].some((field) =>
      field?.toLowerCase().includes(keyword)
    )
  )
}
