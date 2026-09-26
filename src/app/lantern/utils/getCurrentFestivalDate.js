import { getToday } from './getToday'
import { FESTIVAL_DATES } from '../../../constants/festivalDates'

// 오늘이 축제 시작 전이면 1일차로, 기간 중이면 실제 맞는 날짜로, 기간이 다 끝났으면 마지막 날로 취급.
// 축제 시작 전/종료 후에도 "나의 등불"이 어느 day에도 안 걸려서 확인 자체가 안 되는 문제를 막기 위한 보정 —
export function getCurrentFestivalDate() {
  const today = getToday()
  return FESTIVAL_DATES.find((date) => date >= today) ?? FESTIVAL_DATES[FESTIVAL_DATES.length - 1]
}

// 오늘(getCurrentFestivalDate 기준) 날짜에 해당하는 등불 개수 — 등불 작성 3개 제한은
// 전체 누적이 아니라 하루 단위로 세야 하므로, 이 카운트를 lanternCount로 넘겨써야 한다.
export function getTodayLanternCount(lanterns) {
  const today = getCurrentFestivalDate()
  return lanterns.filter((l) => l.festivalDate === today).length
}

// 오늘 이미 활성 등불을 단 부스 ID 목록 — 하나의 부스엔 등불 하나만 달 수 있어서
// 부스 드롭다운에서 미리 막아주는 용도(삭제한 부스는 다시 선택 가능하므로 active만 카운트)
export function getTodayUsedBoothIds(lanterns) {
  const today = getCurrentFestivalDate()
  return lanterns
    .filter((l) => l.festivalDate === today && l.status === 'active')
    .map((l) => l.boothId)
}
