// 홈 "현재 인기" 카드의 지도 미리보기 이미지 — 구역 id(constants/zones.js MAP_ZONES) ↔ 렌더 이미지.
// 원본은 3D 지도 씬 캡처(1190×700 PNG, 장당 ~750KB)를 카드 크기(343×192)의 3배(1029×576)로 잘라
// WebP로 변환한 것(장당 25~37KB). 구역이 늘면 zones.js에 추가한 id로 여기에도 한 줄 추가하면 된다.
import zone1 from './zone1.webp'
import zone2 from './zone2.webp'
import zone3 from './zone3.webp'
import zone5 from './zone5.webp'

// 2026-09-23: 학림관(zone4) 제거 — zone4.webp도 함께 삭제했다. 원흥관은 zone5 파일명을 그대로 둔다.
export const ZONE_PREVIEW_IMAGES = {
  zone1, // 혜화관
  zone2, // 팔정도
  zone3, // 만해광장
  zone5, // 원흥관
}

// 등불이 아직 하나도 없을 때(축제 전 등)·조회 실패 시 보여줄 기본 구역 — 메인 무대가 있는 팔정도.
export const DEFAULT_PREVIEW_ZONE_ID = 'zone2'
