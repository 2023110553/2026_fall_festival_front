// 3D 구역별 지도 — final-plan-team-share.md v3에서 확정된 3개 구역
// 2026-09-16: 학림관을 zone4로 추가(이슈 #33). 기존 3구역과는 별개의 독립 구역(학림관 건물 + 앞 도로 한 블록)이며,
// 구역 버튼(MapShell)은 이 배열을 그대로 돌기 때문에 여기 한 줄만 추가하면 UI에도 자동으로 노출된다.
export const MAP_ZONES = [
  { id: 'zone1', label: '경영관·혜화관 거리' },
  { id: 'zone2', label: '팔정도' },
  { id: 'zone3', label: '만해광장 + 후문쪽 거리' },
  { id: 'zone4', label: '학림관' },
]
