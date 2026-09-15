import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'

// 구역 2(팔정도) 씬 — 지형/건물 .glb 로드.
//
// 2026-09-15: public/models/zone2.glb 최초 연결(이슈 #22). 아직 부스 좌표 데이터가
// 없어서 Zone1Scene과 달리 부스(BoothMarker) 배치 로직은 포함하지 않음 — 부스 사양/좌표가
// 확정되면 Zone1Scene과 동일한 패턴(zone2-booths.*.json + BoothMarker map, brightnessLevel/
// onBoothClick props)으로 이 자리에 추가하면 된다.
export default function Zone2Scene() {
  const { scene } = useGLTF('/models/zone2.glb')

  // Zone1Scene과 동일한 이유로 그림자 cast/receive 활성화(기본값 false라 명시 필요) —
  // 낮/노을/밤 directionalLight 그림자가 이 구역에서도 정상적으로 그려지게 하기 위함.
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

useGLTF.preload('/models/zone2.glb')
