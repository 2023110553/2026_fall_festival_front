// 시간대(낮/노을/밤)별 조명 프리셋 모음.
//
// 설계 의도(재원 요청, 2026-09-13):
//   "timeOfDay를 정하는 로직"과 "timeOfDay를 그리는 로직"을 분리한다.
//   - 정하는 로직: 지금은 MapShell 버튼 클릭으로 즉시 전환(개발 단계), 나중에는
//     실시간 시계 기반으로 day/sunset/night를 자동 계산하는 함수로 교체될 예정.
//     그 교체가 일어나도 "그리는 로직"(이 파일 + SceneEnvironment.jsx)은 손댈 필요가 없도록,
//     여기서는 오직 timeOfDay 문자열 하나만 받아서 프리셋을 반환하는 순수 데이터로만 관리한다.
//   - 그리는 로직: SceneEnvironment.jsx가 이 프리셋을 읽어서 실제 조명을 적용한다.
//
// 배경(하늘) 처리 히스토리(2026-09-13): drei <Sky>(물리 기반) → 커스텀 오로라 노이즈
// 셰이더 → 노이즈 없는 미니멀 그라디언트 셰이더까지 세 번 갈아엎었는데, 재원이 최종적으로
// "배경엔 색상 같은 거 아예 넣지 말고, 시간대별로 밝기 변화만 주자"고 정리함. 그래서
// 지금은 하늘/안개(배경) 요소를 전부 제거하고, ambientLight/directionalLight의 밝기
// (intensity)만 시간대별로 다르게 준다 — 조명 색상도 전부 흰색(#ffffff)으로 통일해서
// "배경/색감"이 아니라 순수하게 "밝기" 차이만 나게 했다.
//
// backgroundColor(2026-09-13 추가): 조명은 실제 지형/건물 메시에만 영향을 주고, 메시가
// 없는 빈 캔버스 영역(하늘이 있어야 할 자리)은 그동안 색이 하나도 없어서 항상 흰색
// 그대로였다 — 그래서 밤에도 건물만 어두워지고 배경은 계속 흰 상태로 남는 어색함이 있었음.
// "색상은 넣지 말고 밝기만"이라는 원칙을 배경에도 그대로 적용해서, 무채색(R=G=B, 색조 없음)
// 그레이스케일 한 가지 값으로만 배경을 채운다 — 이것도 "색상"이 아니라 "밝기"로 취급.
export const TIME_OF_DAY_PRESETS = {
  day: {
    backgroundColor: '#f5f5f5',
    ambientLight: { color: '#ffffff', intensity: 0.6 },
    directionalLight: {
      color: '#ffffff',
      intensity: 1.2,
      position: [100, 200, 100],
    },
  },

  sunset: {
    backgroundColor: '#9a9a9a',
    ambientLight: { color: '#ffffff', intensity: 0.42 },
    directionalLight: {
      color: '#ffffff',
      intensity: 0.85,
      position: [80, 35, -70],
    },
  },

  night: {
    // 축제는 밤에도 부스를 찾아다녀야 하니(등불 보기 등) 너무 어둡지 않게 —
    // 분위기는 밤이되 지형/부스가 눈에 보이는 수준으로만 어둡게.
    backgroundColor: '#1c1c1c',
    ambientLight: { color: '#ffffff', intensity: 0.26 },
    directionalLight: {
      color: '#ffffff',
      intensity: 0.45,
      position: [-60, 90, -40],
    },
  },
}

export function getTimeOfDayPreset(timeOfDay) {
  return TIME_OF_DAY_PRESETS[timeOfDay] ?? TIME_OF_DAY_PRESETS.day
}
