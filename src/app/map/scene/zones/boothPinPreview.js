// 3D 마커(BoothPin) 값 조정용 임시 스위치 — 2026-09-20 추가.
//
// 왜 있나: 마커의 크기/각도/높이 같은 값은 "숫자를 바꿔보고 눈으로 확인"하는 수밖에 없는데,
// 그때마다 코드를 고치고 저장하고 다시 보는 건 느리다. URL 쿼리로만 바꿀 수 있게 해두면
// 브라우저 주소창에서 바로 비교할 수 있다. MapProvider의 boothBrightnessPreview와 같은 성격의
// 개발용 스위치이고(앱 UI에는 노출하지 않는다), 값이 확정되면 BoothPin.jsx의 기본값으로 옮기고
// 이 파일과 ZoneBooths의 호출부를 같이 지우면 된다.
//
// 사용 예:
//   ?marker=label     기존 <Html> PinLabel만 (3D 핀 끄기 — 비교용)
//   ?marker=both      3D 핀 + 기존 라벨 같이
//   ?pinVariant=hole  레퍼런스처럼 가운데가 뚫린 모양(등불 개수는 안 보임)
//   ?pinScale=3       핀 크게
//   ?pinY=8           더 높이 띄우기
//   ?pinTilt=0        핀을 꼿꼿이 세우기(1이면 카메라 정면)
//   ?pinTop=1         건물/나무에 안 가려지게 (핀끼리 앞뒤는 깨짐 — BoothPin.jsx 5번 항목)
//   ?pinFixed=0       화면상 크기 고정 끄기(줌하면 같이 커지고 작아짐)
//   ?pinAnchor=1      바닥에 그림자 + 카테고리 링 깔기(BoothPin.jsx 7번 항목)
//
// 모듈 로드 시 한 번만 읽는다. 값을 바꾸려면 새로고침하면 된다 — 렌더마다 읽으면
// location 접근 비용만 늘고 얻는 게 없다.
const params =
  typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)

function num(key, fallback) {
  const raw = params.get(key)
  if (raw === null) return fallback
  const value = Number(raw)
  return Number.isFinite(value) ? value : fallback
}

function bool(key, fallback) {
  const raw = params.get(key)
  if (raw === null) return fallback
  return raw === '1' || raw === 'true'
}

// 'pin3d'(기본) | 'label'(기존 Html 라벨) | 'both'
const markerStyle = ['pin3d', 'label', 'both'].includes(params.get('marker'))
  ? params.get('marker')
  : 'pin3d'

export const BOOTH_PIN_PREVIEW = {
  markerStyle,
  showPin: markerStyle !== 'label',
  showLabel: markerStyle !== 'pin3d',
  pin: {
    variant: params.get('pinVariant') === 'hole' ? 'hole' : 'face',
    scale: num('pinScale', undefined),
    hoverHeight: num('pinY', undefined),
    tiltRatio: num('pinTilt', undefined),
    alwaysOnTop: bool('pinTop', undefined),
    constantSize: bool('pinFixed', undefined),
    showAnchor: bool('pinAnchor', undefined),
  },
}

// undefined인 키는 빼준다 — 그래야 BoothPin의 기본 매개변수 값이 그대로 살아난다
// (undefined를 그냥 넘기면 기본값이 적용되긴 하지만, props에 undefined가 잔뜩 붙는 게 디버깅할 때 헷갈린다).
export const BOOTH_PIN_PROPS = Object.fromEntries(
  Object.entries(BOOTH_PIN_PREVIEW.pin).filter(([, value]) => value !== undefined)
)
