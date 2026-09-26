import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

// 등불 마커(BoothLantern)의 모양·재질·텍스처 — 2026-09-24 추가.
//
// 왜 컴포넌트와 파일을 나눴나: 모양을 만드는 코드(프로파일 곡선, 리브, 술 주름 …)가 길어서 한 파일에 두면
// BoothLantern.jsx에서 "어떻게 배치하고 언제 빛나는지"가 묻힌다(BoothMarker.jsx가 1500줄을 넘긴 교훈).
// 여기는 three만 알고 React는 모른다 — 모양을 고칠 때는 이 파일만, 동작을 고칠 때는 BoothLantern.jsx만 보면 된다.
//
// 좌표 규칙(scale 1 기준, 단위 m): 원점 = 술 끝(가장 아래 점). BoothPin의 "꼭짓점 = 원점"과 같은 규칙이라
// hoverHeight(지면 → 원점 높이)와 화면 크기 고정(원점 기준으로 키움)을 그대로 쓸 수 있다.
// 앞면 = 로컬 +z. BoothLantern이 매 프레임 +z를 카메라 쪽으로 돌린다(useFloatingMarker의 atan2).
//
// 모든 부스가 같은 지오메트리를 쓰므로 모듈 레벨에서 한 번만 만든다(BoothPin의 geometryCache와 같은 이유).
// 재질은 "팔레트 × 시간대 × 항상 위" 조합마다 하나씩 캐시한다 — 한 화면에 색이 많아야 7개라 개수가 적다.
// 둘 다 앱 수명 내내 쓰므로 dispose하지 않는다. 부스마다 다른 건 숫자 텍스처뿐이고, 그건 BoothLantern이 정리한다.

// ── 치수 ────────────────────────────────────────────────────────────────────────────
export const LANTERN_DIMENSIONS = Object.freeze({
  radius: 1.15, // 몸통 최대 반지름 — 폭 약 2.3m(scale 1). 레퍼런스처럼 몸통이 높이보다 살짝 넓다
  bodyHeight: 1.95,
  topCollarHeight: 0.26,
  bottomCollarHeight: 0.17,
  stringLength: 0.12,
  beadRadius: 0.085,
  tasselLength: 0.7,
  ribCount: 10,
})
const D = LANTERN_DIMENSIONS

const Y_TASSEL_TOP = D.tasselLength
const Y_BEAD = Y_TASSEL_TOP + D.beadRadius * 0.85
const Y_BOTTOM_COLLAR = Y_BEAD + D.beadRadius + D.stringLength // 아래 칼라 밑면
const Y_BODY_BOTTOM = Y_BOTTOM_COLLAR + D.bottomCollarHeight * 0.65 // 칼라와 몸통이 살짝 겹치게
const Y_BODY_TOP = Y_BODY_BOTTOM + D.bodyHeight
const Y_TOP_COLLAR_TOP = Y_BODY_TOP + D.topCollarHeight * 0.85

export const LANTERN_HEIGHT = Y_TOP_COLLAR_TOP // 전체 높이(술 끝 → 위 칼라 윗면)
export const LANTERN_BODY_CENTER_Y = Y_BODY_BOTTOM + D.bodyHeight * 0.5
export const LANTERN_HANG_Y = Y_TOP_COLLAR_TOP // 흔들림 축(매달린 점)
export const LANTERN_HALO_SIZE = D.radius * 4.2 // 밤 후광 스프라이트 지름

// 몸통 옆모습 — (위에서부터 비율 t, 최대 반지름 대비 반지름). 레퍼런스처럼 위가 넓고 아래로 좁아지는 풍선형.
// 숫자 곡면(number patch)도 같은 곡선을 쓴다 — 곡선을 바꾸면 숫자도 같이 따라간다.
const BODY_PROFILE = [
  [0.0, 0.6],
  [0.06, 0.78],
  [0.16, 0.92],
  [0.3, 0.99],
  [0.42, 1.0],
  [0.56, 0.96],
  [0.7, 0.86],
  [0.82, 0.71],
  [0.92, 0.55],
  [1.0, 0.44],
]

// t(0 = 몸통 위, 1 = 몸통 아래)에서의 반지름. 구간 사이는 smoothstep으로 이어서 각이 안 지게 한다.
function bodyRadiusAt(t) {
  for (let i = 0; i < BODY_PROFILE.length - 1; i += 1) {
    const [t0, r0] = BODY_PROFILE[i]
    const [t1, r1] = BODY_PROFILE[i + 1]
    if (t <= t1) {
      const u = Math.min(Math.max((t - t0) / (t1 - t0), 0), 1)
      const s = u * u * (3 - 2 * u)
      return (r0 + (r1 - r0) * s) * D.radius
    }
  }
  return BODY_PROFILE[BODY_PROFILE.length - 1][1] * D.radius
}

// 높이 y에서의 몸통 반지름
function bodyRadiusAtY(y) {
  return bodyRadiusAt(1 - (y - Y_BODY_BOTTOM) / D.bodyHeight)
}

// LatheGeometry용 점 목록(아래 → 위). y 범위와 바깥으로 띄울 거리를 받는다.
function bodyPoints(count, yFrom = Y_BODY_BOTTOM, yTo = Y_BODY_TOP, offset = 0) {
  const points = []
  for (let i = 0; i < count; i += 1) {
    const y = yFrom + ((yTo - yFrom) * i) / (count - 1)
    points.push(new THREE.Vector2(bodyRadiusAtY(y) + offset, y))
  }
  return points
}

// ── 지오메트리 ─────────────────────────────────────────────────────────────────────
// 숫자가 붙는 곡면 조각 — 몸통 가운데보다 조금 위, 앞면 ±35°.
// 리브(두께 0.016)보다 바깥에 떠 있어야 리브 선이 숫자를 가로지르지 않는다(숫자 텍스처는 글자 외엔 투명이라
// 리브는 글자 사이로 그대로 보인다). 4.5cm 차이는 지도 거리에서 안 보인다.
const NUMBER_PATCH = Object.freeze({
  centerT: 0.42, // 몸통 위에서부터 비율 — 지도 카메라가 49° 위에서 내려다봐서 가운데보다 조금 위가 더 잘 보인다
  height: D.bodyHeight * 0.56,
  halfAngle: THREE.MathUtils.degToRad(42),
  offset: 0.045,
})

function createBodyGeometry() {
  // phiStart = π → UV 이음매(u = 0/1)가 뒤쪽(-z)에 오고, 앞면(+z)이 u = 0.5가 된다.
  // 앞면 가운데가 밝은 발광 그라디언트(glow map)가 이음매 없이 앞에 오게 하려는 것.
  return new THREE.LatheGeometry(bodyPoints(28), 40, Math.PI, Math.PI * 2)
}

function createRibsGeometry() {
  const ribs = []
  for (let k = 0; k < D.ribCount; k += 1) {
    // 반 칸 돌려서 정면(0°)에 리브가 오지 않게 — 숫자 한가운데를 선이 지나가지 않도록
    const phi = ((k + 0.5) / D.ribCount) * Math.PI * 2
    const points = bodyPoints(24, Y_BODY_BOTTOM + 0.02, Y_BODY_TOP - 0.02).map(
      (p) => new THREE.Vector3(Math.sin(phi) * p.x * 1.004, p.y, Math.cos(phi) * p.x * 1.004)
    )
    // 지도 거리에서는 리브가 1~2px 선이라 단면은 사각형(4)이면 충분하다 — 등불 한 개 삼각형의 절반 가까이가 리브였다
    ribs.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 20, 0.016, 4, false))
  }
  const merged = mergeGeometries(ribs)
  ribs.forEach((geometry) => geometry.dispose())
  return merged
}

// 위 칼라(입구가 보이는 링) + 아래 칼라 — 같은 색(key)이라 한 지오메트리로 합쳐서 드로콜을 줄인다.
function createCollarsGeometry() {
  const topRadius = bodyRadiusAt(0)
  const outer = topRadius * 1.12
  const inner = topRadius * 0.86
  const y0 = Y_BODY_TOP - 0.05
  const y1 = Y_TOP_COLLAR_TOP
  // 안쪽 벽 → 윗면 → 바깥 벽을 한 번에 도는 단면(모서리를 살짝 굴림). 안팎이 다 보여서 재질은 DoubleSide.
  const ring = new THREE.LatheGeometry(
    [
      new THREE.Vector2(inner, y1 - 0.11),
      new THREE.Vector2(inner, y1 - 0.02),
      new THREE.Vector2(inner + 0.03, y1),
      new THREE.Vector2(outer - 0.03, y1),
      new THREE.Vector2(outer, y1 - 0.03),
      new THREE.Vector2(outer, y0 + 0.03),
      new THREE.Vector2(outer - 0.05, y0),
    ],
    36
  )

  const bottomRadius = bodyRadiusAt(1)
  const bottom = new THREE.CylinderGeometry(bottomRadius * 1.1, bottomRadius * 1.02, D.bottomCollarHeight, 32)
  bottom.translate(0, Y_BOTTOM_COLLAR + D.bottomCollarHeight / 2, 0)

  // 합칠 때 법선을 다시 계산하지 않는다 — 비인덱스 지오메트리에서 다시 계산하면 면마다 법선이 갈려서
  // 원통이 각져 보인다. Lathe/Cylinder가 만든 매끈한 법선을 그대로 쓴다.
  const merged = mergeGeometries([ring.toNonIndexed(), bottom.toNonIndexed()])
  ring.dispose()
  bottom.dispose()
  return merged
}

// 위 칼라 안쪽 — 입구 안으로 등불 속 불빛이 보이게 밝은 원판을 깐다. 지도 카메라는 위에서 내려다봐서 입구가 잘 보이는데,
// 처음엔 어둡게 깔았다가 위에서 보면 까만 구멍처럼 튀어서(헤드리스 렌더) 속불빛으로 바꿨다.
function createOpeningGeometry() {
  const geometry = new THREE.CircleGeometry(bodyRadiusAt(0) * 0.87, 32)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate(0, Y_TOP_COLLAR_TOP - 0.11, 0)
  return geometry
}

// 금색 구슬 + 칼라와 이어주는 줄
function createGoldGeometry() {
  const bead = new THREE.SphereGeometry(D.beadRadius, 16, 12)
  bead.translate(0, Y_BEAD, 0)
  const stringHeight = Y_BOTTOM_COLLAR - Y_BEAD
  const string = new THREE.CylinderGeometry(0.014, 0.014, stringHeight, 6)
  string.translate(0, Y_BEAD + stringHeight / 2, 0)
  const merged = mergeGeometries([bead.toNonIndexed(), string.toNonIndexed()])
  bead.dispose()
  string.dispose()
  return merged
}

// 술 — 위가 가늘고 아래로 벌어지며, 끝에 주름(5갈래)이 잡히는 모양. 원점(술 끝)이 마커의 기준점이다.
function createTasselGeometry() {
  const rings = 14
  const segments = 30
  const lobes = 5
  const positions = []
  const indices = []
  for (let j = 0; j <= rings; j += 1) {
    const s = j / rings // 0 = 위, 1 = 아래
    const y = Y_TASSEL_TOP - s * (Y_TASSEL_TOP - 0.05)
    const baseRadius = 0.035 + 0.2 * Math.pow(s, 1.15)
    for (let i = 0; i <= segments; i += 1) {
      const phi = (i / segments) * Math.PI * 2
      const radius = baseRadius * (1 + 0.22 * Math.pow(s, 2.5) * Math.cos(lobes * phi))
      positions.push(Math.sin(phi) * radius, y, Math.cos(phi) * radius)
    }
  }
  // 옆면
  for (let j = 0; j < rings; j += 1) {
    for (let i = 0; i < segments; i += 1) {
      const a = j * (segments + 1) + i
      const b = a + segments + 1
      indices.push(a, b, a + 1, a + 1, b, b + 1)
    }
  }
  // 바닥을 원점(술 끝) 한 점으로 모은다
  const tip = positions.length / 3
  positions.push(0, 0, 0)
  const lastRing = rings * (segments + 1)
  for (let i = 0; i < segments; i += 1) {
    indices.push(lastRing + i, tip, lastRing + i + 1)
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

// 숫자가 붙는 곡면 조각. LatheGeometry의 UV가 u = 둘레 방향(왼쪽 → 오른쪽), v = 아래 → 위라서
// 캔버스 텍스처(flipY 기본값)를 그대로 올리면 글자가 바로 선다.
function createNumberPatchGeometry() {
  const centerY = Y_BODY_TOP - NUMBER_PATCH.centerT * D.bodyHeight
  const points = bodyPoints(10, centerY - NUMBER_PATCH.height / 2, centerY + NUMBER_PATCH.height / 2, NUMBER_PATCH.offset)
  return new THREE.LatheGeometry(points, 14, -NUMBER_PATCH.halfAngle, NUMBER_PATCH.halfAngle * 2)
}

let geometries = null
export function getLanternGeometries() {
  if (!geometries) {
    geometries = {
      body: createBodyGeometry(),
      ribs: createRibsGeometry(),
      collars: createCollarsGeometry(),
      opening: createOpeningGeometry(),
      gold: createGoldGeometry(),
      tassel: createTasselGeometry(),
      numberPatch: createNumberPatchGeometry(),
    }
  }
  return geometries
}

// 숫자 곡면의 가로:세로 비율(호 길이 ÷ 높이) — 숫자 텍스처 캔버스를 같은 비율로 만들어야 글자가 안 찌그러진다
const NUMBER_PATCH_ASPECT =
  (2 * NUMBER_PATCH.halfAngle * (bodyRadiusAt(NUMBER_PATCH.centerT) + NUMBER_PATCH.offset)) / NUMBER_PATCH.height

// ── 텍스처 ─────────────────────────────────────────────────────────────────────────
// 몸통 발광 마스크: 앞면 가운데(u = 0.5, 몸통 중간보다 약간 위)가 가장 밝고 옆·뒤·위아래로 갈수록 어두워진다.
// 등불 안에 촛불이 있는 것처럼 보이게 하는 장치 — 레퍼런스에서 등불 가운데가 하얗게 밝은 모습.
// 등불이 늘 +z를 카메라 쪽으로 돌리기 때문에 "앞면 가운데 = 카메라에서 본 가운데"가 된다.
let glowMap = null
function getGlowMap() {
  if (glowMap) return glowMap
  const width = 128
  const height = 64
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  const image = ctx.createImageData(width, height)
  for (let y = 0; y < height; y += 1) {
    const v = 1 - y / (height - 1) // 캔버스 위쪽 = 텍스처 v 1(몸통 위)
    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1)
      const spot = Math.exp(-(((u - 0.5) / 0.17) ** 2) - (((v - 0.55) / 0.3) ** 2))
      const ends = Math.min(1, v / 0.12, (1 - v) / 0.12) // 몸통 위아래 끝은 칼라 그림자처럼 살짝 어둡게
      // 바닥값 0.5 — 몸통 전체가 자기 색으로 은은히 빛나고(아래쪽이 회색으로 죽지 않게), 가운데만 더 밝다
      const value = Math.round(255 * Math.min(1, (0.5 + 0.5 * spot) * (0.6 + 0.4 * Math.max(0, ends))))
      const index = (y * width + x) * 4
      image.data[index] = value
      image.data[index + 1] = value
      image.data[index + 2] = value
      image.data[index + 3] = 255
    }
  }
  ctx.putImageData(image, 0, 0)
  glowMap = new THREE.CanvasTexture(canvas)
  glowMap.colorSpace = THREE.SRGBColorSpace
  return glowMap
}

// 밤 후광: 가운데가 진하고 바깥으로 사라지는 원. 색은 재질(SpriteMaterial.color)이 입힌다.
let haloTexture = null
function getHaloTexture() {
  if (haloTexture) return haloTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(255,255,255,0.9)')
  gradient.addColorStop(0.32, 'rgba(255,255,255,0.45)')
  gradient.addColorStop(0.62, 'rgba(255,255,255,0.12)')
  gradient.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  haloTexture = new THREE.CanvasTexture(canvas)
  haloTexture.colorSpace = THREE.SRGBColorSpace
  return haloTexture
}

// 숫자 폰트 — 앱 전역 폰트(index.html의 Pretendard Variable)를 쓴다. 레퍼런스의 둥근 숫자체를 쓰려면
// 숫자만 담은 폰트 서브셋을 따로 넣어야 해서 이번엔 앱 폰트로 맞췄다.
const NUMBER_FONT_FAMILY = '"Pretendard Variable", Pretendard, system-ui, -apple-system, sans-serif'

function drawCount(canvas, count, keyColor) {
  const ctx = canvas.getContext('2d')
  const { width, height } = canvas
  ctx.clearRect(0, 0, width, height)
  const text = count > 999 ? '999+' : String(count)
  // measureText로 실제 폭을 재서 곡면 폭의 82% 안에 들어오게 줄인다(BoothPin에서 "118"이 잘렸던 교훈)
  let fontSize = Math.round(height * 0.8)
  do {
    ctx.font = `800 ${fontSize}px ${NUMBER_FONT_FAMILY}`
    if (ctx.measureText(text).width <= width * 0.84) break
    fontSize -= 6
  } while (fontSize > 40)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const x = width / 2
  const y = height / 2 + fontSize * 0.04
  // 글자 뒤로 번지는 밝은 테 — 레퍼런스의 "빛나는 종이에 찍힌 숫자" 느낌. 몸통이 어두운 색이어도 글자가 뜬다.
  ctx.shadowColor = 'rgba(255, 255, 255, 0.75)'
  ctx.shadowBlur = fontSize * 0.14
  ctx.fillStyle = keyColor
  ctx.fillText(text, x, y)
  ctx.shadowBlur = 0
  // 지도 거리에서는 숫자가 수십 px라 획이 가늘면 뭉개진다 — 같은 색 테두리로 한 번 더 굵게
  ctx.lineJoin = 'round'
  ctx.lineWidth = fontSize * 0.07
  ctx.strokeStyle = keyColor
  ctx.strokeText(text, x, y)
  ctx.fillText(text, x, y)
}

// 부스마다 숫자가 달라 공유가 안 되므로 인스턴스별로 만든다(정리는 BoothLantern이 언마운트 때 dispose).
// 웹폰트가 아직 안 받아졌으면 시스템 폰트로 먼저 그리고, 받아지면 다시 그려서 교체한다.
export function createLanternCountTexture(count, keyColor) {
  const canvas = document.createElement('canvas')
  canvas.height = 256
  canvas.width = Math.round(256 * NUMBER_PATCH_ASPECT)
  drawCount(canvas, count, keyColor)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8

  const fontSpec = `800 100px ${NUMBER_FONT_FAMILY}`
  if (typeof document !== 'undefined' && document.fonts && !document.fonts.check(fontSpec)) {
    document.fonts
      .load(fontSpec)
      .then(() => {
        if (texture.userData.disposed) return
        drawCount(canvas, count, keyColor)
        texture.needsUpdate = true
      })
      .catch(() => {}) // 폰트를 못 받아도 시스템 폰트로 이미 그려져 있다
    texture.addEventListener('dispose', () => {
      texture.userData.disposed = true
    })
  }
  return texture
}

// ── 재질 ───────────────────────────────────────────────────────────────────────────
// 시간대별 발광 세기. 낮에는 조명이 충분해서 발광을 낮추고 후광을 끈다(BoothMarker의 "낮 게이팅"과 같은 이유 —
// 낮 화면에서 번짐이 지도를 덮는다). 밤에는 몸통이 안에서 켜진 것처럼 밝고 뒤로 후광이 퍼진다.
// 블룸(SelectiveBloom)은 쓰지 않는다 — MapCanvas의 블룸은 천막 전구에 맞춰 세게 잡혀 있어서(threshold 0.15,
// intensity 1.4) 큰 몸통에 걸면 하얗게 날아가고 숫자까지 번진다. 후광 스프라이트는 세기를 여기서 따로 정할 수 있다.
const GLOW_BY_TIME_OF_DAY = Object.freeze({
  day: Object.freeze({ body: 0.35, trim: 0.05, halo: 0 }),
  sunset: Object.freeze({ body: 0.6, trim: 0.14, halo: 0.3 }),
  night: Object.freeze({ body: 0.8, trim: 0.24, halo: 0.45 }),
})

const WHITE = new THREE.Color('#ffffff')
const materialCache = new Map()

// colors = { paletteKey, body, key } (constants/boothMarkerColors.js의 getBoothMarkerStyle 결과)
export function getLanternMaterials(colors, timeOfDay = 'night', alwaysOnTop = false) {
  const glow = GLOW_BY_TIME_OF_DAY[timeOfDay] ?? GLOW_BY_TIME_OF_DAY.night
  const cacheKey = `${colors.body}|${colors.key}|${timeOfDay}|${alwaysOnTop ? 1 : 0}`
  if (materialCache.has(cacheKey)) return materialCache.get(cacheKey)

  const bodyColor = new THREE.Color(colors.body)
  const keyColor = new THREE.Color(colors.key)
  const trimColor = bodyColor.clone().lerp(keyColor, 0.45)
  // alwaysOnTop: 건물 뒤에서도 보이게 깊이 테스트를 끈다(BoothPin 5번 항목과 같은 옵션·같은 부작용)
  const depth = alwaysOnTop ? { depthTest: false } : {}

  const materials = {
    body: new THREE.MeshStandardMaterial({
      color: bodyColor,
      // 발광색을 흰색 쪽으로 많이 섞으면 톤매핑(ACES)을 거치며 몸통이 하얗게 떠서 그룹 색이 안 보인다(첫 렌더에서 확인).
      // 몸통 색을 조금만 밝혀서 쓰고, "가운데가 밝은" 느낌은 발광 마스크(glow map)가 낸다.
      emissive: bodyColor.clone().lerp(WHITE, 0.15),
      emissiveMap: getGlowMap(),
      emissiveIntensity: glow.body,
      roughness: 0.62,
      metalness: 0,
      ...depth,
    }),
    rib: new THREE.MeshStandardMaterial({
      color: bodyColor.clone().lerp(keyColor, 0.35),
      emissive: bodyColor.clone().lerp(keyColor, 0.35),
      emissiveIntensity: glow.trim,
      roughness: 0.5,
      ...depth,
    }),
    collar: new THREE.MeshStandardMaterial({
      color: keyColor,
      emissive: keyColor,
      emissiveIntensity: glow.trim,
      roughness: 0.38,
      metalness: 0.08,
      side: THREE.DoubleSide,
      ...depth,
    }),
    opening: new THREE.MeshBasicMaterial({
      color: bodyColor.clone().lerp(WHITE, 0.35).multiplyScalar(timeOfDay === 'day' ? 0.8 : 1),
      ...depth,
    }),
    tassel: new THREE.MeshStandardMaterial({
      color: trimColor,
      emissive: trimColor,
      emissiveIntensity: glow.trim,
      roughness: 0.55,
      ...depth,
    }),
    gold: new THREE.MeshStandardMaterial({
      color: '#D9A441',
      emissive: '#6B4A12',
      emissiveIntensity: 0.3 + glow.trim,
      metalness: 0.65,
      roughness: 0.3,
      ...depth,
    }),
    halo:
      glow.halo > 0
        ? new THREE.SpriteMaterial({
            map: getHaloTexture(),
            color: bodyColor,
            opacity: glow.halo,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            ...depth,
          })
        : null,
  }
  materialCache.set(cacheKey, materials)
  return materials
}

// 숫자 곡면 재질(부스마다 텍스처가 달라서 캐시하지 않는다)
export function createLanternNumberMaterial(texture, alwaysOnTop = false) {
  return new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    depthWrite: false,
    // 리브보다 바깥에 떠 있지만, 멀리서 볼 때 깊이 정밀도 때문에 몸통과 깜빡이지 않게 한 번 더 앞으로 당긴다
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    ...(alwaysOnTop ? { depthTest: false } : {}),
  })
}
