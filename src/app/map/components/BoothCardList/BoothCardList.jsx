import { useMapContext } from '../../context/MapProvider'
import { useMapZoneBooths, useBoothSearch } from '../../hooks/useMapZones'

// 하단 부스/장소 카드 리스트 — 썸네일/이름/소속/등불개수. 카테고리 필터·주야간 전환에 따라 갱신된다.
export default function BoothCardList({ onSelectBooth }) {
  const { searchTerm } = useMapContext()
  const { booths, isLoading } = useMapZoneBooths()
  const filtered = useBoothSearch(booths, searchTerm)

  if (isLoading) return <p>불러오는 중...</p>

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
