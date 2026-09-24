import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Selection, SelectiveBloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'
import Zone1Scene from './zones/Zone1Scene'
import Zone2Scene from './zones/Zone2Scene'
import Zone3Scene from './zones/Zone3Scene'
import Zone4Scene from './zones/Zone4Scene'
import Zone5Scene from './zones/Zone5Scene'
import SceneEnvironment from './environment/SceneEnvironment'
import { TimeOfDayContext } from './environment/TimeOfDayContext'

// 재원 담당 — 구역별 3D 씬(터레인+건물+부스 앵커)을 감싸는 진입 컴포넌트.
// 프론트1은 이 컴포넌트를 지도 메인 레이아웃 안에 그대로 끼워 넣기만 하면 된다.
//
// props 계약(map-section-scope-and-roles.md에서 합의):
//   - zoneId: 'zone1' | 'zone2' | 'zone3' — 어느 구역 씬을 불러올지
//   - timeOfDay: 'day' | 'sunset' | 'night' — 낮/노을/밤 전환
//   - boothBrightnessPreview: (선택) 부스 밝기 단계 override, null이면 자동. 2026-09-13에 "실제 등불 개수
//     연동 전 전체 부스에 같은 단계를 넣어보는 임시 미리보기"로 추가했고(2026-09-18 구간 0/1/10/30/50/100개
//     → 6단계 확장), 2026-09-19부터는 부스별 lantern_count로 BoothMarker가 단계를 스스로 계산하므로
//     기본값이 0 → null(자동)로 바뀌었다. 숫자를 넣으면 네 구역 모든 부스가 그 단계로 강제되는 개발용
//     스위치로만 남아 있다(BoothMarker.jsx 19번 항목).
//   - onBoothClick(boothId): 3D 씬에서 부스 앵커를 레이캐스팅으로 클릭했을 때 호출
//
// 핀 라벨(등불아이콘+개수+부스명)은 여기서 그리지 않는다 — B안 합의대로
// 프론트1이 @react-three/drei의 <Html>로 앵커 좌표 위에 얹어서 그린다 (PinLabel 컴포넌트).
//
// 2026-09-13: 부스 좌표(JSON) → 3D 씬 소환 파이프라인 검증용으로 zone1만 우선 연결.
// zone2/zone3는 아직 지형 glb/부스 좌표 정리 전이라 TODO로 남겨둠.
//
// 2026-09-15: zone2(팔정도) 연결(이슈 #22) — Zone2Scene은 아직 부스 좌표가 없어서
// brightnessLevel/onBoothClick 없이 지형만 렌더링한다. zone3(만해광장+후문쪽 거리)는
// 여전히 TODO.
//
// 2026-09-16: zone4(학림관) 연결 + zone1/zone2 glb를 디테일 개선본으로 교체(이슈 #33).
// 세 glb 모두 gltf-transform으로 meshopt 압축·WebP 텍스처·재질별 메시 병합을 적용한 최적화본이라
// (zone1 기준 메시 1,533 → 91개) 드로우콜이 크게 줄었다. 로더 쪽 추가 설정은 필요 없다
// (drei useGLTF 기본 MeshoptDecoder + three r180의 EXT_texture_webp 지원). 자세한 파이프라인은
// zones/README.md 참고. 카메라 위치/타깃은 아직 zone1 기준 임시값이라 zone4에선 건물이 화면
// 위쪽에 치우쳐 보일 수 있음 — 구역 전환 카메라 연출을 정할 때 함께 조정 예정.
//
// 2026-09-16(2차, 이슈 #37): 톤매핑 복구 — 재원 피드백 "낮은 너무 쨍하고 밤은 너무 어둡다"의 근본 원인.
// @react-three/postprocessing의 <EffectComposer>는 마운트되는 동안 renderer.toneMapping을
// NoToneMapping으로 강제한다(HDR 버퍼에서 효과를 계산하려는 라이브러리 설계). 그래서 블룸을 넣은
// 2026-09-13 이후로 씬이 톤매핑 없이 화면에 나가고 있었음 → 밝은 값은 1.0에서 딱 잘리고(하이라이트가
// 하얗게 날아가 "쨍한" 느낌), 어두운 값은 눌린 채 그대로. 해결은 파이프라인 마지막에 <ToneMapping>
// 효과를 넣어 블룸까지 계산된 HDR 결과를 한 번에 ACES Filmic 커브로 내리는 것. 조명 세기/환경광은
// environment/timeOfDayPresets.js에서 같이 손봤다(그 파일 주석 참고).
// 순서가 중요: SelectiveBloom(HDR에서 빛 번짐 계산) → ToneMapping(LDR로 내림). 반대로 두면 블룸이 죽는다.
// 같이 고친 것 — SelectiveBloom에 ignoreBackground 추가. SelectiveBloom은 "선택한 오브젝트의 깊이 == 씬 깊이"인
// 픽셀만 번지게 하는데, 기본값에서는 아무것도 안 그려진 배경 픽셀(깊이 최대)도 "일치"로 쳐서 배경 전체가 블룸에
// 들어가고 있었다. 낮 배경(#f5f5f5)은 밝기 임계값(0.15)을 훌쩍 넘으니 화면 전체에 뿌연 안개 + 배경이 하얗게 날아가는
// 결과 → 이것도 "쨍함"의 큰 원인이었음(헤드리스 렌더에서 확인). ignoreBackground를 켜면 배경은 블룸 계산에서 빠지고
// 랜턴/조명끈 같은 실제 선택 오브젝트만 번진다.
//
// 2026-09-19: zone3(만해광장) 연결(이슈 #63) — 이로써 확정 3구역 + 학림관까지 모든 구역 씬이 연결됐다.
// 현재 zone3.glb는 만해광장 본체까지이고 "후문쪽 거리"는 모델링이 추가되면 같은 파일명으로
// 재-export해서 교체한다. 만해광장은 중심이 원점 근처(x -21~21, z -15~14)라 zone1 기준 고정
// 카메라([10,140,90] → target [10,3,-30])에서는 꽤 멀리/위에서 보인다 — 구역 전환 카메라 연출을
// 정할 때 zone4와 함께 조정 예정.
//
// 2026-09-19(2차): 네 구역 모두 API 부스 데이터와 zones/ZoneBooths.jsx를 연결.
// 그래서 Zone2/3/4Scene도 Zone1Scene과 같은 props(brightnessLevel/onBoothClick)를 받게 됐고, 이 컴포넌트는
// 네 구역에 똑같은 값을 넘긴다. 부스 밝기는 이제 각 부스의 lantern_count로 자동 계산되므로(BoothMarker.jsx
// 19번 항목) boothBrightnessPreview는 null(자동)이 기본이다.
// 같이 추가된 것 — <TimeOfDayContext.Provider>: 부스가 시간대를 알아야 낮에 바닥 글로우를 눌러줄 수 있어서
// (BoothMarker.jsx 20번 항목) timeOfDay를 씬 안쪽 컨텍스트로도 흘려보낸다. SceneEnvironment는 기존대로
// prop으로 받는다(바꿀 이유가 없어서 그대로 둠).
//
// 2026-09-13(2차): timeOfDay(낮/노을/밤 라이팅·하늘 전환) 구현.
// 실제 하늘/조명/그림자 값은 전부 environment/SceneEnvironment.jsx +
// environment/timeOfDayPresets.js 에서 관리한다 — MapCanvas는 timeOfDay 문자열만 그대로 넘긴다.
// (지금은 MapShell 버튼 클릭으로 즉시 전환하지만, 나중에 실시간 시계 기반 자동 전환으로 바꿔도
// "timeOfDay 문자열을 넘긴다"는 이 계약만 유지되면 이 컴포넌트는 손댈 필요가 없다.)
//
// 2026-09-13(4차): 랜턴/부스 천막 빛 확산(블룸) 효과 추가.
// 재원 요청 — "색상만 밝아지는 게 아니라 빛이 번지는(블러) 효과가 있으면 좋겠다."
// @react-three/postprocessing의 SelectiveBloom을 사용 — 일반 Bloom과 달리 씬 전체가
// 아니라 <Select enabled> 로 표시한 오브젝트만 골라서 블룸(빛 번짐) 처리할 수 있다.
// 그래서 지형/건물처럼 밝은 부분(예: 낮 시간대 흰 지붕)까지 같이 번지지 않고,
// 랜턴 유리 패널 + 부스 지붕/처마 띠(등불 단계>0일 때)만 정확히 번지게 했다.
// <Selection>으로 감싼 범위 안에서 BoothMarker(Zone1Scene 하위)가 <Select enabled>로
// 표시한 메시들을 이 EffectComposer가 자동으로 찾아 처리한다(부스 컴포넌트 쪽은
// react-three/postprocessing을 직접 import하지 않고 그냥 <Select>만 쓰면 되는 구조).
//
// 2026-09-13(5차): 광원(랜턴+조명끈) 블룸을 극단적으로 강화 — 재원 요청("부스 광원의
// 정도를 극단적으로 올려줄 수 있어?"). BoothMarker.jsx 쪽에서 emissiveIntensity를
// 1.3~1.4 → 5로 올린 것과 짝을 맞춰서, 여기 SelectiveBloom도 intensity 0.6→1.4,
// radius 0.4→0.6으로 키우고 luminanceThreshold도 0.25→0.15로 낮춰서 더 넓고 강하게
// 번지도록 했다. 예전(4번 항목, 부스 지붕/처마가 emissive였던 시절)에는 이 정도로 올리면
// 지붕 색이 하얗게 날아가는 문제가 있었지만, 지금은 지붕/처마가 emissive를 아예 안 쓰므로
// (BoothMarker.jsx 9번 항목) 그 부작용 없이 광원만 극적으로 밝힐 수 있다.
// 2026-09-20: zone5(원흥관) 연결 + 카메라를 구역별로 분리.
// 지금까지 네 구역이 zone1 기준 고정 카메라([10,140,90] → target [10,3,-30])를 같이 썼는데,
// 구역마다 모델의 위치·크기가 달라서 zone3(만해광장)는 멀리, zone4(학림관)는 화면 위쪽에 치우쳐
// 보이는 문제가 있었다(zones/README.md에도 TODO로 적혀 있던 것). 원흥관은 씬 중심이 z≈8인데
// 타깃이 z=-30이라 아예 화면 구석으로 밀려나서, 이번에 ZONE_CAMERAS 표로 분리했다.
//
// 처음 분리할 때는 zone1~zone4 값을 기존 고정값 그대로 옮겨 적어서 화면이 바뀌지 않게 했다.
// 이후 재원 요청으로 구역별로 하나씩 튜닝했고, 각 항목 위에 날짜와 근거를 적어뒀다.
// 2026-09-21 기준 다섯 구역 모두 튜닝이 끝났다(옛 공통값을 쓰는 구역 없음).
//
// R3F의 <Canvas camera={...}> prop 은 마운트 시점에 한 번만 적용돼서, 구역을 바꿔도 카메라가
// 따라가지 않는다. 그래서 zoneId가 바뀔 때마다 ZoneCamera가 카메라 위치와 OrbitControls 타깃을
// 직접 옮긴다. (09-20 처음 분리할 때는 타깃을 OrbitControls의 target prop으로 넘겼는데,
// 같은 날 3차 카메라 잠금에서 ref 방식으로 바꿨다 — 이유는 아래 ZoneCamera 주석 참고.)
const ZONE_CAMERAS = {
  // 혜화관(2026-09-21 튜닝, 재원 요청 "왼쪽·뒤로 이동, 45° 돌려서 지도 모서리부터 쭉 보이게"):
  //   정남쪽에서 정북을 보던 시점([10,140,90])을 y축 기준 45° 돌려 남서쪽 모서리에서 북동쪽을
  //   보게 했다. 내려보는 각(48.8°)은 그대로다. 구역 bbox가 x -43~54 / z -76~15 라서 45°로 보면
  //   대각선(약 133m)이 세로 화면의 좁은 쪽(가로)을 가로지르게 되고, 그래서 정면 뷰보다 멀리
  //   빠져야 한다. 220 / 250 / 285 세 거리를 렌더해서 비교했고 220은 경영관 동쪽 끝이 잘려서,
  //   모서리부터 끝까지 잘림 없이 들어오는 가장 가까운 250으로 정했다.
  //   (같은 날 재측정: 640×1000에선 경영관 동쪽 끝이 화면 가장자리에 딱 닿고, 폰 비율인 600×1000에선
  //   양끝이 조금 잘린다. 화면비에 따라 거리를 맞추는 처리는 아직 없다.)
  zone1: { position: [-111.4, 191.1, 85.9], target: [5, 3, -30.5] },
  // 팔정도(2026-09-21 튜닝, 재원 요청 "북서쪽에서, 혜화관이랑 비슷하게"):
  //   블렌더 원본이 +y=북쪽이라(paljeongdo-zone-blender-structure.md) three에선 북쪽=-z, 서쪽=-x,
  //   즉 북서쪽 = (-x, -z). 방위각 -135°에서 남동쪽을 내려다본다. 내려보는 각 48.8°는 다른 구역과 같다.
  //   이 방향에선 법학관(동쪽)과 명진관(남쪽)이 화면 위쪽에 좌우로 나란히 서서 가로 폭이 넓어지므로
  //   혜화관(250)보다 조금 더 빠져야 한다(같은 날 비교해 본 북동쪽 시점은 240이면 됐다).
  //   거리 250/258/265/271을 640×1000과 600×1000(폰 지도 영역 비율) 두 화면으로 렌더해 봤다.
  //   265 이하는 600 폭에서 한쪽 끝이 화면 가장자리에 붙거나(4px) 잘렸고, 271에서 양옆 여백이 남는다.
  //   타깃은 구역 bbox(x -39~47 / z -31~61) 중심 근처에서 좌우 여백이 같아지게 잡았다
  //   (640 폭 37/36px, 600 폭 17/16px).
  zone2: { position: [-120.4, 206.9, -111.6], target: [5.8, 3, 14.6] },
  // 만해광장(2026-09-21 튜닝, 재원 요청 "남동쪽에서, 지금 기준 60° 정도 돌려서"):
  //   남동쪽 = (+x, +z)라 이 표기에선 방위각이 +방향이다(혜화관 남서 -45°의 반대쪽).
  //   방위각 60°(정남에서 동쪽으로 60°)에서 북서쪽을 내려다본다. 내려보는 각 48.8°는 다른 구역과 같다.
  //   이 방향이면 관람석(북쪽 능선)이 화면 오른쪽에서 코트를 감싸고 무대 정자(남쪽)가 왼쪽에 온다.
  //   정확한 대각선인 45°도 같이 렌더해 봤는데, 60°가 광장의 긴 축(x, 약 42m)을 비스듬히 줄여 보여서
  //   같은 여백으로 더 가까이 당길 수 있었다.
  //   구역이 작아서(bbox x -20.8~21.0 / z -15.4~14.2) 거리가 혜화관·팔정도의 1/3 수준이다. 76/82/88을
  //   640×1000·600×1000으로 비교했고, 76은 폰 비율에서 여백이 24px까지 줄고 최소 거리(70)와 거의 같아
  //   확대 여유가 없어서 82로 정했다(600 폭 좌우 여백 46/45px). 타깃은 좌우 여백이 같아지게 맞췄다.
  //   2026-09-21 지도 2배(Zone3Scene의 MAP_SCALE): 위 거리·bbox·여백 숫자는 2배 전 기준이다. 카메라 위치와
  //   타깃을 원점 기준으로 똑같이 2배 해서(거리 82 → 164, 타깃 높이도 3 → 6) 화면 구도는 그대로고,
  //   실제 크기인 부스만 상대적으로 작아진다. 확대 여유도 생겼다(최소 거리 70까지 2.3배).
  zone3: { position: [100.6, 129.4, 55.2], target: [7, 6, 1.2] },
  // 학림관(2026-09-21 튜닝, 재원 요청 "완전 반대쪽에서"):
  //   건물 정면(입구·유리 타워)과 앞 도로가 -z 쪽(정면 z=-5, 도로 z -20.5~-4.5)에 있는데, 옛 공통
  //   카메라는 +z 쪽에서 봐서 창 없는 뒷면만 보였고, 도로 차선에 세운 부스 6개(z=-12.7)는 높이 15m
  //   건물에 가려 핀 끝만 보였다. 방위각 180°로 돌려(카메라가 -z 쪽) 정면을 마주 보게 했다.
  //   내려보는 각 48.8°는 다른 구역과 같다. 화면 좌우도 뒤집혀서 건물의 x+ 끝이 화면 왼쪽에 온다.
  //   구역이 좌우로 긴 직사각형(bbox x -28~28 / z -20.5~8)이고 좌우 대칭이라 타깃 x=0.
  //   거리 125/133/143을 640×1000·600×1000으로 비교했고, 125는 600 폭에서 양끝이 5px까지 붙어서
  //   133으로 정했다(640 폭 좌우 여백 45px, 600 폭 25px).
  zone4: { position: [0, 103.1, -89.1], target: [0, 3, -1.5] },
  // 원흥관(2026-09-20 첫 값 → 2026-09-21 재원 요청 "반대쪽에서"로 변경):
  //   본동의 원래 정면(창이 촘촘한 면)은 -z 쪽인데, 처음 잡은 시점(방위각 0°, 카메라가 +z 쪽)은 건물 후면과
  //   그 앞 광장을 보고 있었다. 방위각 180°로 돌려(카메라가 -z 쪽) 정면을 마주 보게 했고, 후면 광장에 있던
  //   부스 4개(501~504)는 같은 날 배치 대상에서 제외했다.
  //   내려보는 각 48.8°는 그대로다. 화면 좌우가 뒤집혀서 본관(x+)이 왼쪽, 본동(x-)이 오른쪽에 온다.
  //   bbox x -36~32 / z -16~32. 거리 150/158/166을 640×1000·600×1000으로 비교했고, 150은 600 폭에서
  //   양끝이 가장자리에 닿아서 158로 정했다(640 폭 좌우 여백 35px, 600 폭 15px).
  //   2026-09-21 지도 2배(Zone5Scene의 MAP_SCALE): 위 거리·bbox·여백 숫자는 2배 전 기준이다. 카메라 위치와
  //   타깃을 원점 기준으로 똑같이 2배 해서(거리 158 → 316, 타깃 높이도 3 → 6) 화면 구도는 그대로다.
  zone5: { position: [-4, 243.8, -190.2], target: [-4, 6, 18] },
}

const DEFAULT_CAMERA = ZONE_CAMERAS.zone1

// 2026-09-20(3차): 카메라 시점 고정 — 재원 결정 "확대는 되고, 회전은 잠그고, 좌우 이동은 어느 정도까지만".
// 2026-09-23: 회전만 다시 열었다 — 기획·디자인 쪽에서 "지도 뷰어(festival-map-viewer)의 자유 회전처럼
//             돌려 보고 싶다"고 요청. 줌(MIN/MAX_DISTANCE)·좌우 이동(PAN_LIMIT) 한계값은 그대로 두고,
//             대신 땅 밑으로 내려가지 못하게, 또 핀이 안 보일 만큼 위로 올라가지 못하게
//             MIN/MAX_POLAR_ANGLE을 추가했다. 자세한 건 아래 <OrbitControls> 주석.
//
// 09-20에 잠근 이유: OrbitControls를 옵션 없이 쓰면 사용자가 건물 밑이나 뒤까지 마음대로 돌릴 수 있는데,
// 구역마다 각도를 맞춰놓은 구도(ZONE_CAMERAS)가 한 번 돌리면 의미가 없어져서였다. 09-23에 회전은 다시
// 열었지만 '기본 시점은 구역마다 맞춰둔 구도로 시작하고, 사용자가 돌려도 구역 밖으로는 못 나간다'는
// 원칙은 그대로다.
//
// 아래 한계값들은 다섯 구역이 공통으로 쓴다. 구역별 카메라의 '내려보는 각'이 전부 48.8°로 같아서
// 공통 값이 그대로 들어맞는다. (처음 zone5는 옛 zone1 방향 벡터에서 거리만 줄였고, 이후 다섯 구역
// 모두 내려보는 각은 두고 방위각만 돌렸다. 새 구역을 맞출 때도 이 48.8°를 지키면 된다.)
// 구역 크기 차이 때문에 따로 주고 싶어지면 ZONE_CAMERAS 각 항목에 넣고 preset에서 꺼내 쓰면 된다.
// 줌 범위(2026-09-24): 70~360 → 20~400. 재원 요청 "확대를 더 열어 달라".
// 회전이 열리기 전에는 구역을 위에서 내려다보기만 해서 70이면 충분했는데, 돌려 볼 수 있게 되니
// 부스를 가까이서 보고 싶어진다(랜턴·조명끈·바닥 글로우는 거리 70에선 몇 픽셀이라 보이지 않는다).
//
//   - 최소 20: 팔정도에서 부스 한 동을 타깃으로 두고 10/15/20/25/35를 렌더해서 골랐다.
//     10은 카메라가 나무 안에 들어가 초록 면만 보이고, 15는 천막이 화면 구석에 걸친다.
//     20부터 천막과 조명끈이 제대로 보이기 시작한다. 뷰어(festival-map-viewer)의 자유 회전은 5까지
//     열려 있지만 그건 캡처용 내부 도구라 지오메트리를 뚫어도 상관없는 경우다.
//     ※ 만해광장·원흥관은 지도가 2배(MAP_SCALE)라 같은 거리에서 건물이 두 배로 크다 — 부스는 실제
//       크기 그대로여서 부스를 보는 데는 같지만, 그 두 구역에선 20까지 당기면 건물을 뚫을 수 있다.
//   - 최대 400: 가장 먼 기본 시점(원흥관 316)보다 여유가 있는 값. 기본 거리가 최대값보다 크면
//     OrbitControls가 첫 update()에서 끌어당겨 카메라가 튕겨 들어오므로 그 조건을 지켜야 한다.
//     Canvas의 far가 2000이라 이 거리에서도 잘리지 않는다.
// (옛 값 기록: MIN 70 = 회전이 잠겨 있던 시절 "부스 지붕이 화면을 채우기 직전"으로 잡은 값.
//  MAX는 220 → 300 → 360으로, 혜화관 250·원흥관 316 기본 시점이 생길 때마다 올렸다.)
const MIN_DISTANCE = 20      // 가장 가까이 당겼을 때 (부스 한 동과 조명끈이 보이는 거리)
const MAX_DISTANCE = 400     // 가장 멀리 뺐을 때 (구역 전체 + 여백)
const PAN_LIMIT = 30         // 구역 중심에서 좌우/앞뒤로 이만큼까지만 끌 수 있다
// 위아래 회전 한계(2026-09-23). polar 0 = 바로 위에서 내려다보기, π/2 = 지평선 높이.
// 아래쪽: 지평선 바로 앞(0.03rad ≈ 1.7°)에서 멈춘다 — 그 아래로 내려가면 카메라가 지면을 뚫고 들어가
//   지도가 뒤집혀 보이고, 배경색만 가득 차서 돌아오기 어려워진다. (지도 뷰어의 자유 회전과 같은 값)
// 위쪽: 3D 핀은 세로로 선 물방울이라 위에서 볼수록 납작해진다. 혜화관에서 거리 110으로 각도를 바꿔 가며
//   렌더해 보면 올려본 각 60°까지는 개수 숫자가 읽히고, 65°에서 타원, 70°부터 뭉개지고, 90°(바로 위)에선
//   색 띠만 남는다. 그래서 올려본 각 65°(= polar 25°)에서 멈춘다 — 지도에서 핀이 가장 중요한 정보라
//   '바로 위에서 내려다보기'보다 핀 가독성을 택했다.
//   탑뷰까지 열어야 한다면 이 값을 0으로 두면 되는데, 그땐 BoothPin의 tiltRatio를 살려서 가파른 각도에서만
//   핀이 카메라 쪽으로 눕도록 해야 읽을 수 있다.
const MAX_POLAR_ANGLE = Math.PI / 2 - 0.03                   // 아래 한계 — 지평선 직전
const MIN_POLAR_ANGLE = Math.PI / 2 - (65 * Math.PI) / 180   // 위 한계 — 올려본 각 65°

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function ZoneCamera({ zoneId, controlsRef }) {
  const camera = useThree((state) => state.camera)
  const preset = ZONE_CAMERAS[zoneId] ?? DEFAULT_CAMERA

  // 구역이 바뀌면 그 구역 기본 시점으로 되돌린다.
  // (zone1에서 확대해둔 채 zone5로 넘어가도 zone5 기본 화면에서 시작한다)
  //
  // 타깃을 OrbitControls의 prop으로 넘기지 않고 여기서 ref로 직접 넣는 이유:
  // prop으로 주면 MapCanvas가 리렌더될 때마다(MapShell의 onBoothClick이 매 렌더 새로 만들어져서
  // 바텀시트를 열고 닫을 때도 리렌더된다) 타깃이 구역 중심으로 되돌아가 사용자가 끌어둔
  // 좌우 이동이 툭툭 튕겨 돌아온다.
  useEffect(() => {
    camera.position.set(...preset.position)
    const controls = controlsRef.current
    if (controls) {
      controls.target.set(...preset.target)
      controls.update()
    } else {
      camera.lookAt(...preset.target)
    }
  }, [camera, controlsRef, preset])

  // 좌우 이동이 구역 밖으로 나가지 않게 매 프레임 가둔다.
  // OrbitControls는 회전(min/maxPolarAngle)과 줌(min/maxDistance)은 한계를 제공하지만
  // 패닝은 막아주지 않아서, 그냥 두면 지도 밖 허공까지 끌고 갈 수 있다.
  //
  // drei의 OrbitControls는 renderPriority -1로 update()를 돌리므로, 기본 우선순위(0)인
  // 이 콜백은 그 뒤에 실행된다 — 즉 사용자의 조작이 반영된 결과를 받아서 되돌리는 순서다.
  useFrame(() => {
    const controls = controlsRef.current
    if (!controls) return

    const target = controls.target
    const [centerX, , centerZ] = preset.target
    const beforeX = target.x
    const beforeZ = target.z

    target.x = clamp(target.x, centerX - PAN_LIMIT, centerX + PAN_LIMIT)
    target.z = clamp(target.z, centerZ - PAN_LIMIT, centerZ + PAN_LIMIT)

    // 패닝은 카메라와 타깃을 같은 양만큼 옮긴다. 타깃만 되돌리면 시선 방향이 틀어지므로
    // 카메라도 같은 양만큼 되돌려서 (카메라 - 타깃) 오프셋을 유지한다.
    camera.position.x += target.x - beforeX
    camera.position.z += target.z - beforeZ
  })

  return null
}

export default function MapCanvas({ zoneId, timeOfDay = 'day', boothBrightnessPreview = null, onBoothClick }) {
  const controlsRef = useRef(null)

  return (
    <Canvas
      camera={{ position: DEFAULT_CAMERA.position, fov: 45, near: 1, far: 2000 }}
      shadows={{ type: THREE.PCFSoftShadowMap }}
    >
      <TimeOfDayContext.Provider value={timeOfDay}>
        <Selection>
          <SceneEnvironment timeOfDay={timeOfDay} />
          <Suspense fallback={null}>
            {zoneId === 'zone1' ? (
              <Zone1Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
            ) : zoneId === 'zone2' ? (
              <Zone2Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
            ) : zoneId === 'zone3' ? (
              <Zone3Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
            ) : zoneId === 'zone4' ? (
              <Zone4Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
            ) : zoneId === 'zone5' ? (
              <Zone5Scene brightnessLevel={boothBrightnessPreview} onBoothClick={onBoothClick} />
            ) : null}
          </Suspense>
          {/* 디버그/검증 편의를 위한 임시 카메라 컨트롤 — 실제 구역 전환 카메라 연출이 정해지면 교체 예정 */}
          {/* 2026-09-13: 카메라 위치/타깃을 재원의 실제 상세 지형(WIP) 좌표 범위에 맞춰 재조정 */}
          {/* 2026-09-20: 시점 고정 — 회전은 잠그고 확대/좌우 이동만 허용(2026-09-23에 회전은 다시 열림).
              위치·타깃과 패닝 범위 제한은 ZoneCamera가 담당한다. */}
          {/* 2026-09-23: 지도 뷰어의 "자유 회전"과 같은 조작으로 바꿨다(기획·디자인 요청).
              - 한 손가락 드래그 / 좌클릭 드래그 = 회전 (OrbitControls 기본 조작)
              - 두 손가락 드래그 / 우클릭 드래그 = 좌우 이동, 핀치 / 휠 = 확대·축소
              - 위아래 회전은 MIN/MAX_POLAR_ANGLE 사이 — 아래는 지평선 직전, 위는 올려본 각 65°까지
              줌 범위와 좌우 이동 범위는 그대로 둔다 — 회전까지 열린 상태에서 그 둘까지 풀면 구역을 잃어버리고
              돌아올 방법이 없다(앱엔 '시점 초기화' 버튼이 없고, 구역을 바꿨다 돌아와야 기본 시점으로 리셋된다).
              뷰어의 자유 회전은 거리 5~1500에 이동 제한도 없는데, 그건 캡처용 내부 도구라 그렇게 둔 것이다.
              ※ 회전을 열면 3D 핀이 어느 방향에서도 카메라를 보게 하는 수정(BoothPin.jsx, atan2)이 반드시
                 함께 있어야 한다 — 없으면 돌릴 때마다 핀이 옆으로 눕거나 뒤돌아 보인다. */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableRotate
            enableZoom
            enablePan
            screenSpacePanning={false}
            minDistance={MIN_DISTANCE}
            maxDistance={MAX_DISTANCE}
            minPolarAngle={MIN_POLAR_ANGLE}
            maxPolarAngle={MAX_POLAR_ANGLE}
            touches={{ ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN }}
            mouseButtons={{
              LEFT: THREE.MOUSE.ROTATE,
              MIDDLE: THREE.MOUSE.DOLLY,
              RIGHT: THREE.MOUSE.PAN,
            }}
          />
          <ZoneCamera zoneId={zoneId} controlsRef={controlsRef} />
          <EffectComposer>
            <SelectiveBloom
              mipmapBlur
              ignoreBackground
              luminanceThreshold={0.15}
              luminanceSmoothing={0.4}
              intensity={1.4}
              radius={0.6}
            />
            <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          </EffectComposer>
        </Selection>
      </TimeOfDayContext.Provider>
    </Canvas>
  )
}
