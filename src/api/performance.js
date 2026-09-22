import { apiClient } from './client'

// 공연 타임테이블 — date 생략 시 서버가 "오늘(축제 기간 내)" 또는 축제 시작일로 기본값을 정한다.
export const getPerformances = (date, { signal } = {}) =>
  apiClient.get('/api/performances/', { params: { date }, signal })

export const getPerformanceDetail = (performanceId, { signal } = {}) =>
  apiClient.get(`/api/performances/${performanceId}/`, { signal })

// 지금 공연 중(없으면 1시간 이내 시작하는 공연까지) — data.server_time을 useServerTime 기준 시각으로 쓴다.
export const getNowPerformances = ({ signal } = {}) =>
  apiClient.get('/api/performances/now/', { signal })
