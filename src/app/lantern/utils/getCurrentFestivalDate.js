import { getToday } from './getToday'
import { FESTIVAL_DATES } from '../../../constants/festivalDates'

// 오늘이 축제 시작 전이면 1일차로, 기간 중이면 실제 맞는 날짜로, 기간이 다 끝났으면 마지막 날로 취급.
// 축제 시작 전/종료 후에도 "나의 등불"이 어느 day에도 안 걸려서 확인 자체가 안 되는 문제를 막기 위한 보정 —
// 축제 기간 중엔 today가 그대로 정확히 일치하는 날짜를 반환하므로 실제 서비스 동작에는 영향 없다.
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
