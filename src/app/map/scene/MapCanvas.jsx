import { Canvas } from '@react-three/fiber'

// 재원 담당 — 구역별 3D 씬(터레인+건물+부스 앵커)을 감싸는 진입 컴포넌트.
// 프론트1은 이 컴포넌트를 지도 메인 레이아웃 안에 그대로 끼워 넣기만 하면 된다.
//
// props 계약(map-section-scope-and-roles.md에서 합의):
//   - zoneId: 'zone1' | 'zone2' | 'zone3' — 어느 구역 씬을 불러올지
//   - timeOfDay: 'day' | 'sunset' | 'night' — 낮/노을/밤 전환
//   - onBoothClick(boothId): 3D 씬에서 부스 앵커를 레이캐스팅으로 클릭했을 때 호출
//
// 핀 라벨(등불아이콘+개수+부스명)은 여기서 그리지 않는다 — B안 합의대로
// 프론트1이 @react-three/drei의 <Html>로 앵커 좌표 위에 얹어서 그린다 (PinLabel 컴포넌트).
export default function MapCanvas({ zoneId, timeOfDay = 'day', onBoothClick }) {
  return (
    <Canvas camera={{ position: [0, 40, 60], fov: 45 }}>
      {/* TODO: zones/{zoneId} 의 .glb 로드 + timeOfDay에 따른 라이팅/하늘 전환 */}
      {/* TODO: 부스 앵커 클릭 시 onBoothClick(boothId) 호출 (레이캐스팅) */}
      <ambientLight intensity={0.6} />
    </Canvas>
  )
}
