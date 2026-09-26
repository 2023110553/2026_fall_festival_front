import { getBooths } from '../../../api/map'
import { useAuthStore } from '../../../store/useAuthStore'
import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
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

// 부스 id → 그 부스가 속한 구역 id. 목록이 아직 안 왔거나 목록에 없는 부스면 null.
// allBooths는 구역 필터를 거치기 **전**의 전체 목록(currentList.data.booths)이어야 한다 —
// 구역 필터를 거친 booths로 찾으면 "지금 보고 있는 구역 밖 부스"를 영영 못 찾는다(그게 이 함수를 만든 이유다).
function findZoneIdByBoothId(allBooths, boothId) {
  if (boothId == null || !Array.isArray(allBooths)) return null
  const booth = allBooths.find((item) => item.booth_id === boothId)
  return MAP_ZONES.find((zone) => zone.label === booth?.zone)?.id ?? null
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
  const navigate = useNavigate()
  const location = useLocation()

  // 2026-09-26: 지도 화면의 "지금 무엇을 보고 있는가"를 전부 URL에서 읽는다(#NNN).
  //
  // 예전에는 zone/booth를 useState로 들고 URL에는 replace로 복사만 했다. 그러면 두 가지가 안 된다 —
  //   (1) 히스토리가 안 쌓여서 뒤로가기가 지도 안에서 한 단계 올라오지 못하고 홈으로 나가버린다.
  //   (2) 사용자가 뒤로가기를 눌러 URL이 바뀌어도 useState 값은 그대로라 화면이 따라가지 않는다.
  // URL을 진실의 원천으로 두면 둘 다 브라우저가 알아서 해준다 — popstate로 searchParams가 바뀌면
  // 아래 파생값이 다시 계산되고 화면이 따라간다.
  //
  // URL이 표현하는 세 가지 상태:
  //   /map?zone=zone2              부스 목록
  //   /map?zone=zone2&q=멋사        검색 화면(검색어 포함)
  //   /map?zone=zone2&booth=57     부스 상세 (검색에서 들어왔으면 &q=도 같이 남는다)
  //
  // 무엇을 push하고 무엇을 replace하는지가 뒤로가기 동작을 결정한다:
  //   push    — 검색 진입, 부스 선택. 사용자가 "한 단계 들어갔다"고 느끼는 전환
  //   replace — 구역 토글, 검색어 타이핑. 히스토리에 쌓이면 뒤로가기를 여러 번 눌러야 해서 답답하다
  const zoneId = resolveZoneId(searchParams.get('zone'))
  const selectedBoothId = resolveBoothId(searchParams.get('booth'))
  // q가 아예 없으면 목록 화면, 빈 문자열이라도 있으면 검색 화면(검색어를 아직 안 친 상태).
  const searchQuery = searchParams.has('q') ? searchParams.get('q') ?? '' : null

  // URL을 한 번에 갱신하는 공용 함수. mutate로 파라미터를 바꾸고, push/replace만 골라 쓴다.
  const updateParams = useCallback((mutate, { replace }) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      mutate(next)
      return next
    }, { replace })
  }, [setSearchParams])

  // 구역 토글 — replace. 구역을 둘러보는 건 "들어가는" 동작이 아니라서 히스토리에 쌓으면
  // 뒤로가기가 구역 토글 되감기가 돼버린다.
  const setZoneId = useCallback((nextZoneId) => {
    const resolved = resolveZoneId(nextZoneId)
    updateParams((params) => params.set('zone', resolved), { replace: true })
  }, [updateParams])

  const [timeOfDay, setTimeOfDay] = useState('day') // 'day' | 'sunset' | 'night'
  const [selectedDate, setSelectedDate] = useState(null) // 29 / 30 / 1
  const [searchTerm, setSearchTerm] = useState('')

  const [isSheetOpen, setIsSheetOpen] = useState(true)
  //바텀시트 디자인 후 주석 풀어야합니다!!!!!!
  // const [isSheetOpen, setIsSheetOpen] = useState(false)

  // 아래 setSelectedBoothId가 "고른 부스가 어느 구역인지"를 찾을 때 쓰는 전체 목록(구역 필터 전).
  // 실제 값은 목록 응답이 계산된 뒤(아래 allBooths 자리)에 넣는다 — 렌더 중에 넣으므로
  // 사용자가 부스를 누르는 시점에는 항상 최신이다.
  //
  // 왜 state가 아니라 ref인가: 이 목록을 useCallback 의존성에 넣으면 목록이 갱신될 때마다
  // setSelectedBoothId의 참조가 바뀌고, 그 함수를 받는 컨텍스트 value와 자식 memo가 전부 깨진다.
  const allBoothsRef = useRef(null)

  // 부스를 고르거나 닫으면 URL(?booth=)도 같이 갱신 — zone과 같은 규칙이라 새로고침·공유·뒤로가기 동작이 일관된다.
  // replace라 부스를 눌러볼 때마다 뒤로가기 히스토리가 쌓이지는 않는다(zone과 동일).
  //
  // 2026-09-24: 고른 부스가 지금 보고 있는 구역 밖이면 구역(zoneId)도 같이 옮긴다.
  // 전체 검색(GET /api/booths/search/)은 날짜·시간대·구역을 가리지 않고 결과를 주는데 지도는 한 구역만
  // 그리기 때문에, 이 보정이 없으면 "혜화관을 보는 채로 팔정도 부스 상세만 열리는" 상태가 된다.
  // 그 부스는 3D 씬에도 안 그려져 있고(ZoneBooths가 구역 필터를 거친 booths를 받는다),
  // 카메라도 목적지를 못 찾는다.
  //
  // 부스를 고르는 경로가 셋(3D 핀 클릭 / 바텀시트 목록·검색 / 홈 랭킹의 ?booth=)인데 전부 이 함수를
  // 지나가므로, 여기 한 곳에 두면 세 경로가 같은 규칙을 따른다. 검색 패널이나 바텀시트에 넣으면
  // 나머지 경로에 같은 코드를 또 써야 한다.
  const setSelectedBoothId = useCallback((nextBoothId) => {
    const resolved = resolveBoothId(nextBoothId)
    const pickedZoneId = findZoneIdByBoothId(allBoothsRef.current, resolved)

    // 구역이 바뀌어야 한다면 "지금 있는 칸"의 zone부터 replace로 고친다.
    // 이 한 줄이 없으면 뒤로가기했을 때 이전 칸에 남아 있던 옛 구역으로 지도가 되돌아간다 —
    // 전체 검색으로 다른 구역 부스를 고른 뒤 뒤로가면 검색 화면이 엉뚱한 구역을 비추게 된다.
    // 기획 요구는 "뒤로가기해도 그 부스가 있던 구역을 유지"다.
    if (pickedZoneId && pickedZoneId !== zoneId) {
      updateParams((params) => params.set('zone', pickedZoneId), { replace: true })
    }

    // 부스 선택은 push — 상세에서 뒤로가기를 누르면 방금 있던 화면(목록 또는 검색 결과)으로 돌아온다.
    // q는 일부러 지우지 않는다. 검색 결과에서 부스를 골랐다면 뒤로가기했을 때 그 검색어가 남아 있어야 한다.
    // 부스를 닫는 건 여기가 아니라 goBack()이 한다 — 히스토리를 거슬러 올라가야 "들어온 자리"로 정확히 돌아간다.
    updateParams((params) => {
      if (resolved == null) params.delete('booth')
      else params.set('booth', String(resolved))
      if (pickedZoneId) params.set('zone', pickedZoneId)
    }, { replace: false })
  }, [updateParams, zoneId])

  // 검색 화면 진입 — push. 뒤로가기 한 번이면 목록으로 돌아온다.
  const openSearch = useCallback(() => {
    updateParams((params) => {
      params.set('q', '')
      params.delete('booth')
    }, { replace: false })
  }, [updateParams])

  // 검색어 갱신 — replace. 한 글자마다 히스토리가 쌓이면 뒤로가기를 글자 수만큼 눌러야 한다.
  const updateSearchQuery = useCallback((text) => {
    updateParams((params) => params.set('q', text), { replace: true })
  }, [updateParams])

  // 상세의 ← 버튼, 검색의 「취소」 버튼이 쓴다. 브라우저 뒤로가기와 같은 동작이어야
  // "어디로 돌아갈지"가 버튼과 제스처에서 달라지지 않는다.
  //
  // 히스토리가 비어 있을 때(예: /map?booth=57 링크를 새 탭에서 연 경우)는 돌아갈 칸이 없으므로
  // 목록 화면으로 대신 보낸다. 아래 히스토리 시딩이 보통 이 상황을 미리 막아준다.
  const goBack = useCallback(() => {
    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }
    const params = new URLSearchParams(searchParams)
    params.delete('booth')
    params.delete('q')
    navigate(`${location.pathname}?${params}`, { replace: true })
  }, [navigate, location.pathname, searchParams])
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

  // 구역 필터를 거치기 전의 전체 목록. 위 setSelectedBoothId와 아래 첫 진입 보정이 함께 쓴다.
  const allBooths = currentList?.data?.booths
  allBoothsRef.current = allBooths

  // 밖에서 ?booth=를 달고 지도에 들어온 경우(홈 인기부스 클릭, 공유 링크) 히스토리에 "목록" 칸을
  // 한 칸 끼워 넣는다 — 현재 칸을 목록으로 replace한 뒤 상세를 push한다.
  //
  // 왜 필요한가: 홈에서 /map?zone=zone2&booth=57로 바로 들어오면 히스토리가 [홈, 상세]라서
  // 상세에서 뒤로가기를 누르면 홈으로 나가버린다. 기획 요구는 "지도의 부스 목록으로 올라오기"다.
  // 한 칸을 미리 만들어두면 [홈, 목록, 상세]가 되어 뒤로가기 한 번이 목록, 두 번이 홈이 된다.
  //
  // 딱 한 번만 — 지도 안에서 이동하는 동안 MapProvider는 계속 떠 있으므로 페이지 로드당 1회 실행된다.
  const didSeedHistoryRef = useRef(false)
  useEffect(() => {
    if (didSeedHistoryRef.current) return
    didSeedHistoryRef.current = true
    if (selectedBoothId == null) return

    const listParams = new URLSearchParams(searchParams)
    listParams.delete('booth')
    const detailUrl = `${location.pathname}?${searchParams}`
    navigate(`${location.pathname}?${listParams}`, { replace: true })
    navigate(detailUrl)
    // 마운트 시 한 번만 도는 이펙트라 의존성을 비워 둔다(위 ref가 재실행도 막는다).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ?booth=로 들어왔는데 ?zone=이 빠졌거나 다른 구역을 가리키면, 부스 목록이 도착한 뒤 그 부스의 구역으로 맞춘다.
  // 홈에서 넘어올 때는 이미 구역을 알고 링크를 만들기 때문에(zone 동봉) 보통은 할 일이 없고,
  // 외부에서 /map?booth=57만 공유받은 경우를 위한 안전망이다.
  //
  // setSelectedBoothId가 같은 보정을 하는데도 이 이펙트가 따로 필요한 이유:
  // 첫 진입의 ?booth=는 useState 초기값으로 들어와서 setSelectedBoothId를 거치지 않고,
  // 그 시점에는 목록 응답도 아직 도착 전이라 구역을 알 방법이 없다. 목록이 오는 걸 기다려야 한다.
  //
  // 딱 한 번만 맞춘다 — 그 뒤에 사용자가 구역 토글로 다른 구역을 둘러보는 걸 여기서 되돌리면 안 되기 때문.
  // (목록에 없는 부스면 보정 대상이 없으므로 그대로 두고, 상세 정보는 BoothDetailPanel이 id로 따로 받아온다.)
  const pendingZoneFixRef = useRef(selectedBoothId)

  useEffect(() => {
    const pendingBoothId = pendingZoneFixRef.current
    if (pendingBoothId == null || !Array.isArray(allBooths)) return
    pendingZoneFixRef.current = null
    const boothZoneId = findZoneIdByBoothId(allBooths, pendingBoothId)
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
      searchQuery,
      openSearch,
      updateSearchQuery,
      goBack,
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
      searchQuery,
      openSearch,
      updateSearchQuery,
      goBack,
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
