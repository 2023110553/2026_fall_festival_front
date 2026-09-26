import { AFFILIATION, FOOD_TRUCK_BOOTH_IDS, NIGHT_BOOTH_AFFILIATION } from './boothAffiliations'

// 등불 마커 색 분류 — 2026-09-24 추가(기디 요청, 재원 승인. 결정 기록: campus-map/booth-lantern-marker-plan.md).
//
// 분류 기준(기디):
//   1. 주간 부스: 푸드트럭 / 푸드트럭을 뺀 부스
//   2. 야간 부스: 단과대별로 다른 색 + 동아리 부스는 한 색으로 통일
//   3. 동빛 에코코는 단독 색
//   4. 그 외 나머지
//
// "정하는 로직"(이 파일)과 "그리는 로직"(scene/zones/BoothLantern.jsx)을 나눴다 — lanternTiers.js,
// boothSizes.js와 같은 구조다. 여기 함수들은 React·three에 의존하지 않는 순수 함수라 바텀시트 카드에
// 색 점을 찍거나 범례를 만들 때도 그대로 가져다 쓸 수 있다.
//
// 색 배정 원칙:
//   - 부스 목록 API가 한 번에 한 날짜·한 시간대만 내려주고 지도는 한 구역만 그리므로, 한 화면에 같이 뜨는
//     그룹은 많아야 6~7개다. 그래서 "같은 구역에 같이 뜨는 단과대끼리" 색이 최대한 멀어지게 배정했다.
//       팔정도: 문과·법과·불교·사범·첨단융합 / 혜화관: 사회과학·경영·바이오시스템·열린전공·미래융합 / 원흥관: 공과
//     같은 화면에 뜨는 색끼리 CIEDE2000 색차 18 이상이고, 동빛 에코코가 어느 구역에 들어와도 유지된다.
//     구역이 바뀌는 부스가 생기면 이 조건이 깨질 수 있으니 색을 바꿀 때는 계획 문서의 표로 다시 확인할 것.
//   - 주간 두 색은 야간 단과대 색을 재사용한다(하늘 = 주간 부스·첨단융합, 자홍 = 푸드트럭·미래융합).
//     주간과 야간은 한 화면에 같이 안 뜨기 때문. 범례를 만들면 시간대별로 따로 보여주면 된다.
//   - 초록은 동빛 에코코만 쓴다("단독 색"). 다른 그룹에 초록 계열을 새로 넣지 말 것.
//   - body = 빛나는 종이 몸통 색, key = 위아래 칼라·술·숫자 색. 기디 레퍼런스 이미지에서 뽑은 톤이 바탕이다.

export const BOOTH_MARKER_PALETTE = Object.freeze({
  VIOLET: Object.freeze({ body: '#E3B2FA', key: '#8438C2' }), // 보라
  NAVY: Object.freeze({ body: '#7F93E6', key: '#1F2C80' }), // 남색
  PINK: Object.freeze({ body: '#FEB7BF', key: '#C24050' }), // 분홍
  YELLOW: Object.freeze({ body: '#FFF06A', key: '#8F8A12' }), // 노랑
  SKY: Object.freeze({ body: '#9DEBFF', key: '#0E8FB5' }), // 하늘
  CORAL: Object.freeze({ body: '#FE9889', key: '#CD382E' }), // 다홍
  BLUE: Object.freeze({ body: '#9CCAFD', key: '#2F59D2' }), // 파랑
  TEAL: Object.freeze({ body: '#90EDE5', key: '#148E8D' }), // 청록
  GOLD: Object.freeze({ body: '#FFDD85', key: '#B07A0B' }), // 호박
  MAGENTA: Object.freeze({ body: '#F5B2EC', key: '#A8329C' }), // 자홍
  ORANGE: Object.freeze({ body: '#FFC27A', key: '#D5561A' }), // 주황
  WHITE: Object.freeze({ body: '#ECEEF2', key: '#7A808A' }), // 흰색
  GREEN: Object.freeze({ body: '#A7E9A3', key: '#387F3D' }), // 초록 — 동빛 에코코 전용
  SAND: Object.freeze({ body: '#E8C39A', key: '#8C5E33' }), // 모래
})

// 그룹 키 → 표시 이름(범례용) + 팔레트
export const BOOTH_MARKER_GROUPS = Object.freeze({
  DAY_BOOTH: Object.freeze({ label: '주간 부스', palette: 'SKY' }),
  DAY_FOOD_TRUCK: Object.freeze({ label: '주간 푸드트럭', palette: 'MAGENTA' }),
  NIGHT_HUMANITIES: Object.freeze({ label: '문과대학', palette: 'VIOLET' }),
  NIGHT_LAW: Object.freeze({ label: '법과대학', palette: 'NAVY' }),
  NIGHT_BUDDHISM: Object.freeze({ label: '불교대학', palette: 'PINK' }),
  NIGHT_EDUCATION: Object.freeze({ label: '사범대학', palette: 'YELLOW' }),
  NIGHT_ADVANCED_CONVERGENCE: Object.freeze({ label: '첨단융합대학', palette: 'SKY' }),
  NIGHT_SOCIAL_SCIENCES: Object.freeze({ label: '사회과학대학', palette: 'CORAL' }),
  NIGHT_BUSINESS: Object.freeze({ label: '경영대학', palette: 'BLUE' }),
  NIGHT_BIOSYSTEMS: Object.freeze({ label: '바이오시스템대학', palette: 'TEAL' }),
  NIGHT_OPEN_MAJOR: Object.freeze({ label: '열린전공학부', palette: 'GOLD' }),
  NIGHT_FUTURE_CONVERGENCE: Object.freeze({ label: '미래융합대학', palette: 'MAGENTA' }),
  NIGHT_ENGINEERING: Object.freeze({ label: '공과대학', palette: 'ORANGE' }),
  NIGHT_CLUB: Object.freeze({ label: '동아리', palette: 'WHITE' }),
  ECO: Object.freeze({ label: '동빛 에코코', palette: 'GREEN' }),
  OTHER: Object.freeze({ label: '그 외', palette: 'SAND' }),
})

export const TIME_SLOT = Object.freeze({ DAY: 'DAY', NIGHT: 'NIGHT' })

// 'day' · 'DAY' · ' night ' → 'DAY' | 'NIGHT'. 그 밖의 값(undefined 포함)은 null.
// MapProvider의 listTimeOfDay는 소문자('day' | 'night'), 부스 목록 API의 time_slot은 대문자라 둘 다 받는다.
export function normalizeTimeSlot(value) {
  const slot = typeof value === 'string' ? value.trim().toUpperCase() : ''
  return slot === TIME_SLOT.DAY || slot === TIME_SLOT.NIGHT ? slot : null
}

// 부스 소속(단과대 코드 또는 'CLUB'). 지금은 프론트 표(boothAffiliations.js)를 본다 —
// 백엔드에 소속 필드가 생기면 이 함수만 그 필드를 읽게 바꾸면 된다.
export function getBoothAffiliation(booth) {
  return NIGHT_BOOTH_AFFILIATION[booth?.booth_id] ?? null
}

const foodTruckBoothIds = new Set(FOOD_TRUCK_BOOTH_IDS)

// place_type이 없는 옛 데이터(목데이터 등)는 부스로 친다 — 그래야 필드 하나 빠졌다고 전부 '그 외'가 되지 않는다.
function isBoothPlace(booth) {
  return (booth?.place_type ?? 'BOOTH') === 'BOOTH'
}

// 소속표에 없는 야간 부스는 개발 모드에서 한 번만 알린다(새 부스를 등록하고 표를 안 고친 경우).
const warnedBoothIds = new Set()
function warnMissingAffiliation(booth) {
  if (!import.meta.env?.DEV || warnedBoothIds.has(booth?.booth_id)) return
  warnedBoothIds.add(booth?.booth_id)
  console.warn(
    `[boothMarkerColors] 야간 부스 ${booth?.booth_id}(${booth?.name ?? '이름 없음'})의 소속이 ` +
      'constants/boothAffiliations.js에 없어서 "그 외" 색으로 표시합니다.'
  )
}

// 부스 한 곳이 어느 색 그룹인지. timeSlot은 지금 지도에 그리는 목록의 시간대('DAY' | 'NIGHT' — normalizeTimeSlot 결과).
// 검사 순서가 곧 우선순위다:
//   1) 동빛 에코코 — 시설로 등록돼도 에코코 색이 나와야 해서 시설 검사보다 먼저 본다
//   2) 시설(place_type ≠ 'BOOTH') — 포토부스·화장실 등. 등불을 받을 수 없는 곳이라 '그 외'
//   3) 주간 — 푸드트럭 / 나머지
//   4) 야간 — 소속표(단과대 · 동아리)
//   5) 어디에도 안 걸리면(시간대를 모르거나 소속표에 없는 야간 부스) '그 외'
export function getBoothMarkerGroup(booth, timeSlot) {
  if (booth?.category === 'ECO') return 'ECO'
  if (!isBoothPlace(booth)) return 'OTHER'

  const slot = normalizeTimeSlot(timeSlot)
  if (slot === TIME_SLOT.DAY) {
    return foodTruckBoothIds.has(booth?.booth_id) ? 'DAY_FOOD_TRUCK' : 'DAY_BOOTH'
  }
  if (slot === TIME_SLOT.NIGHT) {
    const affiliation = getBoothAffiliation(booth)
    if (affiliation && AFFILIATION[affiliation]) return `NIGHT_${affiliation}`
    warnMissingAffiliation(booth)
  }
  return 'OTHER'
}

// 그리는 쪽(BoothLantern)이 쓰는 값 한 묶음: { groupKey, label, paletteKey, body, key }
export function getBoothMarkerStyle(booth, timeSlot) {
  const groupKey = getBoothMarkerGroup(booth, timeSlot)
  const group = BOOTH_MARKER_GROUPS[groupKey]
  return { groupKey, label: group.label, paletteKey: group.palette, ...BOOTH_MARKER_PALETTE[group.palette] }
}

// 등불에 찍을 숫자. 등불(lantern)을 받을 수 있는 건 place_type이 'BOOTH'인 곳뿐이라(백엔드 등록 규칙)
// 시설은 null → 숫자 없는 빈 등불로 그린다. 부스는 0개여도 0을 돌려준다(바텀시트 카드도 0을 보여줘서 맞춤).
export function getBoothLanternCount(booth) {
  if (!isBoothPlace(booth)) return null
  const count = Number(booth?.lantern_count)
  return Number.isFinite(count) && count > 0 ? Math.floor(count) : 0
}
