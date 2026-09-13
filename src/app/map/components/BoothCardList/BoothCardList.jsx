import { useMapContext } from '../../context/MapProvider'
import { useMapZoneBooths, useBoothSearch } from '../../hooks/useMapZones'

// 하단 부스/장소 카드 리스트 — 썸네일/이름/소속/등불개수. 카테고리 필터·주야간 전환에 따라 갱신된다.
//
// 2026-09-13: 백엔드 연결 실패(VITE_API_BASE_URL 미설정 등) 시 사용자에게 원인을 알 수
// 있는 안내를 보여주도록 isError 케이스 추가 — 이전엔 이 상황에서 화면 전체가
// "Unexpected Application Error"로 크래시했음(원인은 useMapZones.js 주석 참고).
export default function BoothCardList({ onSelectBooth }) {
  const { searchTerm } = useMapContext()
  const { booths, isLoading, isError } = useMapZoneBooths()
  const filtered = useBoothSearch(booths, searchTerm)

  if (isLoading) return <p>불러오는 중...</p>
  if (isError) {
    return <p>부스 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요. (개발 환경이면 .env의 VITE_API_BASE_URL 설정을 확인해주세요)</p>
  }
  if (filtered.length === 0) return <p>표시할 부스가 없어요.</p>

  return (
    <ul>
      {filtered.map((booth) => (
        <li key={booth.id} onClick={() => onSelectBooth(booth.id)}>
          {booth.name} · 등불 {booth.lanternCount ?? 0}
        </li>
      ))}
    </ul>
  )
}
