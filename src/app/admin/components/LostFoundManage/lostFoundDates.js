// 축제 기간 3일 — API는 ISO(2026-09-29)로 주고받고, 화면에는 짧은 표기(9/29)로 보여준다.
// found_date 검증(INVALID_FESTIVAL_DATE)이 이 3일로 고정이라 프론트도 여기서만 관리한다.
// TEMP: 로컬 테스트용 (원래 9/29~10/1) — 백엔드 found_date 검증(INVALID_FESTIVAL_DATE)도 같은 3일로 맞춰야 실제 제출이 됨
export const FESTIVAL_DATES = [
  { value: '2026-09-23', label: '9/23' },
  { value: '2026-09-24', label: '9/24' },
  { value: '2026-09-25', label: '9/25' },
]

export const DEFAULT_FESTIVAL_DATE = FESTIVAL_DATES[0].value

export const isFestivalDate = (value) => FESTIVAL_DATES.some((d) => d.value === value)

// "2026-09-29" -> "9/29" (목록/상세의 날짜 태그 표기)
export const toDateLabel = (value) => {
  const matched = FESTIVAL_DATES.find((d) => d.value === value)
  if (matched) return matched.label
  if (!value) return ''
  // 축제 기간 밖의 날짜가 내려와도 태그가 비지 않도록
  const [, month, day] = value.split('-')
  return month && day ? `${Number(month)}/${Number(day)}` : value
}
