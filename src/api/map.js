import { apiClient } from './client'

// 지도 도메인 api 함수 모음
// 백엔드 스펙: campus-map/map-backend-api-requirements.md 참고

// 구역별 부스 목록 조회 (검색용 필드 포함: 부스명/학과명/카테고리) — 지도 메인 진입 시 1회 호출
export const getZoneBooths = (zoneId) => apiClient.get(`/api/map/zones/${zoneId}/booths`)

// 축제 시간대(주간/야간) 및 날짜 탭 설정 조회
export const getFestivalSchedule = () => apiClient.get('/api/map/schedule')

// 부스 상세 (바텀시트/장소상세 공용)
export const getBoothDetail = (boothId) => apiClient.get(`/api/map/booths/${boothId}`)
