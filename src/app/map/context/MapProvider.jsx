import { createContext, useContext, useMemo, useState } from 'react'
import { MAP_ZONES } from '../../../constants/zones'

// 지도 섹션(검색/구역/주야/날짜/바텀시트/등불보기 탭)에서만 쓰는 로컬 상태를 묶어두는 Context.
// map-section-scope-and-roles.md 합의사항: "여전히 전역 상태까지는 불필요 —
// 지도 섹션 스코프 안에서만 쓰는 상태이므로 Context 하나로 묶는 걸 추천"
const MapContext = createContext(null)

export function MapProvider({ children }) {
  const [zoneId, setZoneId] = useState(MAP_ZONES[0].id)
  const [isNight, setIsNight] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null) // 29 / 30 / 1
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBoothId, setSelectedBoothId] = useState(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [sheetTab, setSheetTab] = useState('info') // 'info' | 'lantern'

  const value = useMemo(
    () => ({
      zoneId,
      setZoneId,
      isNight,
      setIsNight,
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
    }),
    [zoneId, isNight, selectedDate, searchTerm, selectedBoothId, isSheetOpen, sheetTab]
  )

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>
}

export function useMapContext() {
  const ctx = useContext(MapContext)
  if (!ctx) throw new Error('useMapContext는 MapProvider 안에서만 사용할 수 있어요')
  return ctx
}
