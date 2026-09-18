import boothResponses from './boothResponses.json'
import { MAP_ZONES } from '../../../constants/zones'

// 2026-09-18: 백엔드(세호) "장소 검색" API 명세서 기반으로 만든 mock 연결 어댑터.
// boothResponses.json 자체는 백엔드 응답 예시를 그대로 넣어둔 파일이라
// useMapZoneBooths가 기대하는 모양(res.data가 배열)과 다르고, zone도
// MapProvider가 들고 있는 값(zoneId)과 형태가 달라서 이 파일에서 변환해준다.

// MapProvider.selectedDate(29 | 30 | 1, 숫자만) → boothResponses.json의 festival_date 문자열로 변환
// 10월 1일만 월이 다름. 연도가 바뀌면 이 상수만 고치면 됨.
const FESTIVAL_YEAR_MONTH = '2026-09'
function toFestivalDate(selectedDate) {
  if (selectedDate === 1) return '2026-10-01'
  const day = String(selectedDate ?? 29).padStart(2, '0')
  return `${FESTIVAL_YEAR_MONTH}-${day}`
}

// timeSlot('day'|'night', 부스 목록 주간/야간 토글 — BoothListPanel 로컬 상태)
//   → boothResponses.json의 time_slot('DAY'|'NIGHT')
function toApiTimeSlot(timeSlot) {
  return timeSlot === 'night' ? 'NIGHT' : 'DAY'
}

// zoneId('zone1'...) → constants/zones.js에 이미 있는 한글 label 재사용 (매핑 중복 정의 안 함)
function getZoneLabel(zoneId) {
  return MAP_ZONES.find((zone) => zone.id === zoneId)?.label
}

function pickMockResponse(festivalDate, timeSlot) {
  return (
    boothResponses.find(
      (res) => res.data.festival_date === festivalDate && res.data.time_slot === timeSlot
    ) ?? boothResponses[0] // 매칭 실패 시 첫 번째 응답으로 폴백(개발 중 안전장치)
  )
}

// useMapZoneBooths가 기대하는 axios 응답 모양({ data: 배열 })을 그대로 흉내내서 반환.
export function getMockZoneBooths(zoneId, { selectedDate, timeSlot } = {}) {
  const mock = pickMockResponse(toFestivalDate(selectedDate), toApiTimeSlot(timeSlot))
  const zoneLabel = getZoneLabel(zoneId)
  const booths = zoneLabel
    ? mock.data.booths.filter((booth) => booth.zone === zoneLabel)
    : mock.data.booths

  return Promise.resolve({ data: booths })
}
