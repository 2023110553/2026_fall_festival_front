import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 지도 위에 떠 있는 부스 마커의 공통 움직임 — 2026-09-24, BoothLantern을 만들면서 BoothPin의 useFrame 로직을 옮겨 왔다.
// (BoothPin.jsx는 #232 자유 회전 브랜치에서 방향 계산을 고친 파일이라 충돌을 피하려고 이번엔 손대지 않았다.
//  기디가 등불을 확정하면 BoothPin을 지우거나 이 훅을 쓰게 바꿔서 중복을 없앤다.)
//
//  1. 위아래로 살짝 떠다님 — 진폭 15cm. bobPhase를 부스마다 다르게 줘야 다 같이 출렁이지 않는다.
//  2. 화면상 크기 고정 — 카메라와의 거리에 비례해 키운다(거리 2배 → 크기 2배 → 화면 크기 일정). 지도 앱 마커의 기본 동작.
//     키우는 기준점은 마커 원점(가장 아래 점)이라, 아무리 키워도 마커가 가리키는 자리가 흘러내리지 않는다.
//  3. 좌우 방향 — 카메라 쪽으로 돈다. drei <Billboard lockX lockZ>는 카메라 회전을 오일러각으로 쪼개서 y만 남기는데,
//     카메라가 내려다보면서 방위각이 90°를 넘으면 분해가 뒤집혀 엉뚱한 방향이 된다(BoothPin 3번 항목, 4개 구역 전부
//     방위각이 0°가 아님). 그래서 카메라와 마커의 수평 위치 차이로 atan2(dx, dz)를 직접 구한다 — 어느 방향에서도 맞다.
//     전제: 마커의 부모 그룹들은 회전돼 있지 않다(ZoneBooths → 구역 씬 전부 회전 없음). 부모가 돌면 그만큼 빼줘야 한다.
//  4. 위아래 기울기 — 카메라 올려본 각 × tiltRatio만큼 카메라 쪽으로 눕힌다. 기본 0(꼿꼿이, 2026-09-23 재원 결정).
//  5. 흔들림 — 매달린 등불처럼 위쪽 한 점을 축으로 좌우로 흔들린다. swayAmplitude(라디안)가 0이면 끈다.
//
// 반환하는 ref를 이 순서로 중첩해서 쓴다: anchor(높이·크기) > yaw(좌우) > tilt(위아래) > sway(흔들림).
// sway 그룹의 원점을 흔들림 축(매달린 점)에 두고, 그 안에서 부품을 다시 내려서 배치하면 된다(BoothLantern 참고).
export function useFloatingMarker({
  hoverHeight,
  scale,
  constantSize = true,
  refDist = 180,
  tiltRatio = 0,
  bobPhase = 0,
  swayAmplitude = 0,
  swaySpeed = 0.9,
}) {
  const anchorRef = useRef(null)
  const yawRef = useRef(null)
  const tiltRef = useRef(null)
  const swayRef = useRef(null)
  const worldPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ clock, camera }) => {
    const anchor = anchorRef.current
    if (!anchor) return
    const time = clock.elapsedTime

    anchor.position.y = hoverHeight + Math.sin(time * 1.1 + bobPhase) * 0.15
    anchor.getWorldPosition(worldPos)

    if (constantSize) {
      anchor.scale.setScalar(scale * (camera.position.distanceTo(worldPos) / refDist))
    }

    const dx = camera.position.x - worldPos.x
    const dy = camera.position.y - worldPos.y
    const dz = camera.position.z - worldPos.z

    if (yawRef.current) {
      // 로컬 +z(마커 앞면)를 y축으로 θ만큼 돌리면 (sin θ, 0, cos θ) — θ = atan2(dx, dz)면 정확히 카메라 쪽을 본다
      yawRef.current.rotation.y = Math.atan2(dx, dz)
    }
    if (tiltRef.current) {
      tiltRef.current.rotation.x = -Math.atan2(dy, Math.hypot(dx, dz)) * tiltRatio
    }
    if (swayRef.current) {
      // 떠다님과 위상을 어긋나게(1.3배) 해서 두 움직임이 같이 맞물려 보이지 않게 한다
      swayRef.current.rotation.z = swayAmplitude ? Math.sin(time * swaySpeed + bobPhase * 1.3) * swayAmplitude : 0
    }
  })

  return { anchorRef, yawRef, tiltRef, swayRef }
}
