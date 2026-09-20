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
// 하늘/안개(배경) 요소는 전부 제거하고 조명 밝기만 시간대별로 다르게 준다 — 조명 색상은
// 전부 흰색/무채색(R=G=B)으로 통일해서 "색감"이 아니라 순수하게 "밝기" 차이만 나게 한다.
//
// backgroundColor(2026-09-13 추가): 조명은 메시에만 영향을 주고 빈 캔버스 영역(하늘 자리)은
// 항상 흰색이어서, 무채색 그레이스케일 한 가지 값으로 배경을 채워 밝기를 맞춘다.
// 2026-09-16부터는 이 값이 캔버스 CSS 배경으로 들어가서(SceneEnvironment.jsx 주석 참고) 적은 값이
// 화면에 그대로 보인다 — 블룸/톤매핑을 타지 않으니 "가시성 좋은 단색"으로 튜닝할 때 이 숫자만 바꾸면 됨.
//
// 2026-09-16 조명 구조 개편(이슈 #37, 재원 피드백 "낮은 너무 쨍하고 밤은 너무 어둡다"):
//   원인이 두 가지였다.
//   (1) MapCanvas의 <EffectComposer>(블룸용)가 마운트되는 순간 renderer.toneMapping을
//       NoToneMapping으로 바꿔 버려서(라이브러리 동작), 그동안 씬이 톤매핑 없이 그려지고 있었음
//       → 밝은 부분은 딱 잘리고(쨍함) 어두운 부분은 그대로 눌림. MapCanvas에 <ToneMapping> 효과를
//       파이프라인 끝에 추가해서 해결(ACES Filmic).
//   (2) three r155+는 물리 기반 조명 단위라 예전 값(ambient 0.6 / directional 1.2)이 너무 약해서
//       텍스처가 전부 탁하게 보였음. ambientLight(균일광) 대신 hemisphereLight(위=밝고 아래=어두운
//       반구광)로 바꿔 지붕/벽/바닥의 밝기 차이를 만들고, 무채색 그라디언트 환경광(environment,
//       IBL)을 추가해 금속·유리·창문에 반사가 생기게 했다. 환경광은 런타임에 생성(HDR 다운로드 없음).
//   값은 실제 zone1.glb를 헤드리스 크롬에서 렌더해 비교한 뒤 재원이 고른 후보(낮 D1: 부드럽고 밝게,
//   밤 N1: 분위기 우선)로 확정. 튜닝은 이 파일 숫자만 바꾸면 된다.
//
// 각 항목의 뜻:
//   hemisphereLight  — skyColor(위쪽), groundColor(아래쪽) 두 색을 섞는 반구광. 둘 다 무채색.
//   directionalLight — 태양(그림자를 만드는 유일한 광원). position은 그림자 방향을 정한다.
//   environment      — 반사/간접광용 그라디언트 환경맵(topColor=천정, bottomColor=지면), intensity로 세기.
//                      배경으로 그려지지는 않는다(배경은 backgroundColor 단색 그대로).
export const TIME_OF_DAY_PRESETS = {
  day: {
    backgroundColor: '#f5f5f5',
    hemisphereLight: { skyColor: '#ffffff', groundColor: '#8a8a8a', intensity: 0.5 },
    directionalLight: {
      color: '#ffffff',
      intensity: 2.0,
      position: [100, 200, 100],
    },
    environment: { topColor: '#ffffff', bottomColor: '#6f6f6f', intensity: 0.6 },
  },

  sunset: {
    backgroundColor: '#9a9a9a',
    hemisphereLight: { skyColor: '#ffffff', groundColor: '#7a7a7a', intensity: 0.4 },
    directionalLight: {
      color: '#ffffff',
      intensity: 1.4,
      position: [80, 35, -70], // 낮게 뜬 해 → 긴 그림자
    },
    environment: { topColor: '#d8d8d8', bottomColor: '#4a4a4a', intensity: 0.45 },
  },

  night: {
    // 축제는 밤에도 부스를 찾아다녀야 하니(등불 보기 등) 너무 어둡지 않게 —
    // 분위기는 밤이되 지형/부스가 눈에 보이는 수준으로만 어둡게. (2026-09-16: 재원이 "분위기 우선" N1 선택)
    backgroundColor: '#1c1c1c',
    hemisphereLight: { skyColor: '#ffffff', groundColor: '#5a5a5a', intensity: 0.35 },
    directionalLight: {
      color: '#ffffff',
      intensity: 0.6,
      position: [-60, 90, -40],
    },
    environment: { topColor: '#a0a0a0', bottomColor: '#2c2c2c', intensity: 0.3 },
  },
}

export function getTimeOfDayPreset(timeOfDay) {
  return TIME_OF_DAY_PRESETS[timeOfDay] ?? TIME_OF_DAY_PRESETS.day
}
