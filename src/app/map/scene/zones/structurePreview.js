// 구조물(푸드트럭·차양막) 확인용 임시 스위치 — 2026-09-26 추가.
//
// 왜 있나: 푸드트럭과 차양막은 placements 항목의 structure 값을 보고 그린다. 그런데 그 값은
// 백엔드가 내려주는 것이라, 데이터가 들어가기 전에는 지도를 아무리 열어봐도 전부 기존 천막으로만
// 보인다 — 코드를 머지하면서 눈으로 확인할 방법이 없다(PR 리뷰 지적).
// 그래서 URL 쿼리로 "이 booth_id는 트럭으로 그려봐"라고 덮어쓸 수 있게 해둔다.
// boothPinPreview.js(마커 값 조정용 스위치)와 같은 성격의 개발용 장치이고, 앱 UI에는 노출하지 않는다.
//
// 사용 예:
//   ?truck=42            booth_id 42를 푸드트럭으로
//   ?truck=42,43,44      여러 개
//   ?market=41           booth_id 41을 차양막으로(기본 21×12m)
//   ?market=41:24x14     크기까지 지정(가로×세로, m)
//
// 쿼리가 없으면 빈 객체라 실제 서비스 동작에는 영향이 없다.
// 백엔드가 structure를 내려주기 시작하면 이 파일과 boothTents.js의 호출부를 같이 지우면 된다.
//
// 모듈 로드 시 한 번만 읽는다 — 값을 바꾸려면 새로고침하면 된다.
const params =
  typeof window === 'undefined' ? new URLSearchParams() : new URLSearchParams(window.location.search)

// 양수만 통과시킨다. Number('')가 0이라서 "?truck=" 같은 빈 값이 booth_id 0으로 잡히고,
// "41:xxx"의 'xxx'.split('x')도 빈 문자열이 나와서 크기가 0이 된다 — 둘 다 걸러야 한다.
function positive(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return null
  const value = Number(raw)
  return Number.isFinite(value) && value > 0 ? value : null
}

// "41:24x14" 또는 "41" → [booth_id, { width, depth }]
function parseEntry(raw) {
  const [idPart, sizePart] = raw.split(':')
  const boothId = positive(idPart)
  if (boothId === null) return null
  const size = {}
  if (sizePart) {
    const [w, d] = sizePart.toLowerCase().split('x')
    const width = positive(w)
    const depth = positive(d)
    if (width !== null) size.width = width
    if (depth !== null) size.depth = depth
  }
  return [boothId, size]
}

function collect(key, structure) {
  const raw = params.get(key)
  if (!raw) return []
  return raw
    .split(',')
    .map((part) => parseEntry(part.trim()))
    .filter(Boolean)
    .map(([boothId, size]) => [boothId, { structure, ...size }])
}

// { [booth_id]: { structure, width?, depth? } }
export const STRUCTURE_PREVIEW = Object.fromEntries([
  ...collect('truck', 'TRUCK'),
  ...collect('market', 'MARKET'),
])

export const HAS_STRUCTURE_PREVIEW = Object.keys(STRUCTURE_PREVIEW).length > 0
