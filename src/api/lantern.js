import { apiClient } from './client'

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
export const getLanternBoothOptions = () => apiClient.get('/api/booths/')
