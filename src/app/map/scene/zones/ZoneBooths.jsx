import BoothMarker from './BoothMarker'

// 구역 부스 목록(JSON의 places[]) → BoothMarker 배치.
//
// 2026-09-19: 원래 Zone1Scene 안에 있던 "places.map → <BoothMarker …/>" 블록을 그대로 떼어낸 것.
// 팔정도/만해광장/학림관에도 부스 목데이터(zone2/3/4-booths.sample.json)를 붙이면서 같은 코드가
// 네 파일에 복사될 상황이라 한 곳으로 모았다. 구역 씬은 지형 glb만 로드하고, 부스는 이 컴포넌트에
// places 배열을 넘겨서 그린다 — 나중에 백엔드가 GET /zones/{zoneId}/places로 좌표를 내려주면
// 각 씬의 `import boothData from './zoneN-booths.sample.json'` 자리만 API 응답으로 바꾸면 된다.
//
// place 스키마(각 zoneN-booths.sample.json 상단 _comment 참고):
//   - id: BoothMarker key + onBoothClick(boothId)에 넘기는 값
//   - coordinates: { x, y, z, rotation } — Three.js 씬 좌표(m), rotation은 도 단위 Y축 회전
//   - name / category / lantern_count — 라벨(PinLabel), 카테고리 색, 등불 개수(밝기 단계 자동 계산)
//
// props:
//   - places: 부스 배열(없으면 아무것도 안 그림)
//   - brightnessLevel: (선택) 밝기 단계 override — null이면 BoothMarker가 lantern_count로 자동 계산
//     (BoothMarker.jsx 19번 항목). MapProvider.boothBrightnessPreview가 MapCanvas → 씬 → 여기로 내려온다.
//   - onBoothClick(boothId): 부스 클릭 콜백(MapShell이 바텀시트 열기로 연결)
export default function ZoneBooths({ places = [], brightnessLevel = null, onBoothClick }) {
  return places.map((place) => (
    <BoothMarker
      key={place.id}
      position={[place.coordinates.x, place.coordinates.y, place.coordinates.z]}
      rotationY={(place.coordinates.rotation * Math.PI) / 180}
      label={place.name}
      category={place.category}
      lanternCount={place.lantern_count}
      brightnessLevel={brightnessLevel}
      onClick={() => onBoothClick?.(place.id)}
    />
  ))
}
