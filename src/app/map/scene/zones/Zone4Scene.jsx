import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
import { useMapZoneBooths } from '../../hooks/useMapZones'

// 구역 4(학림관) 씬 — 지형/건물 .glb 로드 + 부스 목데이터 배치.
//
// 2026-09-16: public/models/hangnimgwan.glb 최초 연결(이슈 #33). 학림관은 기존 3구역과 별개의
// 독립 구역(학림관 건물 + 앞 도로 한 블록)이라 zone4로 추가했다. 당시엔 부스 좌표 데이터가 없어서
// 지형만 렌더링했다.
//
// 2026-09-19: 부스 목데이터 연결 — zone4-booths.sample.json(6개)을 ZoneBooths로 배치한다.
// 학림관 앞 보도는 가로등/가로수/벤치/휴지통이 4m 간격으로 꽉 차 있어 3m 깊이 부스가 들어갈 자리가
// 없어서, 축제 기간 차량 통제를 가정하고 건물 앞 차도의 보도 쪽 차선에 한 줄로 세웠다(횡단보도 앞은
// 비움). 배치 근거는 JSON 상단 _placement_note 참고.
//
// 좌표계 메모: 블렌더 원본(hangnimgwan_building.blend)은 건물 정면이 +y, 건물 중심이 (0,0)이다.
// glTF export(+Y up)에서 (x, y, z) → (x, z, -y)로 바뀌므로 three 기준으로 건물은 x -25~25,
// z -5~5(정면 z=-5 쪽), 도로는 z -20.5~-4.5, 보도 윗면 y=0.12, 도로 윗면 y=0 이다.
//
// glb 최적화(이슈 #33): gltf-transform으로 meshopt 압축(EXT_meshopt_compression) + 정점 양자화 +
// 텍스처 WebP(EXT_texture_webp) + 같은 재질 메시 병합을 적용했다. drei의 useGLTF는 기본값으로
// MeshoptDecoder를 로더에 붙여주고(디코더는 drei에 번들, 외부 CDN 불필요), three r180 GLTFLoader는
// EXT_texture_webp를 지원하므로 추가 설정 없이 그대로 로드된다. 메시가 재질 단위로 병합돼 있어서
// glb 안의 오브젝트 이름으로 건물/시설물을 찾는 코드는 쓸 수 없다(부스 좌표는 JSON 기반이라 무관).
//
// 2026-09-19(2차): booth 스키마를 세호님 '장소 목록 조회' API(GET /api/booths/) 응답과 1:1로 맞춤.
//   - map_x/map_y/map_elevation/rotation이 이제 3D 좌표 그 자체다(명세: FE 씬 좌표 무변환 반환) —
//     별도 coordinates 필드가 없어졌으므로 ZoneBooths에는 boothData.booths를 그대로 넘긴다.
export default function Zone4Scene({ brightnessLevel = null, onBoothClick }) {
  const { booths } = useMapZoneBooths()
  const { scene } = useGLTF('/models/hangnimgwan.glb')

  // Zone1/Zone2Scene과 동일한 이유로 그림자 cast/receive 활성화(기본값 false라 명시 필요).
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
      <ZoneBooths booths={booths} brightnessLevel={brightnessLevel} onBoothClick={onBoothClick} />
    </>
  )
}

useGLTF.preload('/models/hangnimgwan.glb')
