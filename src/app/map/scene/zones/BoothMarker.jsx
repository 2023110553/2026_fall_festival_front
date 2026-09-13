// 재사용 가능한 부스(천막) 오브젝트 — 실제 부스 3D 템플릿(.glb)이 아직 없어서
// 좌표 소환 테스트 겸 시각적 데모용으로 만든 맞배지붕(gable) 캐노피 천막 메시.
// 실제 천막 표준 규격(3m x 6m, campus-map/zone1-coordinates.md 참고)에 맞춘 기둥 4개 + 경사 지붕 2면 구성.
//
// 좌표/앵커 규칙(팀 합의, map-section-scope-and-roles.md B안):
//   - 이 컴포넌트는 "부스 오브젝트 + 라벨 앵커 좌표"만 제공한다.
//   - 부스명 등 텍스트 라벨은 여기서 3D 텍스트로 그리지 않는다 — 프론트A가
//     @react-three/drei의 <Html>로 이 앵커(`booth-label-*` 그룹) 위치에 얹어서 그리는 방식(B안)으로 합의됨.
//
// props:
//   - position: [x, y, z] (Three.js 씬 좌표 — y는 이 부스가 놓일 지면의 실제 높이(표고))
//   - rotationY: 라디안 단위 Y축 회전 (부스 정면이 바라보는 방향)
//   - label: 부스 이름 — 라벨 앵커 그룹 이름에만 사용(실제 텍스트 렌더링은 프론트A 담당)
//   - color: 캐노피(지붕 천) 색상 — 카테고리 구분용, 기본값은 무채색 캔버스 톤
//   - accentColor: 용마루 포인트 컬러
export default function BoothMarker({
  position,
  rotationY = 0,
  label,
  color = '#f2ede1',
  accentColor = '#b3372c',
  onClick,
}) {
  const width = 3 // 부스 폭 — 보행로(통로) 쪽으로 보이는 정면 폭
  const depth = 6 // 부스 깊이 — 재사용 천막 표준 규격 3m x 6m
  const poleHeight = 2.1
  const roofRise = 0.9 // 처마 대비 용마루 높이
  const eaveOverhang = 0.3 // 처마가 기둥보다 살짝 튀어나오는 정도

  const halfWidth = width / 2
  const halfDepth = depth / 2
  const poleInsetX = halfWidth - 0.15
  const poleInsetZ = halfDepth - 0.4
  const roofHalfSpan = halfWidth + eaveOverhang
  const roofSlopeLength = Math.sqrt(roofHalfSpan ** 2 + roofRise ** 2)
  const roofSlopeAngle = Math.atan2(roofRise, roofHalfSpan)
  const roofDepth = depth + eaveOverhang * 2

  const poleOffsets = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]

  return (
    <group position={position} rotation={[0, rotationY, 0]} onClick={onClick}>
      {/* 바닥 데크 */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color="#8a7a63" />
      </mesh>

      {/* 기둥 4개 */}
      {poleOffsets.map(([signX, signZ], i) => (
        <mesh
          key={i}
          position={[signX * poleInsetX, poleHeight / 2, signZ * poleInsetZ]}
          castShadow
        >
          <cylinderGeometry args={[0.06, 0.06, poleHeight, 8]} />
          <meshStandardMaterial color="#5a4632" />
        </mesh>
      ))}

      {/* 맞배지붕 캐노피 — 경사면 2장 */}
      <mesh
        position={[-roofHalfSpan / 2, poleHeight + roofRise / 2, 0]}
        rotation={[0, 0, -roofSlopeAngle]}
        castShadow
      >
        <boxGeometry args={[roofSlopeLength, 0.06, roofDepth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        position={[roofHalfSpan / 2, poleHeight + roofRise / 2, 0]}
        rotation={[0, 0, roofSlopeAngle]}
        castShadow
      >
        <boxGeometry args={[roofSlopeLength, 0.06, roofDepth]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 용마루 포인트 컬러 라인 */}
      <mesh position={[0, poleHeight + roofRise + 0.03, 0]}>
        <boxGeometry args={[0.08, 0.08, roofDepth]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* 부스명 라벨 앵커 — 실제 텍스트는 프론트A가 drei Html로 이 좌표 위에 얹음(B안) */}
      {label ? (
        <group name={`booth-label-${label}`} position={[0, poleHeight + roofRise + 0.5, 0]} />
      ) : null}
    </group>
  )
}
