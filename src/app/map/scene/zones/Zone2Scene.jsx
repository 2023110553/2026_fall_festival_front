import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
import boothData from './zone2-booths.sample.json'

// 구역 2(팔정도) 씬 — 지형/건물 .glb 로드 + 부스 목데이터 배치.
//
// 2026-09-15: public/models/zone2.glb 최초 연결(이슈 #22). 당시엔 부스 좌표 데이터가 없어서
// 지형만 렌더링했다.
//
// 2026-09-19: 부스 목데이터 연결 — zone2-booths.sample.json(7개)을 ZoneBooths로 배치한다.
// 좌표는 zone2.glb의 실제 지오메트리(보행로/가로등/나무/벤치 위치)를 읽어서 잡았고, 팔정도는
// 재원 요청대로 대부분 5단계(등불 100개 이상)로 채워 축제 중심 구역답게 가장 밝게 보이도록 했다.
// 배치 근거는 JSON 상단 _placement_note 참고. props(brightnessLevel/onBoothClick) 계약은 Zone1Scene과
// 동일 — MapCanvas가 네 구역에 똑같이 넘겨준다.
//
// 좌표계 메모: 블렌더 원본(paljeongdo_zone.blend)은 광장 중심이 (0,0), +y가 북쪽. glTF export(+Y up)에서
// (x, y, z) → (x, z, -y)로 바뀌므로 three 기준 북쪽 코끼리 받침대가 z≈-15, 남쪽 불상 기단이 z≈+15,
// 법학관이 x 29~47, 명진관이 z 36~61 쪽에 있고 보행로 상면은 y≈0.1이다.
export default function Zone2Scene({ brightnessLevel = null, onBoothClick }) {
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

  return (
    <>
      <primitive object={scene} />
      <ZoneBooths places={boothData.places} brightnessLevel={brightnessLevel} onBoothClick={onBoothClick} />
    </>
  )
}

useGLTF.preload('/models/zone2.glb')
