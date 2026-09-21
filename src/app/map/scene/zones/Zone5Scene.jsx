import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
import boothData from './zone5-booths.sample.json'

// 구역 5(원흥관) 씬 — 지형/건물 .glb 로드 + 부스 목데이터 배치.
//
// 2026-09-20: public/models/zone5.glb 최초 연결. 원흥관은 팔정도에서 법학관 쪽으로 올라간 위치라
// 기존 네 구역(경영관·혜화관 / 팔정도 / 만해광장 / 학림관) 어디에도 붙지 않아서 zone5로 새로 팠다.
// Zone4Scene(학림관)과 완전히 같은 패턴이다 — glb 하나 로드 + ZoneBooths 배치.
//
// 이 구역에 들어있는 것: 원흥관 본동 + 익랑(ㄱ자로 꺾인 두 동) + 맞은편 본관 + 그 사이 골목.
// 건물이 세 덩어리인 이유는 거리뷰의 골목 구도를 그대로 살리기 위해서다(본관을 빼면 원흥관 앞이
// 허전해지고 실제 캠퍼스 배치와도 달라진다). 자세한 내용은 campus-map 프로젝트 문서
// `wonheunggwan-blender-quality-pass.md` 참고.
//
// 좌표계 메모: 블렌더 원본(wonheunghall_mainhall.blend)에서 glTF export(+Y up) 하면
// (x, y, z) → (x, z, -y)로 바뀐다. three 기준 실제 범위는:
//   - 전체 bbox  x -36~32, y -0.3~12.9(높이), z -16~32
//   - 본동       x -29.9~-2.2, z -10.2~8.0   (y축 기준 -21.3° 회전)
//   - 익랑       x  -2.4~3.5,  z  6.5~23.9
//   - 본관       x   9.2~27.0, z  0.2~25.0
//   - 골목       x   4.3~9.55 (아스팔트 윗면 y=0.02), 광장 윗면 y=0.12
// 부스 좌표(zone5-booths.sample.json)도 전부 이 three 좌표계 값이다.
//
// 카메라 메모: MapCanvas의 고정 카메라([10,140,90] → target [10,3,-30])는 zone1 기준이라
// 이 구역은 화면 아래쪽에 치우쳐 보인다(원흥관 중심이 three z≈8인데 타깃이 z=-30). zone3·zone4도
// 같은 문제를 안고 있고, 구역 전환 카메라 연출을 정할 때 네 구역을 한꺼번에 맞추기로 한 상태라
// 여기서 임시로 오프셋을 주지 않았다 — 지금 옮겨두면 나중에 카메라를 제대로 잡을 때 이 구역만
// 좌표가 어긋난 채 남는다. glb는 블렌더 원본 좌표 그대로 내보냈다.
//
// glb 최적화: 다른 구역과 같은 파이프라인(gltf-transform meshopt + WebP + 재질별 메시 병합).
// 40.6MB → 1.86MB. 메시가 재질 단위로 병합돼 있어 glb 안 오브젝트 이름으로 건물을 찾는 코드는
// 쓸 수 없다(부스 좌표는 JSON 기반이라 무관). 자세한 절차는 zones/README.md 참고.
export default function Zone5Scene({ brightnessLevel = null, onBoothClick }) {
  const { scene } = useGLTF('/models/zone5.glb')

  // Zone1~4Scene과 동일한 이유로 그림자 cast/receive 활성화(기본값 false라 명시 필요).
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
      <ZoneBooths booths={boothData.booths} brightnessLevel={brightnessLevel} onBoothClick={onBoothClick} />
    </>
  )
}

useGLTF.preload('/models/zone5.glb')
