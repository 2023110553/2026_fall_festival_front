import MapCanvas from '../../scene/MapCanvas'
import PinLabel from '../PinLabel/PinLabel'
import BoothCardList from '../BoothCardList/BoothCardList'
import BottomSheet from '../BottomSheet/BottomSheet'
import { useMapContext } from '../../context/MapProvider'
import { MAP_ZONES } from '../../../../constants/zones'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'

// 지도 메인 화면의 뼈대 — 구역탭 / 주야간 토글 / 날짜탭 / 카테고리 필터 / 3D 캔버스 / 하단 카드 리스트를 조립한다.
// 실제 스타일(레이아웃 CSS)은 프론트1이 디자인 확정되면 MapShell.styles.js로 분리해서 채워 넣으면 된다.
export default function MapShell() {
  const { zoneId, setZoneId, isNight, setIsNight, selectedBoothId, setSelectedBoothId, isSheetOpen, setIsSheetOpen } =
    useMapContext()

  const handleBoothClick = (boothId) => {
    setSelectedBoothId(boothId)
    setIsSheetOpen(true)
  }

  return (
    <div>
      <nav>
        {MAP_ZONES.map((zone) => (
          <button key={zone.id} onClick={() => setZoneId(zone.id)} disabled={zone.id === zoneId}>
            {zone.label}
          </button>
        ))}
      </nav>

      <button onClick={() => setIsNight((prev) => !prev)}>{isNight ? '야간' : '주간'}</button>

      <div>
        {BOOTH_CATEGORIES.map((c) => (
          <span key={c.value}>{c.label}</span>
        ))}
      </div>

      <div style={{ position: 'relative', height: '55vh' }}>
        <MapCanvas zoneId={zoneId} timeOfDay={isNight ? 'night' : 'day'} onBoothClick={handleBoothClick} />
        {/* 부스 앵커 위에 얹히는 라벨들은 실제 앵커 좌표 데이터가 붙으면 여기서 map으로 렌더 */}
        <PinLabel />
      </div>

      <BoothCardList onSelectBooth={handleBoothClick} />

      <BottomSheet open={isSheetOpen} boothId={selectedBoothId} onClose={() => setIsSheetOpen(false)} />
    </div>
  )
}
