import { apiClient } from './client'
// 장소 목록: 생략한 날짜·시간대는 서버가 기본값을 결정한다.
export const getBooths = ({ date, timeSlot, category } = {}, { signal } = {}) =>
  apiClient.get('/api/booths/', {
    params: { date: date || undefined, time_slot: timeSlot?.toUpperCase() || undefined, category: category || undefined },
    signal,
  })

// 부스 상세 (바텀시트/장소상세 공용)
export const getBoothDetail = (boothId) => apiClient.get(`/api/booths/${boothId}/`)

// 장소 검색은 날짜·시간대·구역에 관계없이 검색어만 전달한다.
export const searchBooths = ({ keyword }, { signal } = {}) =>
  apiClient.get('/api/booths/search/', {
    params: { keyword: keyword.trim() },
    signal,
  })
