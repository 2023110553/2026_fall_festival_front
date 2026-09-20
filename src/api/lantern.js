import { apiClient } from './client'
import boothResponses from '../app/map/mocks/boothResponses.json'
import { getCurrentFestivalDate } from '../app/lantern/utils/getCurrentFestivalDate'

// ============================================================================
// ⚠️ CHAE TEMP MOCK — 부스 목록(GET /api/booths/) 백엔드 아직 미기동이라 임시로
// map팀 boothResponses.json을 대신 물려놓은 상태. 백엔드 주소 받으면 이 함수
// 삭제하고 getLanternBoothOptions를 실제 axios 호출로 되돌릴 것. (검색: chae)
// ============================================================================
function chaeMockGetBoothResponse() {
  const festivalDate = getCurrentFestivalDate()
  const now = new Date()
  const timeSlot = now.getHours() < 16 || (now.getHours() === 16 && now.getMinutes() <= 30) ? 'DAY' : 'NIGHT'

  const matched = boothResponses.find(
    (res) => res.data.festival_date === festivalDate && res.data.time_slot === timeSlot
  )
  return Promise.resolve({ data: matched ?? boothResponses[0] })
}
// ============================================================================

// festival_date는 body에 없음 — 서버 시간 기준 자동 설정
export const createLantern = ({ boothId, nickname, message }) =>
  apiClient.post('/api/lanterns/', { booth_id: Number(boothId), nickname, message })

// booth_id, festival_date는 수정 불가 — nickname/message만 전달
export const updateLantern = (lanternId, { nickname, message }) =>
  apiClient.patch(`/api/lanterns/${lanternId}/`, { nickname, message })

export const deleteLantern = (lanternId) => apiClient.delete(`/api/lanterns/${lanternId}/`)

// mine=true면 본인 등불만(삭제 포함 + status 필드), booth_id/date로 필터, page는 0부터
export const getLanterns = ({ mine, boothId, date, page, size } = {}) =>
  apiClient.get('/api/lanterns/', {
    params: { mine, booth_id: boothId !== undefined ? Number(boothId) : undefined, date, page, size },
  })

export const getLantern = (lanternId) => apiClient.get(`/api/lanterns/${lanternId}/`)

// 등불 달기 부스 선택 드롭다운 전용
// 파라미터 미지정 시 서버가 오늘 날짜 + 현재 시각 기준 주/야간으로 판정해서
// "당일 운영 부스만" 내려주므로 그대로 둔다.
export const getLanternBoothOptions = () => chaeMockGetBoothResponse() // CHAE TEMP MOCK
// export const getLanternBoothOptions = () => apiClient.get('/api/booths/') // ⚠️ CHAE TEMP MOCK 해제 시 이 줄로 교체

// 등불 달기 성공 시 발급되는 쿠폰 스크래치/사용 — 쿠폰팀 소관, 인터페이스만 유지
export const getMyCoupon = () => apiClient.get('/api/coupons/me')
export const useCoupon = (couponId, code) => apiClient.post(`/api/coupons/${couponId}/use`, { code })
