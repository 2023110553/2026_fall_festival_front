import { useMemo } from 'react'
import * as THREE from 'three'
import { BOOTH_STRUCTURE, BOOTH_STRUCTURE_SPECS } from '../../../../constants/boothSizes'

// 플리마켓 — 대형 차양막(쉐이드세일) 한 장. 2026-09-26 추가, 같은 날 형태 교체.
//
// 처음엔 21 × 12 구역에 2 × 2 매대 18개를 깔았는데 재원이 "디자인 별로"로 반려.
// 재원이 공유한 사진(수영장 위 사각 차양막) 기준으로, **안에 아무것도 없는 천 한 장**으로 바꿨다.
// structure === "MARKET"일 때 BoothMarker가 이걸 그린다(constants/boothSizes.js 2026-09-26 항목).
//
// 차양막처럼 보이게 하는 건 결국 두 가지다 — 안 해두면 그냥 평평한 판때기가 된다.
//   1) 네 변이 안쪽으로 오목하게 들어간다(장력 때문에 생기는 모양. 사진에서 제일 눈에 띄는 특징)
//   2) 네 귀퉁이 높이가 서로 달라서 면이 비틀린다(hypar). 가운데는 살짝 처진다
// 그래서 면을 Coons 패치로 만든다 — 네 변(오목한 곡선)을 먼저 정의하고 그 사이를 보간하는 방식이라,
// 변의 오목함이 면 안쪽까지 자연스럽게 이어진다. 평면을 만들어 놓고 꼭짓점만 밀면 변만 꺾이고 면은 안 따라온다.
//
// 크기는 placements의 width/depth를 그대로 쓴다(기본 21 × 12). 기둥은 네 귀퉁이에 서고,
// 장력을 받는 방향이라 바깥쪽으로 조금 기울어 있다.

const SPEC = BOOTH_STRUCTURE_SPECS[BOOTH_STRUCTURE.MARKET]

// 귀퉁이 기둥 높이(m) — 마주보는 쌍끼리 다르게 줘서 면이 비틀리게 한다
const CORNER_HIGH = 4.4
const CORNER_LOW = 3.8
const CENTER_SAG = 0.45 // 가운데 처짐
const EDGE_INSET = 0.075 // 변이 안쪽으로 들어가는 정도(짧은 변 길이 대비)
const EDGE_DROP = 0.35 // 변 중앙이 귀퉁이보다 내려앉는 정도
const SEG_U = 30
const SEG_V = 20

const FABRIC = '#E8CE96'
const FABRIC_EDGE = '#C9A86A'
const POLE = '#9AA3AE'

// 오목한 변 하나. a→b를 잇되 가운데가 normal 방향으로 inset만큼 들어가고 drop만큼 내려간다.
function edgePoint(a, b, t, nx, nz, inset, drop) {
  const bow = Math.sin(Math.PI * t)
  return [
    a[0] + (b[0] - a[0]) * t + nx * inset * bow,
    a[1] + (b[1] - a[1]) * t - drop * bow,
    a[2] + (b[2] - a[2]) * t + nz * inset * bow,
  ]
}

function buildSail(width, depth) {
  const hw = width / 2
  const hd = depth / 2
  const inset = Math.min(width, depth) * EDGE_INSET

  // 귀퉁이 — 시계방향으로 높이를 번갈아 준다
  const P00 = [-hw, CORNER_HIGH, -hd]
  const P10 = [hw, CORNER_LOW, -hd]
  const P11 = [hw, CORNER_HIGH, hd]
  const P01 = [-hw, CORNER_LOW, hd]

  // 네 변(오목). 법선은 전부 면 안쪽(가운데)을 향한다
  const C0 = (u) => edgePoint(P00, P10, u, 0, 1, inset, EDGE_DROP) // v=0, +z로 들어감
  const C1 = (u) => edgePoint(P01, P11, u, 0, -1, inset, EDGE_DROP) // v=1
  const D0 = (v) => edgePoint(P00, P01, v, 1, 0, inset, EDGE_DROP) // u=0, +x로 들어감
  const D1 = (v) => edgePoint(P10, P11, v, -1, 0, inset, EDGE_DROP) // u=1

  const positions = new Float32Array((SEG_U + 1) * (SEG_V + 1) * 3)
  const uvs = new Float32Array((SEG_U + 1) * (SEG_V + 1) * 2)
  let p = 0
  let q = 0
  for (let j = 0; j <= SEG_V; j += 1) {
    const v = j / SEG_V
    const d0 = D0(v)
    const d1 = D1(v)
    for (let i = 0; i <= SEG_U; i += 1) {
      const u = i / SEG_U
      const c0 = C0(u)
      const c1 = C1(u)
      // Coons 패치: 변끼리 보간한 값에서 겹쳐 더해진 귀퉁이 성분(이중선형)을 뺀다
      for (let k = 0; k < 3; k += 1) {
        const ruled =
          (1 - v) * c0[k] + v * c1[k] + (1 - u) * d0[k] + u * d1[k]
        const bilinear =
          (1 - u) * (1 - v) * P00[k] + u * (1 - v) * P10[k] +
          (1 - u) * v * P01[k] + u * v * P11[k]
        positions[p + k] = ruled - bilinear
      }
      // 가운데 처짐 — 변에서는 0이고 한가운데서 최대
      positions[p + 1] -= CENTER_SAG * Math.sin(Math.PI * u) * Math.sin(Math.PI * v)
      uvs[q] = u
      uvs[q + 1] = v
      p += 3
      q += 2
    }
  }

  const indices = []
  for (let j = 0; j < SEG_V; j += 1) {
    for (let i = 0; i < SEG_U; i += 1) {
      const a = j * (SEG_U + 1) + i
      const b = a + 1
      const c = a + SEG_U + 1
      const d = c + 1
      indices.push(a, c, b, b, c, d)
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()

  return { geometry, corners: [P00, P10, P11, P01] }
}

export default function MarketArea({ width = SPEC.width, depth = SPEC.depth, lightScale = 1 }) {
  const { geometry, corners } = useMemo(() => buildSail(width, depth), [width, depth])

  return (
    <group>
      {/* 천 — 양면(side=2). 아래에서 올려다볼 일이 많아서 한 면만 그리면 뚫려 보인다 */}
      <mesh geometry={geometry} castShadow>
        <meshStandardMaterial
          color={FABRIC}
          side={2}
          roughness={0.85}
          metalness={0}
          // 밤에 새까매지지 않게 아주 약한 자체발광을 깔아둔다. 천막 조명과 같은 방식이라 광원은 안 는다
          emissive={FABRIC}
          emissiveIntensity={0.12 * lightScale}
        />
      </mesh>

      {/* 귀퉁이 기둥 — 장력을 받는 쪽이라 바깥으로 조금 눕는다 */}
      {corners.map(([cx, cy, cz], i) => {
        const lean = 0.09
        const dirX = Math.sign(cx) * lean
        const dirZ = Math.sign(cz) * lean
        const baseX = cx + dirX * cy
        const baseZ = cz + dirZ * cy
        return (
          <group key={`pole${i}`}>
            <mesh position={[(cx + baseX) / 2, cy / 2, (cz + baseZ) / 2]} rotation={[dirZ, 0, -dirX]} castShadow>
              <cylinderGeometry args={[0.07, 0.1, cy, 10]} />
              <meshStandardMaterial color={POLE} metalness={0.55} roughness={0.4} />
            </mesh>
            {/* 바닥 받침 */}
            <mesh position={[baseX, 0.06, baseZ]}>
              <cylinderGeometry args={[0.28, 0.32, 0.12, 12]} />
              <meshStandardMaterial color="#6E757F" metalness={0.4} roughness={0.6} />
            </mesh>
            {/* 귀퉁이 고리 — 천이 기둥 머리에 매달린 티를 낸다 */}
            <mesh position={[cx, cy - 0.06, cz]}>
              <torusGeometry args={[0.13, 0.03, 6, 12]} />
              <meshStandardMaterial color={FABRIC_EDGE} metalness={0.3} roughness={0.6} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}
