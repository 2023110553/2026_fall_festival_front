import { apiClient } from './client'
// 장소 목록: 생략한 날짜·시간대는 서버가 기본값을 결정한다.
export const getBooths = ({ date, timeSlot, category } = {}, { signal } = {}) =>
  apiClient.get('/api/booths/', {
    params: { date: date || undefined, time_slot: timeSlot?.toUpperCase() || undefined, category: category || undefined },
    signal,
  })

// 부스 상세 (바텀시트/장소상세 공용)
export const getBoothDetail = (boothId) => apiClient.get(`/api/booths/${boothId}/`)

// 장소 검색: 날짜를 지정한 경우에만 시간대 필터를 적용한다.
export const searchBooths = ({ keyword, date, timeSlot }, { signal } = {}) =>
  apiClient.get('/api/booths/search/', {
    params: { keyword: keyword.trim(), ...(date ? { date, time_slot: timeSlot } : {}) },
    signal,
  })
