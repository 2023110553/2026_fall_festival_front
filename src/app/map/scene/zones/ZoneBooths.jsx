import BoothMarker from './BoothMarker'

// 구역 부스 목록(JSON의 booths[]) → BoothMarker 배치.
//
// 2026-09-19: 원래 Zone1Scene 안에 있던 "places.map → <BoothMarker …/>" 블록을 떼어내 공통화한
// 컴포넌트. 팔정도/만해광장/학림관에도 부스 목데이터(zone2/3/4-booths.sample.json)를 붙이면서
// 같은 코드가 네 파일에 복사될 상황이라 한 곳으로 모았다.
//
// 2026-09-19(2차): booth 스키마를 세호님 '장소 목록 조회' API(GET /api/booths/) 응답과
// 1:1로 맞췄다. 예전에는 3D 배치 전용으로 별도 coordinates{x,y,z,rotation} 필드를 썼는데,
// 명세에 "map_x/map_y/map_elevation/rotation은 FE 3D 씬 좌표를 무변환으로 반환한다"고
// 확정되면서(map_x=씬 x, map_y=씬 z, map_elevation=씬 y, rotation=y축 회전) 그 필드들이 곧
// 3D 좌표 그 자체가 됐다. 그래서 이제 coordinates 없이 map_x/map_y/map_elevation/rotation을
// 바로 BoothMarker position/rotationY에 꽂는다 — 나중에 백엔드가 GET /api/booths/ 응답을
// 내려주기 시작하면 zoneN-booths.sample.json을 그 응답의 data.booths로 그대로 바꿔 끼우면
// 끝난다(필드명이 이미 같아서 매핑 코드가 필요 없음).
//
// booth 스키마(각 zoneN-booths.sample.json 상단 _comment 참고, 세호님 API 명세와 동일):
//   - booth_id: BoothMarker key + onBoothClick(boothId)에 넘기는 값
//   - map_x / map_y / map_elevation / rotation: Three.js 씬 좌표(m) — map_x=씬 x, map_y=씬 z,
//     map_elevation=씬 y(높이), rotation은 도 단위 Y축 회전
//   - name / category / lantern_count — 라벨(PinLabel), 카테고리 색, 등불 개수(밝기 단계 자동 계산)
//
// props:
//   - booths: 부스 배열(없으면 아무것도 안 그림)
//   - brightnessLevel: (선택) 밝기 단계 override — null이면 BoothMarker가 lantern_count로 자동 계산
//     (BoothMarker.jsx 19번 항목). MapProvider.boothBrightnessPreview가 MapCanvas → 씬 → 여기로 내려온다.
//   - onBoothClick(boothId): 부스 클릭 콜백(MapShell이 바텀시트 열기로 연결)
export default function ZoneBooths({ booths = [], brightnessLevel = null, onBoothClick }) {
  return booths.map((booth) => (
    <BoothMarker
      key={booth.booth_id}
      position={[booth.map_x, booth.map_elevation, booth.map_y]}
      rotationY={(booth.rotation * Math.PI) / 180}
      label={booth.name}
      category={booth.category}
      lanternCount={booth.lantern_count}
      brightnessLevel={brightnessLevel}
      onClick={() => onBoothClick?.(booth.booth_id)}
    />
  ))
}
