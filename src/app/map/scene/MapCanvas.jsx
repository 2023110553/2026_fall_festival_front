import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Zone1Scene from './zones/Zone1Scene'

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
//
// 2026-09-13: 부스 좌표(JSON) → 3D 씬 소환 파이프라인 검증용으로 zone1만 우선 연결.
// zone2/zone3는 아직 지형 glb/부스 좌표 정리 전이라 TODO로 남겨둠.
// timeOfDay(낮/노을/밤 라이팅·하늘 전환)도 아직 미구현 — 다음 단계.
export default function MapCanvas({ zoneId, timeOfDay = 'day', onBoothClick }) {
  return (
    <Canvas camera={{ position: [10, 140, 90], fov: 45, near: 1, far: 2000 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[100, 200, 100]} intensity={1} />
      <Suspense fallback={null}>
        {zoneId === 'zone1' ? (
          <Zone1Scene onBoothClick={onBoothClick} />
        ) : (
          // TODO: zone2(팔정도), zone3(만해광장+후문쪽 거리) 씬 연결
          null
        )}
      </Suspense>
      {/* 디버그/검증 편의를 위한 임시 카메라 컨트롤 — 실제 구역 전환 카메라 연출이 정해지면 교체 예정 */}
      {/* 2026-09-13: 카메라 위치/타깃을 재원의 실제 상세 지형(WIP) 좌표 범위에 맞춰 재조정 */}
      <OrbitControls target={[10, 3, -30]} />
    </Canvas>
  )
}
