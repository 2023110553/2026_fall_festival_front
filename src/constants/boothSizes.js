// 부스 천막 규격(booth_size) — 2026-09-22 추가.
//
// 원래 부스 천막은 3m × 6m 캐노피 한 종류였는데, 한 천막을 두 부스가 나눠 쓰던 자리에 3m × 3m 작은 천막을
// 하나 더 세워서 부스를 분리하기로 하면서(재원 결정) 천막이 두 종류가 됐다. 부스마다 어느 천막인지는
// GET /api/booths/ 부스 항목의 booth_size 값으로 구분한다(명세: rotation 바로 다음 필드).
//   - "BIG"   : 3m × 6m 캐노피(가젤보) 천막 — 기존 천막. 값이 없을 때의 기본값
//   - "SMALL" : 3m × 3m 파고다(하이피크) 천막 — 새로 추가(scene/zones/PagodaTent.jsx)
//
// 백엔드가 아직 booth_size를 안 내려주거나(undefined), null이거나, 모르는 값이면 전부 "BIG"으로 본다.
// 그래서 필드가 추가되기 전에도 지금 화면이 그대로 유지되고, 값이 들어오는 순간 "SMALL" 부스만 바뀐다.
// 대소문자·앞뒤 공백은 봐준다("small", " Small " → "SMALL").
//
// 2026-09-26: 천막이 아닌 구조물(푸드트럭·플리마켓)이 들어오면서 "크기"만으로는 부족해졌다.
// 두 가지를 더한다 — 자세한 배경은 campus-map/map-booth-handling-rules.md 참고.
//   1) structure : 뭘 그릴지. "TENT"(기본) | "TRUCK" | "MARKET". 없으면 지금처럼 천막
//   2) width/depth override : 그 구조물 하나만의 크기. 없으면 아래 규격표 값을 쓴다
// 둘 다 placements 항목(boothTents.js)에서 올라온다. placements가 JSONField라 백엔드 스키마 변경 없이
// 키만 늘리면 되고, 키가 없는 기존 부스 48곳은 전부 예전 동작 그대로다.
//
// 이 파일이 치수의 단일 출처다. 3D 구조물(BoothMarker의 캐노피, PagodaTent, FoodTruck, MarketArea)이
// 여기 값으로 지오메트리를 만들고, 지도 뷰어(festival-map-viewer)도 sync로 이 파일을 그대로 가져가서
// 겹침 계산·이름표 높이에 쓴다.
//   - width / depth: 크기(m). rotation이 0일 때 width가 x축(통로와 나란한 정면), depth가 z축
//   - eaveOverhang: 지붕(처마)이 크기 밖으로 튀어나오는 길이(m, 한쪽). 겹침 계산의 발자국도 이 값으로 정해진다
//   - poleHeight: 기둥(처마) 높이(m)
//   - roofRise: 처마에서 지붕 꼭대기까지 높이(m)
export const BOOTH_SIZE = Object.freeze({
  BIG: 'BIG',
  SMALL: 'SMALL',
})

export const DEFAULT_BOOTH_SIZE = BOOTH_SIZE.BIG

export const BOOTH_SIZE_SPECS = Object.freeze({
  [BOOTH_SIZE.BIG]: Object.freeze({ width: 6, depth: 3, eaveOverhang: 0.25, poleHeight: 2.3, roofRise: 1 }),
  // 작은 천막은 사진처럼 처마 모서리가 거의 기둥 위에 온다 → 처마를 조금만 뺀다
  [BOOTH_SIZE.SMALL]: Object.freeze({ width: 3, depth: 3, eaveOverhang: 0.1, poleHeight: 2.3, roofRise: 1.5 }),
})

// 구조물 종류 — 천막이 아닌 것들. TENT는 "기존 booth_size 규격을 따른다"는 뜻이라 별도 치수가 없다.
export const BOOTH_STRUCTURE = Object.freeze({
  TENT: 'TENT',
  TRUCK: 'TRUCK',
  MARKET: 'MARKET',
})

export const DEFAULT_BOOTH_STRUCTURE = BOOTH_STRUCTURE.TENT

// 천막이 아닌 구조물의 기본 치수. placements가 width/depth를 주면 그쪽이 이긴다.
//   - topHeight: 지면에서 꼭대기까지(m). 라벨·등불 높이를 여기서 읽는다
//   - footprintPad: 겹침 계산할 때 크기 밖으로 더 잡아줄 여유(m, 한쪽)
//
// TRUCK — 포터/봉고 기반 푸드트럭(재원이 공유한 사진·실측 도면 기준).
//   전장 5.0 × 전폭 2.0, 적재함 윗면 3.05, 열린 어닝 바깥 끝까지 3.3.
//   실측: 서빙 창 2,600 × 965 / 어닝 2,420 × 580 / 개구부 높이 1,500 / 측면 문 980.
//   어닝을 열면 서빙 쪽으로 약 1.1m 뻗어서 발자국이 그만큼 커진다(5.2 × 3.2).
//   rotation 0일 때 차체 길이가 x축, 서빙 창이 +z를 본다.
//
// MARKET — 플리마켓처럼 넓은 자리를 통째로 덮는 대형 차양막(쉐이드세일). 기본 21 × 12(재원 확정).
//   안에는 아무것도 두지 않는다(재원 결정). topHeight는 제일 높은 귀퉁이 기둥(4.4m) + 여유다.
export const BOOTH_STRUCTURE_SPECS = Object.freeze({
  [BOOTH_STRUCTURE.TRUCK]: Object.freeze({
    width: 5, depth: 2, topHeight: 3.3, footprintPad: { x: 0.1, z: 0.6 },
  }),
  [BOOTH_STRUCTURE.MARKET]: Object.freeze({
    width: 21, depth: 12, topHeight: 4.6, footprintPad: { x: 0, z: 0 },
  }),
})

// 크기 override 허용 범위(m). 백엔드 JSON에 오타가 나도 씬이 망가지지 않게 가둔다 —
// DB가 JSONField라 스키마 검증을 안 해주기 때문에 받는 쪽에서 막는다.
const MIN_DIMENSION = 0.5
const MAX_DIMENSION = 60

const KNOWN_BOOTH_SIZES = new Set(Object.values(BOOTH_SIZE))
const KNOWN_BOOTH_STRUCTURES = new Set(Object.values(BOOTH_STRUCTURE))

// API 값 → "BIG" | "SMALL". 없거나 모르는 값은 "BIG".
export function normalizeBoothSize(value) {
  const key = typeof value === 'string' ? value.trim().toUpperCase() : ''
  return KNOWN_BOOTH_SIZES.has(key) ? key : DEFAULT_BOOTH_SIZE
}

// API 값 → "TENT" | "TRUCK" | "MARKET". 없거나 모르는 값은 "TENT"(기존 천막).
export function normalizeBoothStructure(value) {
  const key = typeof value === 'string' ? value.trim().toUpperCase() : ''
  return KNOWN_BOOTH_STRUCTURES.has(key) ? key : DEFAULT_BOOTH_STRUCTURE
}

function clampDimension(value, fallback) {
  const n = Number(value)
  if (!Number.isFinite(n)) return fallback
  return Math.min(Math.max(n, MIN_DIMENSION), MAX_DIMENSION)
}

// 규격 + override → 실제로 그릴 치수.
//   size     : booth_size("BIG" | "SMALL") — structure가 TENT일 때만 의미가 있다
//   override : { structure, width, depth } — placements 항목에서 올라오는 값. 전부 선택
// 반환값은 항상 { structure, width, depth, topHeight, eaveOverhang, poleHeight?, roofRise? }.
export function getBoothSizeSpec(size, override) {
  const structure = normalizeBoothStructure(override?.structure)

  if (structure === BOOTH_STRUCTURE.TENT) {
    const spec = BOOTH_SIZE_SPECS[normalizeBoothSize(size)]
    return {
      structure,
      ...spec,
      topHeight: spec.poleHeight + spec.roofRise,
      // 천막은 규격이 곧 치수다 — width/depth override를 받지 않는다.
      // 천막을 임의 크기로 늘리면 지붕·기둥 비율이 깨져서 모양이 이상해진다.
    }
  }

  const spec = BOOTH_STRUCTURE_SPECS[structure]
  return {
    structure,
    ...spec,
    width: clampDimension(override?.width, spec.width),
    depth: clampDimension(override?.depth, spec.depth),
    eaveOverhang: 0,
  }
}

// 지면에서 꼭대기까지 높이(m) — 라벨·등불을 구조물 위에 띄울 때 쓴다.
// 피니얼(작은 천막 꼭대기 장식봉)이나 지붕 위 조명처럼 얇은 장식은 포함하지 않는다.
export function getBoothTopHeight(size, override) {
  return getBoothSizeSpec(size, override).topHeight
}

// 바닥에 드리우는 직사각형 크기(m) — 부스끼리 겹치는지 볼 때 쓴다.
// 큰 천막 6.5 × 3.5, 작은 천막 3.2 × 3.2, 푸드트럭 5.2 × 3.2(어닝 포함), 플리마켓은 구역 크기 그대로.
// rotation이 0일 때 width가 x축.
export function getBoothFootprint(size, override) {
  const spec = getBoothSizeSpec(size, override)
  const padX = spec.footprintPad?.x ?? spec.eaveOverhang ?? 0
  const padZ = spec.footprintPad?.z ?? spec.eaveOverhang ?? 0
  return { width: spec.width + padX * 2, depth: spec.depth + padZ * 2 }
}
