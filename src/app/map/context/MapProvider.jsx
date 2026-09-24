import { getBooths } from '../../../api/map'
import { useAuthStore } from '../../../store/useAuthStore'
import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MAP_ZONES } from '../../../constants/zones'
import { useTranslation } from '../../../i18n/useTranslation'

// URL의 ?zone=zoneN이 실제 구역 id일 때만 인정, 아니면 첫 구역(혜화관).
// 홈 "현재 인기" 지도 미리보기가 /map?zone=zone2 식으로 특정 구역으로 바로 진입할 때 쓴다.
const resolveZoneId = (candidate) =>
  MAP_ZONES.some((zone) => zone.id === candidate) ? candidate : MAP_ZONES[0].id

// URL의 ?booth=<부스 id>. 홈 부스 랭킹에서 /map?zone=zone2&booth=57 식으로 특정 부스 상세로 바로 들어올 때 쓴다.
// 부스 id는 백엔드에서 1부터 올라가는 정수라 그 형태가 아니면(빈 값, 문자열, 0 이하) 무시하고 목록 화면으로 연다.
const resolveBoothId = (candidate) => {
  const boothId = Number(candidate)
  return Number.isInteger(boothId) && boothId > 0 ? boothId : null
}

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
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [zoneId, setZoneIdState] = useState(() => resolveZoneId(searchParams.get('zone')))
  // 구역을 바꾸면 URL(?zone=)도 같이 갱신 — 새로고침·공유 시 같은 구역이 열리고,
  // 홈 미리보기 → 지도 진입 경로와 PlaceSelector 선택이 같은 규칙을 쓴다. replace라 뒤로가기 히스토리는 안 쌓임.
  const setZoneId = useCallback((nextZoneId) => {
    const resolved = resolveZoneId(nextZoneId)
    setZoneIdState(resolved)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      next.set('zone', resolved)
      return next
    }, { replace: true })
  }, [setSearchParams])
  const [timeOfDay, setTimeOfDay] = useState('day') // 'day' | 'sunset' | 'night'
  const [selectedDate, setSelectedDate] = useState(null) // 29 / 30 / 1
  const [searchTerm, setSearchTerm] = useState('')

  // 2026-09-23: ?booth=로 들어오면 그 부스 상세를 처음부터 연다(홈 부스 랭킹 → 지도).
  // 값이 없으면 예전처럼 null(부스 목록 화면)로 시작한다.
  const [selectedBoothId, setSelectedBoothIdState] = useState(() => resolveBoothId(searchParams.get('booth')))
  const [isSheetOpen, setIsSheetOpen] = useState(true)
  //바텀시트 디자인 후 주석 풀어야합니다!!!!!!
  // const [isSheetOpen, setIsSheetOpen] = useState(false)

  // 부스를 고르거나 닫으면 URL(?booth=)도 같이 갱신 — zone과 같은 규칙이라 새로고침·공유·뒤로가기 동작이 일관된다.
  // replace라 부스를 눌러볼 때마다 뒤로가기 히스토리가 쌓이지는 않는다(zone과 동일).
  const setSelectedBoothId = useCallback((nextBoothId) => {
    const resolved = resolveBoothId(nextBoothId)
    setSelectedBoothIdState(resolved)
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (resolved == null) next.delete('booth')
      else next.set('booth', String(resolved))
      return next
    }, { replace: true })
  }, [setSearchParams])
  const [sheetTab, setSheetTab] = useState('info') // 'info' | 'lantern'
  // 2026-09-13(3차): 부스 밝기 단계 임시 미리보기 상태 — 0~MAX_LANTERN_TIER(constants/lanternTiers.js).
  // 원래 설계(final-plan-team-share.md 2-3절)는 부스마다 실제 등불 개수(lantern_count)를
  // 기준으로 단계를 "각 부스별로 다르게" 계산해야 하는데, 아직 백엔드가 그 값을 내려주지
  // 않아서(부스 데이터 미확정 단계) 지금은 전체 부스에 같은 값을 임시로 넣어보는 미리보기용
  // 상태만 만들어둔 것 — timeOfDay와 동일하게 "정하는 로직"(지금은 이 상태값, 나중엔
  // lantern_count 기반 getLanternTier())과 "그리는 로직"(BoothMarker의 brightnessLevel prop)을
  // 분리해뒀으니, 실제 데이터가 들어와도 이 자리만 교체하면 됨.
  //
  // 2026-09-18: 팀 합의로 등불 구간을 0/1/5/10/50개(0~4단계) → 0/1/10/30/50/100개(0~5단계, 6단계)로
  // 확장 + 단계별 밝기 차이 강화(BoothMarker.jsx 18번 항목). 이 값의 상한도 4 → MAX_LANTERN_TIER(현재 5).
  //
  // 2026-09-19: 부스별 lantern_count → getLanternTier() 자동 계산으로 전환(BoothMarker.jsx 19번 항목).
  // 이제 이 값은 "null이면 자동(부스마다 등불 개수 기준), 숫자면 네 구역 전체 부스를 그 단계로 강제"하는
  // 개발용 override다. 지도 UI 리스타일 이후 MapShell의 순환 버튼이 빠져서 setBoothBrightnessPreview를
  // 부르는 곳은 현재 없다 — 기본값이 null이라 앱에서는 항상 자동 계산으로 동작하고, 단계별 비교가 필요할
  // 때만 개발용 버튼을 달아 0~MAX_LANTERN_TIER 값을 넣어보면 된다.
  const [boothBrightnessPreview, setBoothBrightnessPreview] = useState(null) // null(자동) | 0~MAX_LANTERN_TIER(현재 5)

  const [listTimeOfDay, setListTimeOfDay] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [boothRevision, setBoothRevision] = useState(0)
  const refreshBooths = useCallback(() => setBoothRevision((value) => value + 1), [])
  const [listResponse, setListResponse] = useState(null)
  const accessToken = useAuthStore((state) => state.accessToken)
  const queryKey = JSON.stringify([selectedDate, listTimeOfDay, selectedCategory, accessToken])
  const currentList = listResponse?.key === queryKey ? listResponse : null
  const isLoading = currentList == null
  const isError = Boolean(currentList?.error)
  const listError = currentList?.error ?? ''
  const zoneLabel = MAP_ZONES.find((zone) => zone.id === zoneId)?.label
  const booths = useMemo(() => (currentList?.data?.booths ?? []).filter(
    (booth) => booth.zone === zoneLabel
  ), [currentList, zoneLabel])

  // ?booth=로 들어왔는데 ?zone=이 빠졌거나 다른 구역을 가리키면, 부스 목록이 도착한 뒤 그 부스의 구역으로 맞춘다.
  // 홈에서 넘어올 때는 이미 구역을 알고 링크를 만들기 때문에(zone 동봉) 보통은 할 일이 없고,
  // 외부에서 /map?booth=57만 공유받은 경우를 위한 안전망이다.
  //
  // 딱 한 번만 맞춘다 — 그 뒤에 사용자가 구역 토글로 다른 구역을 둘러보는 걸 여기서 되돌리면 안 되기 때문.
  // (목록에 없는 부스면 보정 대상이 없으므로 그대로 두고, 상세 정보는 BoothDetailPanel이 id로 따로 받아온다.)
  const allBooths = currentList?.data?.booths
  const pendingZoneFixRef = useRef(selectedBoothId)

  useEffect(() => {
    const pendingBoothId = pendingZoneFixRef.current
    if (pendingBoothId == null || !Array.isArray(allBooths)) return
    pendingZoneFixRef.current = null
    const pendingBooth = allBooths.find((booth) => booth.booth_id === pendingBoothId)
    const boothZoneId = MAP_ZONES.find((zone) => zone.label === pendingBooth?.zone)?.id
    if (boothZoneId && boothZoneId !== zoneId) setZoneId(boothZoneId)
  }, [allBooths, zoneId, setZoneId])

  useEffect(() => {
    const controller = new AbortController()
    getBooths({ date: selectedDate, timeSlot: listTimeOfDay, category: selectedCategory }, { signal: controller.signal })
      .then(({ data: response }) => {
        if (controller.signal.aborted) return
        const data = response?.data
        if (!response?.success || !Array.isArray(data?.booths)
          || !/^\d{4}-\d{2}-\d{2}$/.test(data.festival_date)
          || !['DAY', 'NIGHT'].includes(data.time_slot)) throw new Error('Invalid booth list response')
        const date = selectedDate ?? data.festival_date
        const slot = listTimeOfDay ?? data.time_slot.toLowerCase()
        setListResponse({ key: JSON.stringify([date, slot, selectedCategory, accessToken]), data })
        if (selectedDate == null) setSelectedDate(date)
        if (listTimeOfDay == null) setListTimeOfDay(slot)
        setTimeOfDay(slot)
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setListResponse({ key: queryKey, error: error.response?.status === 400
          ? t('map.invalidFilter')
          : t('map.boothListError') })
      })
    return () => controller.abort()
  }, [selectedDate, listTimeOfDay, selectedCategory, accessToken, queryKey, boothRevision, t])

  const value = useMemo(
    () => ({
      boothRevision, refreshBooths,
      booths, isLoading, isError, listError,
      listTimeOfDay, setListTimeOfDay, selectedCategory, setSelectedCategory,
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
      boothRevision, refreshBooths,
      booths, isLoading, isError, listError, listTimeOfDay, selectedCategory,
      zoneId, setZoneId,
      timeOfDay,
      selectedDate,
      searchTerm,
      selectedBoothId,
      setSelectedBoothId,
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

// MapProvider 밖(홈 랭킹 모달 등)에서도 렌더되는 공용 컴포넌트용 — 컨텍스트가 없으면 null을 돌려준다.
export function useOptionalMapContext() {
  return useContext(MapContext)
}
