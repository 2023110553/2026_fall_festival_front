import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
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
//
// 2026-09-13(3차): brightnessLevel prop 추가 — 부스 밝기 단계(등불 개수 기반,
// 0~MAX_LANTERN_TIER — constants/lanternTiers.js, 2026-09-18부터 6단계) 임시 미리보기 값을
// MapCanvas로부터 그대로 받아 모든 BoothMarker에 동일하게 전달했었다.
//
// 2026-09-19: 부스별 밝기 자동 계산 + 부스 배치 코드 공통화.
//   - 밝기 단계는 이제 BoothMarker가 place.lantern_count로 직접 계산한다(BoothMarker.jsx 19번 항목).
//     여기서 받는 brightnessLevel은 개발용 override(기본 null = 자동)로만 남아 있고, MapCanvas/MapProvider
//     계약은 그대로다.
//   - places.map → <BoothMarker/> 블록은 ZoneBooths.jsx로 옮겼다. 팔정도/만해광장/학림관 씬에도 같은
//     부스 배치가 들어가면서 네 군데 복사되는 걸 피하기 위함 — 구역 씬은 "지형 glb + ZoneBooths" 두 줄이면 끝.
//   - zone1-booths.sample.json에 부스 8개 추가(105~112, 보행로 B 빈 슬롯 + 경영관 앞 광장 줄) — 좌표
//     근거는 그 파일의 _placement_note_2 참고.
export default function Zone1Scene({ brightnessLevel = null, onBoothClick }) {
  const { scene } = useGLTF('/models/zone1.glb')

  // 2026-09-13: 낮/노을/밤 그림자(PCFSoft, directionalLight) 적용을 위해
  // 지형/건물 glb의 모든 메시가 그림자를 드리우고(cast) 받도록(receive) 설정.
  // 기본값(false)인 채로 두면 그림자가 아예 안 그려지므로 반드시 필요.
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return (
    <>
      <primitive object={scene} />
      <ZoneBooths places={boothData.places} brightnessLevel={brightnessLevel} onBoothClick={onBoothClick} />
    </>
  )
}

useGLTF.preload('/models/zone1.glb')
