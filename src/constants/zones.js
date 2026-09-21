// 3D 구역별 지도 — final-plan-team-share.md v3에서 확정된 3개 구역
// 2026-09-16: 학림관을 zone4로 추가(이슈 #33). 기존 3구역과는 별개의 독립 구역(학림관 건물 + 앞 도로 한 블록)이며,
// 구역 선택 UI(PlaceSelector)는 이 배열을 그대로 돌기 때문에 여기 한 줄만 추가하면 UI에도 자동으로 노출된다.
// 2026-09-19: zone3 씬 연결(zone3.glb)에 맞춰 버튼 라벨을 '만해광장 + 후문쪽 거리' → '만해광장'으로 줄임.
//   구역의 공식 범위는 여전히 "만해광장 + 후문쪽 거리"(final-plan-team-share.md)이고, 후문쪽 거리는
//   모델링 추가 후 같은 zone3.glb 재-export로 반영 예정 — 그때 라벨을 되돌릴지는 팀에서 결정.
//   아직 씬이 준비되지 않은 구역은 comingSoon: true를 붙이면 PlaceSelector에서 비활성화(지도 준비 중)로 표시된다.
// 2026-09-20: 원흥관을 zone5로 추가. 팔정도에서 법학관 쪽으로 올라간 위치라 기존 네 구역 어디에도
//   붙지 않아 별도 구역으로 팠다. 씬에는 원흥관 두 동 + 맞은편 본관 + 그 사이 골목이 들어 있다.
// 2026-09-20(2차): zone1 라벨을 '경영관·혜화관 거리' → '혜화관'으로 줄임(재원 요청, 토글이 길어서).
//   ※ 여기 label은 단순 표시용이 아니다 — mocks/boothMockAdapter.js가 이 문자열과 booth.zone을
//     문자열 비교해서 부스 목록을 거른다(getZoneLabel → booth.zone === zoneLabel). 그래서 라벨을
//     바꿀 때는 mocks/boothResponses.json의 zone 값도 같이 바꿔야 목록이 비지 않는다.
//     백엔드 GET /api/booths/가 붙으면 zoneId로 조회하게 되므로 이 결합은 그때 사라진다.
export const MAP_ZONES = [
  { id: 'zone1', label: '혜화관' },
  { id: 'zone2', label: '팔정도' },
  { id: 'zone3', label: '만해광장' },
  { id: 'zone4', label: '학림관' },
  { id: 'zone5', label: '원흥관' },
]
