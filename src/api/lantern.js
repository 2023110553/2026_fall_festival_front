import { apiClient } from './client'

// 등불 관련 api — "달기" 플로우 + 부스별 등불 목록(등불 보기 탭)
export const getBoothLanterns = (boothId, { mine = false, date, page = 0, size = 20, signal } = {}) =>
  apiClient.get('/api/lanterns/', {
    params: { booth_id: boothId, mine, date: date || undefined, page, size },
    signal,
    // 공개 목록은 토큰 만료·재발급 실패 시 비로그인으로 재시도 (백엔드가 잘못된 토큰이면 401을 줌)
    optionalUserAuth: !mine,
  })

// festival_date는 body에 없음 — 서버 시간 기준 자동 설정
export const createLantern = ({ boothId, nickname, message }) =>
  apiClient.post('/api/lanterns/', { booth_id: Number(boothId), nickname, message })

// booth_id, festival_date는 수정 불가 — nickname/message만 전달
export const updateLantern = (lanternId, { nickname, message }) =>
  apiClient.patch(`/api/lanterns/${lanternId}/`, { nickname, message })

export const deleteLantern = (lanternId) => apiClient.delete(`/api/lanterns/${lanternId}/`)

// 신고 — 성공 시 code: 'LANTERN_REPORT_SUCCESS', 중복 신고면 409 + code: 'ALREADY_REPORTED'
export const reportLantern = (lanternId, reason) =>
  apiClient.post(`/api/lanterns/${lanternId}/reports/`, { reason })

// mine=true면 본인 등불만(삭제 포함 + status 필드), booth_id/date로 필터, page는 0부터
export const getLanterns = ({ mine, boothId, date, page, size } = {}) =>
  apiClient.get('/api/lanterns/', {
    params: { mine, booth_id: boothId !== undefined ? Number(boothId) : undefined, date, page, size },
  })

export const getLantern = (lanternId) => apiClient.get(`/api/lanterns/${lanternId}/`)

// 등불 달기 부스 드롭다운 + 서버 시각(server_time) 동기화용
// 파라미터 미지정 시 서버가 오늘 날짜 + 현재 시각 기준 주/야간으로 판정해서
// "당일 운영 부스만" 내려주므로 그대로 둔다.
// 공개 API라 로그인 정보 오류 시 비로그인으로 재시도
export const getLanternBoothOptions = () => apiClient.get('/api/booths/', { optionalUserAuth: true })