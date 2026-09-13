import MapCanvas from '../../scene/MapCanvas'
import PinLabel from '../PinLabel/PinLabel'
import BoothCardList from '../BoothCardList/BoothCardList'
import BottomSheet from '../BottomSheet/BottomSheet'
import { useMapContext } from '../../context/MapProvider'
import { MAP_ZONES } from '../../../../constants/zones'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'

// 시간대 순환 순서 + 버튼에 보여줄 라벨. 실시간 시계 기반 자동 전환으로 바꿀 때는
// 이 배열/라벨 대신 "현재 시각 → timeOfDay" 계산 함수로 교체하면 된다(버튼은 유지해도 되고,
// 자동 전환 후 수동 오버라이드용으로 남겨도 됨 — 그때 가서 결정).
const TIME_OF_DAY_CYCLE = ['day', 'sunset', 'night']
const TIME_OF_DAY_LABEL = { day: '주간', sunset: '노을', night: '야간' }

// 부스 밝기 단계(0~4) 임시 미리보기 버튼 순환 값 + 라벨.
// final-plan-team-share.md 2-3절 표 기준: 0=기본(등불 0개) / 1~4단계는 등불
// 1·5·10·50개 이상 구간. 실제로는 부스마다 다른 값이어야 하지만, 아직 lantern_count
// 데이터가 없어서 지금은 버튼 하나로 전체 부스에 같은 값을 넣어보며 시안만 확인한다.
const BRIGHTNESS_PREVIEW_CYCLE = [0, 1, 2, 3, 4]
const BRIGHTNESS_PREVIEW_LABEL = {
  0: '부스 밝기 미리보기: 기본(0단계)',
  1: '부스 밝기 미리보기: 1단계',
  2: '부스 밝기 미리보기: 2단계',
  3: '부스 밝기 미리보기: 3단계',
  4: '부스 밝기 미리보기: 4단계',
}

// 지도 메인 화면의 뼈대 — 구역탭 / 주야간 토글 / 날짜탭 / 카테고리 필터 / 3D 캔버스 / 하단 카드 리스트를 조립한다.
// 실제 스타일(레이아웃 CSS)은 프론트1이 디자인 확정되면 MapShell.styles.js로 분리해서 채워 넣으면 된다.
export default function MapShell() {
  const {
    zoneId,
    setZoneId,
    timeOfDay,
    setTimeOfDay,
    selectedBoothId,
    setSelectedBoothId,
    isSheetOpen,
    setIsSheetOpen,
    boothBrightnessPreview,
    setBoothBrightnessPreview,
  } = useMapContext()

  const handleBoothClick = (boothId) => {
    setSelectedBoothId(boothId)
    setIsSheetOpen(true)
  }

  const handleCycleTimeOfDay = () => {
    const nextIndex = (TIME_OF_DAY_CYCLE.indexOf(timeOfDay) + 1) % TIME_OF_DAY_CYCLE.length
    setTimeOfDay(TIME_OF_DAY_CYCLE[nextIndex])
  }

  const handleCycleBrightnessPreview = () => {
    const nextIndex =
      (BRIGHTNESS_PREVIEW_CYCLE.indexOf(boothBrightnessPreview) + 1) % BRIGHTNESS_PREVIEW_CYCLE.length
    setBoothBrightnessPreview(BRIGHTNESS_PREVIEW_CYCLE[nextIndex])
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

      <button onClick={handleCycleTimeOfDay}>{TIME_OF_DAY_LABEL[timeOfDay]}</button>
      {/* 임시 개발용 버튼 — 실제 등불 개수 연동 전까지 부스 밝기 단계를 눈으로 확인하기 위한 것.
          실제 데이터 연동되면 이 버튼은 지우거나 QA/디버그 전용으로만 남길 예정. */}
      <button onClick={handleCycleBrightnessPreview}>{BRIGHTNESS_PREVIEW_LABEL[boothBrightnessPreview]}</button>

      <div>
        {BOOTH_CATEGORIES.map((c) => (
          <span key={c.value}>{c.label}</span>
        ))}
      </div>

      <div style={{ position: 'relative', height: '55vh' }}>
        <MapCanvas
          zoneId={zoneId}
          timeOfDay={timeOfDay}
          boothBrightnessPreview={boothBrightnessPreview}
          onBoothClick={handleBoothClick}
        />
        {/* 부스 앵커 위에 얹히는 라벨들은 실제 앵커 좌표 데이터가 붙으면 여기서 map으로 렌더 */}
        <PinLabel />
      </div>

      <BoothCardList onSelectBooth={handleBoothClick} />

      <BottomSheet open={isSheetOpen} boothId={selectedBoothId} onClose={() => setIsSheetOpen(false)} />
    </div>
  )
}
