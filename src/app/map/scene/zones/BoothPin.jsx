import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Billboard } from '@react-three/drei'
import * as THREE from 'three'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'

// 부스 위치를 가리키는 3D 마커(물방울 핀) — 2026-09-20 추가(재원 요청: "마커를 3D로, 구글맵 핀 느낌으로").
//
// 왜 BoothMarker.jsx가 아니라 별도 파일인가:
//   map-section-scope-and-roles.md의 B안 합의대로 BoothMarker는 "부스 오브젝트(천막) + 라벨 앵커 좌표"까지만
//   책임진다. 그 위에 얹는 마커/라벨은 별개 레이어다. BoothMarker.jsx는 이미 740줄이 넘고 팀에서 가장 자주
//   건드리는 파일이라 여기에 마커까지 넣으면 충돌이 잦아진다. 그래서 같은 부스 좌표를 공유하는 형제 컴포넌트로
//   두고, ZoneBooths.jsx가 둘을 나란히 배치한다 — 마커 디자인을 통째로 갈아엎어도 BoothMarker는 손댈 일이 없다.
//
// 설계 메모(구현하면서 부딪힌 것들):
//
//  1. 물방울 모양 — CSG(불리언 연산) 라이브러리 없이 만든다.
//     three.js의 ExtrudeGeometry가 Shape.holes를 기본 지원하므로, 외곽선(머리 원 + 아래 꼭짓점으로 내려가는
//     두 접선)을 Shape으로 그리고 가운데 구멍은 Path로 뚫으면 끝난다. 새 의존성 0개.
//     접선이 원에 닿는 각도는 직각삼각형(중심-접점-꼭짓점)에서 cos β = R / L 로 구한다. 이 각도를 안 맞추고
//     대충 이으면 머리와 꼬리가 만나는 "어깨"에 각이 져서 핀이 조잡해 보인다.
//
//  2. 화면상 크기 고정 — 지도 앱 마커의 기본 동작.
//     3D 오브젝트를 그냥 두면 줌아웃할 때 같이 작아져서 마커 구실을 못한다. 그래서 매 프레임 카메라와의
//     거리에 비례해 scale을 키운다(거리가 2배면 크기도 2배 → 화면상 크기 일정).
//     이때 크기 기준점(pivot)이 중요하다. 지오메트리를 center()로 가운데 정렬해버리면 scale이 커질 때
//     꼭짓점이 아래로 흘러내려서 핀이 가리키는 지점이 바뀐다. 그래서 지오메트리의 Y는 원래대로 두고
//     (꼭짓점 y = -L), 그룹 원점 = 꼭짓점이 되도록 메시를 +L 올려놨다. 이제 아무리 키우고 줄여도
//     핀 끝은 항상 같은 좌표를 가리킨다.
//
//  3. 어느 각도에서도 핀 모양 유지 — Billboard는 Y축만.
//     완전 빌보드(카메라를 정면으로 마주보기)로 하면 위에서 내려다볼 때 핀이 바닥에 누운 것처럼 보인다.
//     그래서 lockX/lockZ로 좌우 회전만 카메라를 따라가게 하고, 위아래는 따로 계산한다.
//     현재 지도 카메라([10,140,90] → target [10,3,-30])는 약 49° 내려보기인데, 핀을 꼿꼿이 세우면
//     그 각도만큼 눌려 보인다(높이가 cos49° ≈ 0.66배로 찌그러짐). 그래서 카메라가 높이 있을수록 핀을
//     카메라 쪽으로 눕혀준다 — tiltRatio(기본 0.5) × 카메라 올려본 각. 고정 각도로 하지 않은 이유는
//     OrbitControls로 낮은 각도까지 돌릴 수 있어서, 고정이면 옆에서 볼 때 핀이 뒤로 자빠져 보이기 때문.
//
//  4. 블룸/톤매핑과의 관계.
//     핀은 <Select>로 감싸지 않는다 — SelectiveBloom은 선택된 오브젝트만 번지게 하므로 핀은 자동으로
//     블룸에서 빠진다(마커가 등불처럼 번지면 UI로 안 읽히고 지저분해진다).
//     반대로 톤매핑은 피할 수 없다. MapCanvas의 <ToneMapping>은 화면 전체에 거는 후처리라 재질에
//     toneMapped={false}를 줘도 무의미하다(EffectComposer가 renderer.toneMapping을 꺼버리고 마지막에
//     한 번에 ACES 커브를 먹인다 — MapCanvas.jsx 2026-09-16 2차 항목 참고). 그래서 밤에 핀이 묻히지
//     않도록 재질 자체에 emissive를 조금 넣어 바닥값을 올렸다(emissiveIntensity 기본 0.5).
//
//  5. 가려짐(occlusion) — 기본은 "가려진다".
//     alwaysOnTop을 켜면 depthTest를 꺼서 건물/나무 뒤에 있어도 항상 보이지만, depthTest를 끄면
//     핀끼리의 앞뒤 관계도 같이 사라져서 멀리 있는 부스의 핀이 가까운 부스의 핀을 덮어버린다
//     (그리는 순서 = 배열 순서가 되므로). 부스가 촘촘한 팔정도에서 특히 어색해서 기본값은 false로 뒀다.
//     내려다보는 지도라 실제로 가려지는 경우도 많지 않다.
//
//  6. 접근성 — 알고 넘어가는 트레이드오프.
//     기존 <Html> PinLabel은 진짜 DOM <button>이라 Tab 포커스/스크린리더가 됐는데, 3D 메시는 캔버스
//     안이라 그게 안 된다. 지금은 부스 목록 패널(BoothListPanel)이 같은 바텀시트를 여는 키보드 경로라
//     기능적으로 막히진 않는다. 마커만 남기고 라벨을 완전히 걷어낼 거라면, 캔버스 옆에 시각적으로
//     숨긴 <button> 목록을 두고 클릭 시 같은 onClick을 호출하는 방식을 후속으로 붙이는 게 좋다.

const PIN_HEAD_RADIUS = 1 // 머리 원 반지름(씬 단위 m, scale 1 기준)
const PIN_TIP_LENGTH = 2.6 // 머리 중심에서 아래 꼭짓점까지 — 전체 높이는 여기에 반지름을 더한 3.6

// 카테고리 → 색상. constants/categories.js가 단일 출처다(지도 마커·필터 칩이 같은 색을 쓴다).
// 목록에 없는 카테고리(백엔드가 새 값을 내려주는 경우)는 ETC 색으로 떨어진다.
const FALLBACK_COLOR = BOOTH_CATEGORIES[0].color
const CATEGORY_COLOR = Object.fromEntries(BOOTH_CATEGORIES.map((c) => [c.value, c.color]))
export function getCategoryColor(category) {
  return CATEGORY_COLOR[category] ?? FALLBACK_COLOR
}

// 물방울 외곽선. holeRatio > 0 이면 머리 가운데를 그 비율만큼 뚫는다(레퍼런스의 도넛 구멍).
function createPinShape(holeRatio) {
  const beta = Math.acos(PIN_HEAD_RADIUS / PIN_TIP_LENGTH) // 접점 각도 — 1번 항목
  const down = -Math.PI / 2
  const t1 = down + beta
  const t2 = down - beta

  const shape = new THREE.Shape()
  shape.moveTo(0, -PIN_TIP_LENGTH)
  shape.lineTo(Math.cos(t1) * PIN_HEAD_RADIUS, Math.sin(t1) * PIN_HEAD_RADIUS)
  shape.absarc(0, 0, PIN_HEAD_RADIUS, t1, t2 + Math.PI * 2, false)
  shape.lineTo(0, -PIN_TIP_LENGTH)

  if (holeRatio > 0) {
    const hole = new THREE.Path()
    hole.absarc(0, 0, PIN_HEAD_RADIUS * holeRatio, 0, Math.PI * 2, true)
    shape.holes.push(hole)
  }
  return shape
}

// Y는 원래 좌표를 유지하고(꼭짓점 y = -L) 두께(Z)만 가운데로 옮긴다 — 2번 항목의 pivot 이유.
function createPinGeometry(holeRatio) {
  const geometry = new THREE.ExtrudeGeometry(createPinShape(holeRatio), {
    depth: 0.4,
    curveSegments: 64,
    bevelEnabled: true, // 베벨이 있어야 모서리에 하이라이트가 생겨서 레퍼런스처럼 통통해 보인다
    bevelThickness: 0.14,
    bevelSize: 0.14,
    bevelOffset: 0,
    bevelSegments: 8,
  })
  geometry.computeBoundingBox()
  const { min, max } = geometry.boundingBox
  geometry.translate(0, 0, -(min.z + max.z) / 2)
  geometry.computeVertexNormals()
  return geometry
}

// 지오메트리는 모양(variant)별로 딱 2개면 충분하므로 모듈 레벨에서 캐시해 모든 부스가 공유한다.
// 부스마다 만들면 구역당 12~14개씩 똑같은 ExtrudeGeometry가 생긴다(구역 전환 때마다 다시).
// 앱 수명 내내 살아 있어야 해서 dispose하지 않는다 — 어차피 2개라 누수라고 할 양이 아니다.
const geometryCache = new Map()
function getPinGeometry(variant) {
  if (!geometryCache.has(variant)) {
    geometryCache.set(variant, createPinGeometry(variant === 'hole' ? 0.45 : 0))
  }
  return geometryCache.get(variant)
}

// 바닥 가짜 그림자 — 방향광이 약한 밤에도 "떠 있다"가 읽히게. 모든 핀이 같은 텍스처를 쓴다.
let shadowTexture = null
function getShadowTexture() {
  if (shadowTexture) return shadowTexture
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  gradient.addColorStop(0, 'rgba(0,0,0,0.45)')
  gradient.addColorStop(0.5, 'rgba(0,0,0,0.18)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  shadowTexture = new THREE.CanvasTexture(canvas)
  return shadowTexture
}

// 핀 얼굴에 올릴 등불 개수. drei <Text>(troika)는 폰트 파일을 따로 번들해야 해서, 숫자만 쓰는
// 지금 단계에서는 캔버스가 의존성 없이 제일 가볍다. 부스명(한글)까지 3D로 그릴 거라면 그때
// troika + 웹폰트 서브셋을 도입하는 게 맞다.
function createCountTexture(count, color) {
  const size = 256
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.42, 0, Math.PI * 2)
  ctx.fill()

  const text = count > 999 ? '999+' : String(count)
  ctx.fillStyle = color
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // 자릿수를 세서 글자 크기를 정하면(3자리는 84px 식) 폰트마다 글자 폭이 달라 어떤 환경에선
  // 원 밖으로 삐져나간다(실제로 "118"이 잘렸다). measureText로 실제 폭을 재서 원 안에 맞춘다.
  const maxTextWidth = size * 0.42 * 2 * 0.78 // 흰 원 지름의 78% 안에 들어오게
  let fontSize = 108
  do {
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, sans-serif`
    if (ctx.measureText(text).width <= maxTextWidth) break
    fontSize -= 6
  } while (fontSize > 36)
  ctx.fillText(text, size / 2, size / 2 + fontSize * 0.04)

  const texture = new THREE.CanvasTexture(canvas)
  texture.anisotropy = 8
  return texture
}

// props:
//   - position: [x, y, z] 부스가 놓인 지면 좌표(BoothMarker에 넘기는 것과 같은 값)
//   - category: 핀 색상 결정(constants/categories.js)
//   - count: 핀 얼굴에 찍히는 등불 개수(variant='face'일 때만 사용)
//   - variant: 'face'(가운데에 등불 개수) | 'hole'(레퍼런스처럼 구멍만)
//   - scale: refDist 거리에서의 기준 크기. 전체 높이 3.6 × scale (m)
//   - hoverHeight: 지면에서 핀 꼭짓점까지 높이(m) — 부스 천막(약 3.3m)보다 높아야 안 겹친다
//   - constantSize: 화면상 크기 고정(2번 항목). 끄면 일반 3D 오브젝트처럼 원근에 따라 작아진다
//   - refDist: constantSize 기준 거리. 지도 기본 카메라~타깃 거리가 약 182라 180을 기본값으로 둠
//   - tiltRatio: 카메라 올려본 각의 몇 배로 눕힐지(0 = 꼿꼿이, 1 = 카메라 정면). 3번 항목
//   - emissiveIntensity: 밤에 핀이 어두워지지 않게 하는 자체발광 세기. 4번 항목
//   - alwaysOnTop: 건물/나무에 안 가려지게(depthTest off). 핀끼리 앞뒤가 깨지는 부작용 — 5번 항목
//   - showAnchor: 바닥에 가짜 그림자 + 카테고리 링을 깔지 여부(기본 false — 아래 7번 항목)
//   - bobPhase: 위아래로 떠다니는 애니메이션 위상 — 부스마다 다른 값을 줘야 다 같이 출렁이지 않는다
//   - onClick: 부스 클릭 콜백(ZoneBooths가 onBoothClick으로 연결)
//
//  7. 바닥 앵커(그림자+링)를 기본으로 끈 이유.
//     핀이 허공에 떠 있으면 어느 지점을 가리키는지 애매해서 바닥에 그림자와 링을 깔았는데, 부스에
//     붙이고 보니 역효과였다. (가) 링이 천막(6×3m) 밑에 깔려서 가장자리만 초승달처럼 삐져나오고,
//     (나) 부스는 이미 등불 단계에 따라 바닥 글로우를 깔고 있어서(BoothMarker의 GroundGlow) 그 위에
//     카테고리 색 링이 겹치면 "이 동그라미가 밝기인지 카테고리인지" 헷갈린다. 부스 자체가 이미
//     눈에 보이는 앵커라 링이 없어도 핀이 어디를 가리키는지 알 수 있다. 빈 땅 위에 띄울 일이
//     생기면(예: 화장실·안내소처럼 3D 오브젝트가 없는 지점) 그때 true로 켜면 된다.
export default function BoothPin({
  position,
  category,
  count = 0,
  variant = 'face',
  scale = 2.2,
  hoverHeight = 5.5,
  constantSize = true,
  refDist = 180,
  tiltRatio = 0.5,
  emissiveIntensity = 0.5,
  alwaysOnTop = false,
  showAnchor = false,
  bobPhase = 0,
  onClick,
}) {
  const color = getCategoryColor(category)
  const geometry = getPinGeometry(variant)

  // 개수 텍스처는 부스마다 값이 달라서 공유가 안 된다 → 인스턴스별로 만들고 언마운트 때 정리한다.
  // (구역을 전환하면 부스가 통째로 언마운트되므로 dispose가 없으면 GPU 텍스처가 계속 쌓인다.)
  const countTexture = useMemo(
    () => (variant === 'face' ? createCountTexture(Number(count) || 0, color) : null),
    [variant, count, color]
  )
  useEffect(() => () => countTexture?.dispose(), [countTexture])

  const anchorRef = useRef() // 꼭짓점 위치 = 크기 조절 기준점
  const tiltRef = useRef() // 위아래 기울기(매 프레임 카메라 각도로 계산)
  const worldPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock, camera }) => {
    const anchor = anchorRef.current
    if (!anchor) return

    // 아주 살짝만 떠다니게 — 진폭이 크면 지도가 정신없어서 15cm 정도.
    anchor.position.y = hoverHeight + Math.sin(clock.elapsedTime * 1.1 + bobPhase) * 0.15
    anchor.getWorldPosition(worldPos)

    if (constantSize) {
      anchor.scale.setScalar(scale * (camera.position.distanceTo(worldPos) / refDist))
    }

    if (tiltRef.current) {
      // 카메라가 이 핀을 얼마나 위에서 내려다보는지(수평면 기준 올려본 각)
      const dx = camera.position.x - worldPos.x
      const dy = camera.position.y - worldPos.y
      const dz = camera.position.z - worldPos.z
      const pitch = Math.atan2(dy, Math.hypot(dx, dz))
      tiltRef.current.rotation.x = -pitch * tiltRatio
    }
  })

  return (
    <group position={position}>
      {/* 바닥 그림자 + 링 — 핀이 가리키는 지점을 지면에 표시하는 앵커(기본 꺼짐, 7번 항목).
          핀과 달리 월드 크기로 고정해서, 줌아웃해도 지면에 붙어 있는 것처럼 보이게 한다. */}
      {showAnchor ? (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 0]}>
            <planeGeometry args={[3.4 * scale, 3.4 * scale]} />
            <meshBasicMaterial map={getShadowTexture()} transparent depthWrite={false} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
            <ringGeometry args={[0.72 * scale, 0.92 * scale, 48]} />
            <meshBasicMaterial color={color} transparent opacity={0.9} depthWrite={false} />
          </mesh>
        </>
      ) : null}

      {/* 여기 position이 곧 "핀이 가리키는 점", 여기 scale이 곧 핀 크기 — 2번 항목 */}
      <group ref={anchorRef} position={[0, hoverHeight, 0]} scale={scale}>
        <Billboard lockX lockZ>
          <group ref={tiltRef}>
            {/* 지오메트리의 꼭짓점이 y = -L 이므로 +L 올려서 그룹 원점 = 꼭짓점이 되게 한다 */}
            <mesh
              geometry={geometry}
              position={[0, PIN_TIP_LENGTH, 0]}
              renderOrder={alwaysOnTop ? 10 : 0}
              onClick={(e) => {
                e.stopPropagation() // 뒤에 있는 부스 천막까지 같이 클릭되지 않게
                onClick?.()
              }}
              onPointerOver={(e) => {
                e.stopPropagation()
                document.body.style.cursor = 'pointer'
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'auto'
              }}
            >
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={emissiveIntensity}
                metalness={0.25}
                roughness={0.22} // 낮을수록 반들반들 — 레퍼런스의 광택감
                envMapIntensity={1.3}
                depthTest={!alwaysOnTop}
              />
            </mesh>
            {variant === 'face' && (
              <mesh
                position={[0, PIN_TIP_LENGTH, 0.45]} // 0.45 = 두께(0.4)/2 + 베벨(0.14) 바깥 — 더 낮으면 베벨에 파묻혀 안 보인다
                renderOrder={alwaysOnTop ? 11 : 1}
              >
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial map={countTexture} transparent depthTest={!alwaysOnTop} />
              </mesh>
            )}
          </group>
        </Billboard>
      </group>
    </group>
  )
}
