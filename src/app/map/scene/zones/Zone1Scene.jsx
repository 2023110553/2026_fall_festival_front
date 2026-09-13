import { useGLTF } from '@react-three/drei'
import BoothMarker from './BoothMarker'
import boothData from './zone1-booths.sample.json'

// 구역 1(경영관·혜화관 거리) 씬 — 지형/건물 .glb 로드 + 부스 좌표 JSON을 기반으로
// 부스 오브젝트를 동적으로 배치(clone/instancing)하는 방식 검증용.
//
// 2026-09-13: public/models/zone1.glb를 재원이 작업 중인 실제 상세 지형
// (gyeongyeong_hyehwa_terrain.blend, WIP 스냅샷)으로 교체하고, 그 좌표계에 맞춰
// zone1-booths.sample.json의 목데이터도 다시 잡음. 아직 최종본이 아니므로
// (지형이 계속 업데이트 중) 재원이 작업을 마무리하면 최신 .glb로 다시 교체 필요.
//
// 좌표 변환 메모(중요, 팀 공유 필요):
//   블렌더(Z-up) → glTF 내보내기(+Y Up 기본 옵션) 시 (x, y, z) → (x, z, -y)로 자동 변환됨.
//   즉 블렌더 좌표계 기준(참고: 지금 단계는 재원이 스케치로 직접 잡은 로컬 평면 좌표라
//   나침반 방위와는 무관함 — blender-detail-upgrade-handoff.md 참고),
//   three.x = blender.x, three.y = blender.z(표고/높이), three.z = -blender.y 가 된다.
//   → place_placements 테이블(x, z, rotation)의 z 값도 이 변환이 이미 적용된 값이어야
//     지형 glb와 부스 좌표가 어긋나지 않는다. 재원의 좌표 export 스크립트가
//     이 변환을 빠뜨리면 부스가 항상 앞뒤로 뒤집혀 나타나므로 반드시 확인할 것.
//   → 이 구역은 지면이 평지가 아니라 단(段)이 있는 대지라, y(표고)를 0으로 고정하면
//     안 되고 각 부스가 실제로 놓이는 바닥면의 blender.z 값을 그대로 넘겨줘야 한다
//     (zone1-booths.sample.json의 coordinates.y가 그 값).
export default function Zone1Scene({ onBoothClick }) {
  const { scene } = useGLTF('/models/zone1.glb')

  return (
    <>
      <primitive object={scene} />
      {boothData.places.map((place) => (
        <BoothMarker
          key={place.id}
          position={[place.coordinates.x, place.coordinates.y, place.coordinates.z]}
          rotationY={(place.coordinates.rotation * Math.PI) / 180}
          label={place.name}
          onClick={() => onBoothClick?.(place.id)}
        />
      ))}
    </>
  )
}

useGLTF.preload('/models/zone1.glb')
