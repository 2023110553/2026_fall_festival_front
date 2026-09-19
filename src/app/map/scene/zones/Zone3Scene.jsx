import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
import boothData from './zone3-booths.sample.json'

// 구역 3(만해광장 + 후문쪽 거리) 씬 — 지형/구조물 .glb 로드 + 부스 목데이터 배치.
//
// 2026-09-19: public/models/zone3.glb 최초 연결. 현재 glb는 만해광장 본체(살몬톤 콘크리트 코트 +
// 곡선 계단식 관람석/석재 옹벽 + 목재 데크 무대 정자 + 수목/바위 라인)까지 반영된 상태고,
// "후문쪽 거리" 부분은 재원이 모델링을 추가하면 같은 파일명으로 재-export해서 교체한다(로더는 그대로).
//
// 2026-09-19(2차): 부스 목데이터 연결 — zone3-booths.sample.json(7개)을 ZoneBooths로 배치한다.
// 코트(보행 가능한 평지) 외곽선을 glb에서 다각형으로 뽑아 그 안쪽 가장자리를 따라 둘렀고, 무대 정자와
// 관객이 무대를 보는 코트 중앙은 비워뒀다(배치 근거는 JSON 상단 _placement_note 참고). 후문쪽 거리가
// 모델링되면 그쪽 보행로 부스는 같은 JSON에 이어서 추가하면 된다.
//
// 좌표계 메모: 블렌더 원본(manhae_square_modeling.blend)은 광장 중심이 (0,0)이고 glTF export(+Y up)에서
// (x, y, z) → (x, z, -y)로 바뀐다. three 기준 실측 bbox: x -20.8~21.0, z -15.4~14.2, 코트 바닥 윗면
// y≈0.04, 관람석 최고부 y≈4.5(수목 포함 y≈7.1). 무대 정자는 z +9~+13 쪽, 수목/바위 라인은
// z -13~-15.4 쪽(관람석 능선 위)에 있다.
//
// glb 최적화: 다른 구역과 동일한 gltf-transform 파이프라인(meshopt 압축 + 정점 양자화 + WebP 텍스처 +
// 같은 재질 메시 병합 + 수목 GPU 인스턴싱) 적용, 5.17MB → 0.85MB. 자세한 내용은 zones/README.md 참고.
// 로더 추가 설정은 필요 없다(drei useGLTF 기본 MeshoptDecoder + three r180 EXT_texture_webp).
export default function Zone3Scene({ brightnessLevel = null, onBoothClick }) {
  const { scene } = useGLTF('/models/zone3.glb')

  // Zone1/2/4Scene과 동일한 이유로 그림자 cast/receive 활성화(기본값 false라 명시 필요).
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

useGLTF.preload('/models/zone3.glb')
