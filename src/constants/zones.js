// 3D 구역별 지도 — final-plan-team-share.md v3에서 확정된 3개 구역
// 2026-09-16: 학림관을 zone4로 추가(이슈 #33). 기존 3구역과는 별개의 독립 구역(학림관 건물 + 앞 도로 한 블록)이며,
// 구역 선택 UI(PlaceSelector)는 이 배열을 그대로 돌기 때문에 여기 한 줄만 추가하면 UI에도 자동으로 노출된다.
// 2026-09-19: zone3 씬 연결(zone3.glb)에 맞춰 버튼 라벨을 '만해광장 + 후문쪽 거리' → '만해광장'으로 줄임.
//   구역의 공식 범위는 여전히 "만해광장 + 후문쪽 거리"(final-plan-team-share.md)이고, 후문쪽 거리는
//   모델링 추가 후 같은 zone3.glb 재-export로 반영 예정 — 그때 라벨을 되돌릴지는 팀에서 결정.
//   아직 씬이 준비되지 않은 구역은 comingSoon: true를 붙이면 PlaceSelector에서 비활성화(지도 준비 중)로 표시된다.
export const MAP_ZONES = [
  { id: 'zone1', label: '경영관·혜화관 거리' },
  { id: 'zone2', label: '팔정도' },
  { id: 'zone3', label: '만해광장' },
  { id: 'zone4', label: '학림관' },
]
