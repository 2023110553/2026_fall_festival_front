import { createContext, useContext, useMemo, useState } from 'react'
import { MAP_ZONES } from '../../../constants/zones'

// 지도 섹션(검색/구역/주야/날짜/바텀시트/등불보기 탭)에서만 쓰는 로컬 상태를 묶어두는 Context.
// map-section-scope-and-roles.md 합의사항: "여전히 전역 상태까지는 불필요 —
// 지도 섹션 스코프 안에서만 쓰는 상태이므로 Context 하나로 묶는 걸 추천"
const MapContext = createContext(null)

// 2026-09-13: 기존 isNight(boolean, 주/야 2단계)를 timeOfDay('day'|'sunset'|'night', 3단계)로
// 교체함 — MapCanvas가 원래 문서화하고 있던 3단계 계약(day/sunset/night)에 맞추기 위함.
// 지금은 MapShell 버튼 클릭으로 세 값을 순서대로 돌려가며 즉시 전환하지만(개발 단계),
// 나중에 실시간 시계 기반 자동 전환으로 바꿀 때도 이 자리에서 setTimeOfDay를 호출하는
// 방식만 유지하면 되므로 MapCanvas/SceneEnvironment 쪽 렌더링 코드는 손댈 필요가 없다.
export function MapProvider({ children }) {
  const [zoneId, setZoneId] = useState(MAP_ZONES[0].id)
  const [timeOfDay, setTimeOfDay] = useState('day') // 'day' | 'sunset' | 'night'
  const [selectedDate, setSelectedDate] = useState(null) // 29 / 30 / 1
  const [searchTerm, setSearchTerm] = useState('')

  // 디자인 미리보기용 초기값
  const [selectedBoothId, setSelectedBoothId] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(true)
  //바텀시트 디자인 후 주석 풀어야합니다!!!!!!
  // const [selectedBoothId, setSelectedBoothId] = useState(null)
  // const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetTab, setSheetTab] = useState('info') // 'info' | 'lantern'
  // 2026-09-13(3차): 부스 밝기 단계(0~4) 임시 미리보기 상태.
  // 원래 설계(final-plan-team-share.md 2-3절)는 부스마다 실제 등불 개수(lantern_count)를
  // 기준으로 0~4단계를 "각 부스별로 다르게" 계산해야 하는데, 아직 백엔드가 그 값을 내려주지
  // 않아서(부스 데이터 미확정 단계) 지금은 전체 부스에 같은 값을 임시로 넣어보는 미리보기용
  // 버튼(MapShell)만 만들어둔 것 — timeOfDay와 동일하게 "정하는 로직"(지금은 버튼, 나중엔
  // lantern_count 기반 계산 함수)과 "그리는 로직"(BoothMarker의 brightnessLevel prop)을
  // 분리해뒀으니, 실제 데이터가 들어와도 이 자리만 교체하면 됨.
  const [boothBrightnessPreview, setBoothBrightnessPreview] = useState(0) // 0~4

  const value = useMemo(
    () => ({
      zoneId,
      setZoneId,
      timeOfDay,
      setTimeOfDay,
      selectedDate,
      setSelectedDate,
      searchTerm,
      setSearchTerm,
      selectedBoothId,
      setSelectedBoothId,
      isSheetOpen,
      setIsSheetOpen,
      sheetTab,
      setSheetTab,
      boothBrightnessPreview,
      setBoothBrightnessPreview,
    }),
    [
      zoneId,
      timeOfDay,
      selectedDate,
      searchTerm,
      selectedBoothId,
      isSheetOpen,
      sheetTab,
      boothBrightnessPreview,
    ]
  )

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export function useMapContext() {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMapContext는 MapProvider 안에서만 사용할 수 있어요')
  return ctx
}
