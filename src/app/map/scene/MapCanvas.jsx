import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Selection, SelectiveBloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import Zone1Scene from './zones/Zone1Scene'
import SceneEnvironment from './environment/SceneEnvironment'

// 재원 담당 — 구역별 3D 씬(터레인+건물+부스 앵커)을 감싸는 진입 컴포넌트.
// 프론트1은 이 컴포넌트를 지도 메인 레이아웃 안에 그대로 끼워 넣기만 하면 된다.
//
// props 계약(map-section-scope-and-roles.md에서 합의):
//   - zoneId: 'zone1' | 'zone2' | 'zone3' — 어느 구역 씬을 불러올지
//   - timeOfDay: 'day' | 'sunset' | 'night' — 낮/노을/밤 전환
//   - boothBrightnessPreview: 0~4 — 부스 밝기 단계 임시 미리보기 값(2026-09-13 추가).
//     실제 등불 개수(lantern_count) 연동 전까지 MapShell 버튼으로 전체 부스에 동일하게
//     적용해보는 값 — 나중에 부스별 실제 값으로 교체될 자리(그때는 이 prop 자체가 없어지고
//     Zone1Scene이 boothData에서 직접 lantern_count를 읽어 계산할 가능성이 높음).
//   - onBoothClick(boothId): 3D 씬에서 부스 앵커를 레이캐스팅으로 클릭했을 때 호출
//
// 핀 라벨(등불아이콘+개수+부스명)은 여기서 그리지 않는다 — B안 합의대로
// 프론트1이 @react-three/drei의 <Html>로 앵커 좌표 위에 얹어서 그린다 (PinLabel 컴포넌트).
//
// 2026-09-13: 부스 좌표(JSON) → 3D 씬 소환 파이프라인 검증용으로 zone1만 우선 연결.
// zone2/zone3는 아직 지형 glb/부스 좌표 정리 전이라 TODO로 남겨둠.
//
// 2026-09-13(2차): timeOfDay(낮/노을/밤 라이팅·하늘 전환) 구현.
// 실제 하늘/조명/그림자 값은 전부 environment/SceneEnvironment.jsx +
// environment/timeOfDayPresets.js 에서 관리한다 — MapCanvas는 timeOfDay 문자열만 그대로 넘긴다.
// (지금은 MapShell 버튼 클릭으로 즉시 전환하지만, 나중에 실시간 시계 기반 자동 전환으로 바꿔도
// "timeOfDay 문자열을 넘긴다"는 이 계약만 유지되면 이 컴포넌트는 손댈 필요가 없다.)
//
// 2026-09-13(4차): 랜턴/부스 천막 빛 확산(블룸) 효과 추가.
// 재원 요청 — "색상만 밝아지는 게 아니라 빛이 번지는(블러) 효과가 있으면 좋겠다."
// @react-three/postprocessing의 SelectiveBloom을 사용 — 일반 Bloom과 달리 씬 전체가
// 아니라 <Select enabled> 로 표시한 오브젝트만 골라서 블룸(빛 번짐) 처리할 수 있다.
// 그래서 지형/건물처럼 밝은 부분(예: 낮 시간대 흰 지붕)까지 같이 번지지 않고,
// 랜턴 유리 패널 + 부스 지붕/처마 띠(등불 단계>0일 때)만 정확히 번지게 했다.
// <Selection>으로 감싼 범위 안에서 BoothMarker(Zone1Scene 하위)가 <Select enabled>로
// 표시한 메시들을 이 EffectComposer가 자동으로 찾아 처리한다(부스 컴포넌트 쪽은
// react-three/postprocessing을 직접 import하지 않고 그냥 <Select>만 쓰면 되는 구조).
//
// 2026-09-13(5차): 광원(랜턴+조명끈) 블룸을 극단적으로 강화 — 재원 요청("부스 광원의
// 정도를 극단적으로 올려줄 수 있어?"). BoothMarker.jsx 쪽에서 emissiveIntensity를
// 1.3~1.4 → 5로 올린 것과 짝을 맞춰서, 여기 SelectiveBloom도 intensity 0.6→1.4,
// radius 0.4→0.6으로 키우고 luminanceThreshold도 0.25→0.15로 낮춰서 더 넓고 강하게
// 번지도록 했다. 예전(4번 항목, 부스 지붕/처마가 emissive였던 시절)에는 이 정도로 올리면
// 지붕 색이 하얗게 날아가는 문제가 있었지만, 지금은 지붕/처마가 emissive를 아예 안 쓰므로
// (BoothMarker.jsx 9번 항목) 그 부작용 없이 광원만 극적으로 밝힐 수 있다.
export default function MapCanvas({ zoneId, timeOfDay = 'day', boothBrightnessPreview = 0, onBoothClick }) {
  return (
    <Canvas
      camera={{ position: [10, 140, 90], fov: 45, near: 1, far: 2000 }}
      shadows={{ type: THREE.PCFSoftShadowMap }}
    >
      <Selection>
        <SceneEnvironment timeOfDay={timeOfDay} />
        <Suspense fallback={null}>
          {zoneId === 'zone1' ? (
            <Zone1Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
          ) : (
            // TODO: zone2(팔정도), zone3(만해광장+후문쪽 거리) 씬 연결
            null
          )}
        </Suspense>
        {/* 디버그/검증 편의를 위한 임시 카메라 컨트롤 — 실제 구역 전환 카메라 연출이 정해지면 교체 예정 */}
        {/* 2026-09-13: 카메라 위치/타깃을 재원의 실제 상세 지형(WIP) 좌표 범위에 맞춰 재조정 */}
        <OrbitControls target={[10, 3, -30]} />
        <EffectComposer>
          <SelectiveBloom mipmapBlur luminanceThreshold={0.15} luminanceSmoothing={0.4} intensity={1.4} radius={0.6} />
        </EffectComposer>
      </Selection>
    </Canvas>
  )
}
