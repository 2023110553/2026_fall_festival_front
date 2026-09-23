import {
  DEFAULT_FESTIVAL_DATE as SHARED_DEFAULT_FESTIVAL_DATE,
  FESTIVAL_DATE_OPTIONS,
  toShortDateLabel,
} from '../../../../constants/festivalDates'

// 축제 기간 3일 — API는 ISO(2026-09-29)로 주고받고, 화면에는 짧은 표기(9/29)로 보여준다.
// 날짜 값 자체는 constants/festivalDates.js 하나에서만 관리한다(백엔드 found_date 검증 기간과 동일해야 함).
// 이 파일은 관리자 분실물 화면이 쓰던 export 이름({ value, label } 배열 등)을 그대로 유지하기 위한 얇은 래퍼다.
export const FESTIVAL_DATES = FESTIVAL_DATE_OPTIONS

export const DEFAULT_FESTIVAL_DATE = SHARED_DEFAULT_FESTIVAL_DATE

export const isFestivalDate = (value) => FESTIVAL_DATES.some((d) => d.value === value)

// "2026-09-29" -> "9/29" (목록/상세의 날짜 태그 표기)
export const toDateLabel = (value) => {
  const matched = FESTIVAL_DATES.find((d) => d.value === value)
  if (matched) return matched.label
  // 축제 기간 밖의 날짜가 내려와도 태그가 비지 않도록
  return toShortDateLabel(value)
}
