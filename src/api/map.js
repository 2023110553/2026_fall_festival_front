import { apiClient } from './client'
import { getMockZoneBooths } from '../app/map/mocks/boothMockAdapter'

// 지도 도메인 api 함수 모음
// 백엔드 스펙: campus-map/map-backend-api-requirements.md 참고

// .env(로컬, gitignore됨)에 VITE_USE_BOOTH_MOCK=true 넣으면 실제 API 대신
// boothResponses.json(세호님 "장소 검색" API 명세서 기반 mock)으로 응답한다.
// 백엔드 미기동 상태에서 지도 화면 UI(부스 카드/바텀시트 등) 확인용 — 각자 로컬에서만 켜고 끄는 값.
const USE_BOOTH_MOCK = import.meta.env.VITE_USE_BOOTH_MOCK === 'true'

// 구역별 부스 목록 조회 (검색용 필드 포함: 부스명/학과명/카테고리) — 지도 메인 진입 시 1회 호출
// mapState: { selectedDate, timeSlot } — 지금은 mock 모드에서만 사용됨.
// 실제 API가 날짜/시간대를 쿼리 파라미터로 받을지는 아직 미확정(세호님 확인 필요)이라
// apiClient.get 쪽엔 아직 안 실어보냄.
export const getZoneBooths = (zoneId, mapState) =>
  USE_BOOTH_MOCK
    ? getMockZoneBooths(zoneId, mapState)
    : apiClient.get(`/api/map/zones/${zoneId}/booths`)

// 축제 시간대(주간/야간) 및 날짜 탭 설정 조회
export const getFestivalSchedule = () => apiClient.get('/api/map/schedule')

// 부스 상세 (바텀시트/장소상세 공용)
export const getBoothDetail = (boothId) => apiClient.get(`/api/booths/${boothId}/`)
