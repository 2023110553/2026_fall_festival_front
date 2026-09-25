import { useEffect, useMemo } from 'react'
import { useTimeOfDay } from '../environment/TimeOfDayContext'
import {
  LANTERN_BODY_CENTER_Y,
  LANTERN_HALO_SIZE,
  LANTERN_HANG_Y,
  createLanternCountTexture,
  createLanternNumberMaterial,
  getLanternGeometries,
  getLanternMaterials,
} from './lanternGeometry'
import { useFloatingMarker } from './useFloatingMarker'

// 부스 위에 떠 있는 등불 마커 — 2026-09-24, 3D 물방울 핀(BoothPin)을 대체(기디 요청, 재원 승인).
// 결정 기록: campus-map/booth-lantern-marker-plan.md
//
// 무엇이 바뀌었나:
//   - 모양: 물방울 핀 → 레퍼런스의 종이 등불(몸통 + 세로 리브 + 위아래 칼라 + 금색 구슬 + 술). 모양 코드는 lanternGeometry.js.
//   - 색: 카테고리 색 → 기디 분류 기준(주간 부스/푸드트럭 · 야간 단과대별/동아리 · 동빛 에코코 · 그 외).
//     색을 정하는 건 constants/boothMarkerColors.js(getBoothMarkerStyle)이고, 여기는 받은 색으로 그리기만 한다.
//   - 숫자: 흰 원 위 숫자 → 몸통 곡면에 붙은 숫자. 시설(등불을 받을 수 없는 곳)은 count = null → 숫자 없는 빈 등불.
//   - 빛: 밤에는 몸통이 안에서 켜진 것처럼 밝고(앞면 가운데가 가장 밝은 발광 마스크) 뒤로 후광이 퍼진다. 낮에는 끈다.
// 그대로인 것(BoothPin과 같은 규칙 — useFloatingMarker.js): 화면상 크기 고정, 위아래로 떠다님, 좌우만 카메라를 봄,
//   클릭하면 부스 바텀시트. 원점(술 끝)이 hoverHeight 높이에 오는 것도 같아서 천막과 겹치지 않는 높이(5.5m)를 그대로 쓴다.
//
// 왜 형제 컴포넌트인가(BoothMarker 안에 넣지 않은 이유)는 BoothPin과 같다 — map-section-scope-and-roles.md의 B안
// 합의대로 BoothMarker는 "천막 + 라벨 앵커"까지만 책임지고, 마커는 ZoneBooths가 같은 좌표에 나란히 놓는다.
//
// props:
//   - position: [x, y, z] 부스(대표 천막)의 지면 좌표 — BoothMarker에 넘기는 것과 같은 값
//   - colors: { body, key } — getBoothMarkerStyle(booth, timeSlot) 결과를 그대로 넘기면 된다
//   - count: 몸통에 찍을 등불 개수. null이면 숫자 없는 빈 등불(시설) — getBoothLanternCount(booth)
//   - scale / hoverHeight / constantSize / refDist / tiltRatio / bobPhase: BoothPin과 같은 의미(useFloatingMarker.js)
//   - sway: 좌우 흔들림 켜기(기본 true). ?lanternSway=0 으로 끄고 비교할 수 있다(boothPinPreview.js)
//   - alwaysOnTop: 건물·나무에 안 가려지게(깊이 테스트 끔). 등불끼리 앞뒤가 깨지는 부작용은 BoothPin 5번 항목과 같다
//   - onClick: 부스 클릭 콜백(ZoneBooths가 onBoothClick으로 연결)
const SWAY_AMPLITUDE = 0.05 // 라디안(약 3°) — 더 크면 숫자가 흔들려서 읽기 어렵다

export default function BoothLantern({
  position,
  colors,
  count = null,
  scale = 2.2,
  hoverHeight = 5.5,
  constantSize = true,
  refDist = 180,
  tiltRatio = 0,
  sway = true,
  alwaysOnTop = false,
  bobPhase = 0,
  onClick,
}) {
  const timeOfDay = useTimeOfDay()
  const geometries = getLanternGeometries()
  const materials = getLanternMaterials(colors, timeOfDay, alwaysOnTop)

  // 숫자 텍스처·재질은 부스마다 달라서 인스턴스별로 만들고 바뀌거나 언마운트될 때 정리한다
  // (구역을 바꾸면 부스가 통째로 언마운트되므로 dispose가 없으면 GPU 텍스처가 계속 쌓인다).
  const numberMaterial = useMemo(() => {
    if (count == null) return null
    return createLanternNumberMaterial(createLanternCountTexture(count, colors.key), alwaysOnTop)
  }, [count, colors.key, alwaysOnTop])
  useEffect(
    () => () => {
      numberMaterial?.map?.dispose()
      numberMaterial?.dispose()
    },
    [numberMaterial]
  )

  const { anchorRef, yawRef, tiltRef, swayRef } = useFloatingMarker({
    hoverHeight,
    scale,
    constantSize,
    refDist,
    tiltRatio,
    bobPhase,
    swayAmplitude: sway ? SWAY_AMPLITUDE : 0,
  })

  const handleClick = (event) => {
    event.stopPropagation() // 뒤에 있는 부스 천막까지 같이 클릭되지 않게
    onClick?.()
  }
  const handlePointerOver = (event) => {
    event.stopPropagation()
    document.body.style.cursor = 'pointer'
  }
  const handlePointerOut = () => {
    document.body.style.cursor = 'auto'
  }

  // 항상 위 모드에서는 깊이 테스트가 꺼져서 그리는 순서가 곧 앞뒤다 — 후광 → 몸통 → 장식 → 숫자 순으로 고정한다
  const order = (value) => (alwaysOnTop ? 10 + value : value)

  return (
    <group position={position}>
      <group ref={anchorRef} position={[0, hoverHeight, 0]} scale={scale}>
        <group ref={yawRef}>
          <group ref={tiltRef}>
            {/* 흔들림 축 = 위 칼라 윗면(매달린 점). 축 그룹을 거기로 올리고, 부품은 원래 좌표로 다시 내린다. */}
            <group ref={swayRef} position={[0, LANTERN_HANG_Y, 0]}>
              <group position={[0, -LANTERN_HANG_Y, 0]}>
                {materials.halo ? (
                  <sprite
                    material={materials.halo}
                    position={[0, LANTERN_BODY_CENTER_Y, 0]}
                    scale={[LANTERN_HALO_SIZE, LANTERN_HALO_SIZE, 1]}
                    renderOrder={order(0)}
                  />
                ) : null}
                <mesh
                  geometry={geometries.body}
                  material={materials.body}
                  renderOrder={order(1)}
                  onClick={handleClick}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
                />
                <mesh geometry={geometries.ribs} material={materials.rib} renderOrder={order(2)} />
                <mesh geometry={geometries.collars} material={materials.collar} renderOrder={order(2)} />
                <mesh geometry={geometries.opening} material={materials.opening} renderOrder={order(2)} />
                <mesh geometry={geometries.gold} material={materials.gold} renderOrder={order(2)} />
                <mesh
                  geometry={geometries.tassel}
                  material={materials.tassel}
                  renderOrder={order(2)}
                  onClick={handleClick}
                  onPointerOver={handlePointerOver}
                  onPointerOut={handlePointerOut}
                />
                {numberMaterial ? (
                  <mesh
                    geometry={geometries.numberPatch}
                    material={numberMaterial}
                    renderOrder={order(3)}
                    onClick={handleClick}
                    onPointerOver={handlePointerOver}
                    onPointerOut={handlePointerOut}
                  />
                ) : null}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}
