import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import ZoneBooths from './ZoneBooths'
import { useMapZoneBooths } from '../../hooks/useMapZones'

// 구역 5(원흥관) 씬 — 지형/건물 .glb 로드 + API 부스 좌표 배치.
//
// 2026-09-20: public/models/zone5.glb 최초 연결. 원흥관은 팔정도에서 법학관 쪽으로 올라간 위치라
// 기존 네 구역(경영관·혜화관 / 팔정도 / 만해광장 / 학림관) 어디에도 붙지 않아서 zone5로 새로 팠다.
// 다른 구역 씬과 완전히 같은 패턴이다 — glb 하나 로드 + ZoneBooths 배치.
// (2026-09-23: 학림관(zone4)이 구역에서 빠지면서 Zone4Scene은 삭제됐다. id는 zone5 그대로 둔다.)
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
// API의 부스 좌표도 전부 이 three 좌표계 값이다.
//
// 카메라 메모: 이 구역 시점은 MapCanvas의 ZONE_CAMERAS.zone5가 맡는다(2026-09-20 구역별 카메라 분리,
// 2026-09-21 재원 요청으로 본동 정면이 있는 -z 쪽에서 보도록 변경). 화면 구도는 카메라 쪽에서 맞추므로
// glb는 오프셋 없이 블렌더 원본 좌표 그대로 내보냈다.
//
// 부스 메모(2026-09-21): 본동 후면 광장에 있던 부스 4개는 뺐고, 지금은 원흥관·본관 사이 골목의 3개만 있다.
//
// glb 최적화: 다른 구역과 같은 파이프라인(gltf-transform meshopt + WebP + 재질별 메시 병합).
// 40.6MB → 1.86MB. 메시가 재질 단위로 병합돼 있어 glb 안 오브젝트 이름으로 건물을 찾는 코드는
// 쓸 수 없다(부스 좌표는 JSON 기반이라 무관). 자세한 절차는 zones/README.md 참고.
//
// 2026-09-21: 지도 크기 2배 — 재원 요청("현재 구조·구성은 그대로 두고 크기만 2배").
// 이 모델은 높이가 실제의 절반쯤으로 만들어져 있다(본동 11.7m ↔ 실측 약 24.5m, 본관 7.8m ↔ 실측 약 15.7m,
// 캠퍼스 좌표 문서의 OSM 값). 그래서 실제 크기(6×3m)인 부스에 비해 건물·골목이 작아 보였다.
// glb는 그대로 두고 여기서 통째로 MAP_SCALE배 키운다(본동 23.4m, 본관 15.6m, 골목 폭 5.25m → 10.5m).
//   - 부스는 실제 크기를 유지해야 해서 이 배율을 받지 않는다(ZoneBooths는 primitive의 형제 노드).
//     대신 API가 2배 배율을 반영한 부스 좌표를 내려줘 같은 자리에 오게 한다.
//   - 그래서 이 구역만 "씬 좌표 = glb(블렌더) 좌표 × MAP_SCALE"이다. 위 좌표계 메모의 범위는 glb 기준
//     값이고, 블렌더에서 새 좌표를 뽑으면 MAP_SCALE을 곱해서 넣어야 한다.
//   - 카메라(MapCanvas의 ZONE_CAMERAS.zone5)도 원점 기준으로 똑같이 2배라 화면 구도는 그대로다.
const MAP_SCALE = 2

export default function Zone5Scene({ brightnessLevel = null, onBoothClick }) {
  const { booths } = useMapZoneBooths()
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
      <primitive object={scene} scale={MAP_SCALE} />
      <ZoneBooths booths={booths} brightnessLevel={brightnessLevel} onBoothClick={onBoothClick} />
    </>
  )
}

useGLTF.preload('/models/zone5.glb')
