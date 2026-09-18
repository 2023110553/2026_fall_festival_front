import { useEffect, useRef } from 'react'
import { Html } from '@react-three/drei'
import { Select } from '@react-three/postprocessing'
import * as THREE from 'three'
import PinLabel from '../../components/PinLabel/PinLabel'

// 재사용 가능한 부스(천막) 오브젝트 — 실제 부스 3D 템플릿(.glb)이 아직 없어서
// 좌표 소환 테스트 겸 시각적 데모용으로 만든 캐노피(가젤보) 천막 메시.
// 실제 캐노피 천막 표준 규격(3m x 6m)에 맞춘 다리 6개 + 경사 지붕 2면 + 처마 발(valance) 구성.
//
// 2026-09-13 수정:
//   1) 배치 방향 버그 수정 — 이전 버전은 짧은 변(3m)이 통로 진행 방향(Three.js X축)과
//      나란해서 부스가 통로 위에서 "세로"로 서 보이는 문제가 있었음. 실제 캐노피 천막은
//      긴 변(6m)이 통로와 나란한 정면이 되도록 놓이므로 width(6, X축)/depth(3, Z축)로 스왑함.
//      → zone1-booths.sample.json의 rotation은 그대로 0으로 둬도 됨(기본 방향 자체를 고쳤기 때문).
//   2) 디자인 리뉴얼 — 재원이 공유한 실제 캐노피 천막(3M x 6M, 파란색 폴딩 가젤보) 사진을 참고해
//      다리 배치(긴 변마다 3개씩 총 6개)와 색상(파란 캐노피 + 은색 프레임), 처마 아래로 늘어지는
//      천(valance)을 추가해 실제 천막과 비슷하게 리디자인함.
//   3) 등불 장식 추가 — 재원이 공유한 사각 금속 프레임 랜턴 사진을 참고해, 기둥 6곳마다
//      작은 랜턴을 하나씩 달았다. 실제 "등불 밝히기" 기능(사용자가 남기는 등불)과는 무관한
//      순수 장식 요소 — 유리 패널을 emissive(자체발광)로 처리해서, 밤에 조명이 어두워져도
//      광원 자체는 항상 은은하게 빛나 보이게 했다(과제 요구사항: "크지 않게, 광원은 보이도록").
//   4) 부스별 밝기 단계(brightnessLevel) 추가 — final-plan-team-share.md 2-3절 "등불 밝히기"
//      기획의 "개별 부스 — 천막 밝기/장식 단계 조절" 표를 반영. 등불 개수 구간(0/1/5/10/50개)에
//      따라 0~4단계로 나뉘는데, 아직 백엔드가 lantern_count를 내려주지 않아서(부스 데이터
//      미확정) 지금은 MapShell의 임시 "밝기 미리보기" 버튼으로 brightnessLevel을 수동으로
//      넘겨서 시안만 확인하는 단계다. 나중에 실제 등불 개수가 연동되면
//      getBoothBrightnessLevel(lanternCount) 같은 순수 함수로 교체해서 여기 넘기는 값만
//      바꾸면 되고, 이 컴포넌트(그리는 로직)는 손댈 필요 없다 — timeOfDay와 동일한 원칙.
//      지붕뿐 아니라 처마 밑 천(valance)에도 같은 emissive를 줘서 천막 전체가 같이
//      밝아지도록 했다(재원 피드백 반영 — 처음엔 지붕에만 적용해서 어색했음).
//   5) 빛 확산(블룸) 효과 추가 — 재원 피드백("색상만 밝아지는 게 아니라 빛이 번지는
//      효과가 있으면 좋겠다")을 반영해, 랜턴 유리 패널과 지붕/처마 띠(밝기 단계>0일 때)에
//      @react-three/postprocessing의 <Select enabled>를 씌웠다. 이 표시를 MapCanvas.jsx의
//      <EffectComposer><SelectiveBloom/></EffectComposer>가 감지해서, 딱 이 부분들만
//      빛이 부드럽게 번지는(블러) 효과를 적용한다 — 씬 전체에 블룸을 걸면 낮 시간대 흰
//      배경/지붕까지 같이 번져서 지저분해지므로, 반드시 "선택적" 블룸으로 처리해야 한다.
//   6) 바닥 글로우 링 추가 — 재원 요청("밝기/블룸 말고 부스를 부각시킬 다른 방법 없나?").
//      근본 원인: 기본 지도 카메라가 아주 높은 곳(y=140)에서 내려다보는 구도라, 부스가
//      화면상 몇 픽셀밖에 안 돼서 지붕 색/블룸 효과 자체가 잘 안 보임. 그래서 카메라 거리와
//      무관하게 "여기 부스가 있다"는 걸 알려주는 별도 마커를 바닥에 깔았다 — 부스 발밑에
//      반투명한 원형 글로우(GroundGlow)를 깔아서 위에서 내려다봐도 확실히 눈에 띄게 함.
//      부스 실제 풋프린트(6m x 3m)보다 여유 있게 큰 반지름으로 잡아서 먼 거리에서도 잘
//      보이도록 했다. 처음엔 카테고리 구분용 색(color prop)을 그대로 썼는데, 재원이
//      "빛 색상을 노란 계열로" 요청해서 랜턴과 같은 따뜻한 노란빛(GROUND_GLOW_COLOR)으로
//      통일함 — "등불빛이 바닥에 은은하게 비친다"는 느낌. <Select enabled>로 감싸서 다른
//      발광 요소들처럼 은은하게 번지는 느낌도 같이 준다.
//   7) 바닥 글로우도 밝기 단계에 연동 — 재원 요청("등불 개수에 연동, 일단 버튼으로
//      미리보기"). 처음엔 "위치 식별용이라 인기도(brightnessLevel)와 역할이 다르다"고
//      항상 고정값으로 뒀었는데, 재원이 오히려 인기 부스가 더 확실히 부각되길 원해서
//      opacity(밝기)와 radius(반경)를 둘 다 brightnessLevel에 비례해서 커지도록 바꿈
//      (0단계에서도 완전히 안 보이진 않게 최소값은 유지). 지금은 다른 밝기 효과들과
//      마찬가지로 MapShell의 임시 미리보기 버튼으로 확인 가능.
//   8) 지붕 조명끈(RoofLightStrings) 추가 — 재원이 공유한 참고 사진(밤에 텐트 지붕의
//      각진 라인을 따라 전구 조명이 쭉 이어진 캠핑/웨딩 텐트 사진)을 보고 요청한 장식 요소.
//      지붕의 "각진 부분" = 용마루(능선)와, 용마루 양 끝에서 앞/뒤 처마 모서리로 뻗는
//      대각선(지붕 경사면의 모서리) 총 5개 라인으로 해석해서, 각 라인을 따라 일정 간격으로
//      작은 자체발광 구슬(전구)을 나열했다. PoleLantern과 마찬가지로 "밝기 단계(brightnessLevel)"
//      와는 무관하게 항상 켜져 있는 고정 장식 요소로 처리함 — 참고 사진 속 조명끈도 인기도와
//      상관없이 늘 켜져 있는 상시 장식이고, 이미 PoleLantern이 같은 방식(고정 emissive, 밝기
//      단계와 무관)이라 일관성 있게 맞췄다. <Select enabled>로 감싸서 다른 발광 요소들처럼
//      SelectiveBloom 빛 번짐 효과도 같이 받는다.
//   9) 천막 자체(지붕/처마) 밝기 효과 제거 — 재원 요청("천막 자체가 밝아지는 기능은 없애고
//      하단 글로우만 밝아지도록"). 4)/5)에서 넣었던 지붕·처마(valance) emissive(BOOTH_GLOW_COLOR)와
//      그 위에 씌웠던 <Select>(블룸)를 전부 제거해서, 지붕/처마는 이제 밝기 단계와 무관하게
//      항상 원래 카테고리 색(color prop)만 보여준다. 밝기 단계(brightnessLevel) 표현은
//      바닥 글로우(GroundGlow, 7번 항목)만으로 담당하도록 역할을 단순화했다 — 랜턴/조명끈
//      (항상 고정 장식) vs 바닥 글로우(밝기 단계에 반응) 두 갈래로 정리된 셈.
//  10) 조명끈을 천막 전체 윤곽으로 확장(RoofLightStrings → TentLightOutline) — 재원이
//      "천막 자체가 밋밋하다", "부스 하나하나에 집중하고 싶은데 깃발보다는 빛 효과로
//      부각시키고 싶다"고 피드백. 깃발 등 새 장식 요소를 추가하는 대신, 8번에서 만든
//      "조명끈" 기법을 천막 전체로 확장하는 방향으로 풀었다. 기존 지붕 각진 라인(용마루+
//      대각선 4개)에 더해 처마 둘레 사각 테두리(4변)와 기둥 6개 세로 조명끈을 추가해서,
//      천막이 빛으로 윤곽 전체가 감싸인 느낌을 내도록 함(기둥 조명끈은 랜턴과 안 겹치게
//      랜턴 아래에서 멈춤). 여전히 밝기 단계와 무관한 고정 장식.
//  11) 광원(랜턴+조명끈) 밝기를 극단적으로 상향 — 재원 요청("부스 광원의 정도를 극단적으로
//      올려줄 수 있어?"). PoleLantern 유리 패널과 TentLightOutline 전구의 emissiveIntensity를
//      1.3~1.4 → 5(LANTERN_GLOW_INTENSITY 상수)로 대폭 올림. MapCanvas.jsx의 SelectiveBloom도
//      같이 강화(intensity/radius 상향, threshold 소폭 하향)해서 실제 화면에서 훨씬 크고
//      강렬한 빛 번짐이 나오도록 함(자세한 값은 MapCanvas.jsx 주석 참고). 9번 항목에서
//      지붕/처마 emissive를 이미 걷어냈기 때문에, 광원을 아무리 세게 키워도 천막 색상이
//      하얗게 날아가는 부작용이 없다 — 광원 강화가 안전해진 배경.
//
// 좌표/앵커 규칙(팀 합의, map-section-scope-and-roles.md B안):
//   - 이 컴포넌트는 "부스 오브젝트 + 라벨 앵커 좌표"만 제공한다.
//   - 부스명 등 텍스트 라벨은 여기서 3D 텍스트로 그리지 않는다 — 프론트A가
//     @react-three/drei의 <Html>로 이 앵커(`booth-label-*` 그룹) 위치에 얹어서 그리는 방식(B안)으로 합의됨.
//
// props:
//   - position: [x, y, z] (Three.js 씬 좌표 — y는 이 부스가 놓일 지면의 실제 높이(표고))
//   - rotationY: 라디안 단위 Y축 회전 (부스 정면이 바라보는 방향 — 보통 0이면 통로와 나란)
//   - label: 부스 이름 — 라벨 앵커 그룹 이름에만 사용(실제 텍스트 렌더링은 프론트A 담당)
//   - color: 캐노피(지붕+처마) 색상 — 카테고리 구분용, 기본값은 실제 천막 사진 기준 파란색
//   - accentColor: 용마루 포인트 컬러
//   - brightnessLevel: 0~4 (등불 개수 기반 밝기 단계, 기본값 0=등불 없음). 지금은 MapShell의
//     임시 미리보기 버튼값이 그대로 들어오지만, 원래는 부스별 lantern_count에서 계산된 값.
//
// 주의: 이 컴포넌트를 사용하는 화면(MapCanvas.jsx)은 반드시 <Selection> 컨텍스트 안에서
// 렌더링돼야 한다 — 그래야 아래 <Select enabled>들이 EffectComposer의 SelectiveBloom에
// 정상적으로 인식된다. <Selection> 없이 이 컴포넌트만 단독으로 쓰면 <Select>가 그냥
// 평범한 <group>처럼만 동작해서(블룸 없이) 에러 없이 조용히 무시된다.

// 등불 개수 구간별 밝기 단계 — final-plan-team-share.md 표 그대로(0개/1개/5개/10개/50개 → 0~4단계).
// emissiveIntensity만 다르게 줘서, 단계가 올라갈수록 지붕/처마가 등불 톤(주황빛)으로 은은하게
// 밝아지도록 했다. toneMapped=false라 시간대(주간/노을/야간) 조명 밝기와 무관하게 항상
// 같은 강도로 보인다 — 랜턴(PoleLantern)과 같은 원리.
const BRIGHTNESS_TIERS = [
  { emissiveIntensity: 0 }, // 0단계(기본) — 등불 0개, 평상시 톤
  { emissiveIntensity: 0.18 }, // 1단계 — 등불 1개 이상, 은은하게 밝아짐
  { emissiveIntensity: 0.4 }, // 2단계 — 등불 5개 이상, 눈에 띄게 밝아짐
  { emissiveIntensity: 0.65 }, // 3단계 — 등불 10개 이상, 확실히 밝고 따뜻한 톤
  { emissiveIntensity: 1 }, // 4단계 — 등불 50개 이상, 가장 밝고 화려한 톤
]
const GROUND_GLOW_COLOR = '#ffdca0' // 바닥 글로우 색 — 랜턴(PoleLantern)과 같은 따뜻한 노란빛으로 통일
const LIGHT_STRING_COLOR = '#ffdca0' // 지붕 조명끈 색 — 랜턴/바닥 글로우와 동일한 따뜻한 노란빛으로 통일
// 광원(랜턴+조명끈) emissiveIntensity — 재원 요청("광원 정도를 극단적으로 올려줄 수 있어?")으로
// 기존 1.3~1.4에서 크게 올림(11번 항목). toneMapped=false라 1을 넘는 값도 그대로 HDR로 남아
// SelectiveBloom 쪽에 훨씬 강한 빛 에너지를 넘겨준다 — 값 자체(재질 밝기)와 블룸 번짐 크기를
// 동시에 극적으로 키우는 효과. 지붕/처마는 이제(9번 항목) emissive를 안 쓰므로, 아무리 올려도
// 천막 색상이 washed out(하얗게 날아감)되는 부작용은 없다 — 5번 항목에서 겪었던 문제와 달리
// 이 값을 올리는 게 이제 안전하다.
const LANTERN_GLOW_INTENSITY = 5
// 천막 조명끈(TentLightOutline) 전용 강도 — 재원 요청("천막 조명 크기를 2~3배 키우고
// 광원도 더 세게, 개수는 줄여도 된다")로 랜턴과 분리한 별도 상수(12번 항목). 랜턴은
// 작은 장식 전구라 5 그대로 두고, 천막 조명끈은 전구 자체가 커진 만큼 더 강하게 밝힘.
const TENT_LIGHT_STRING_INTENSITY = 8
// (2026-09-13: 처음엔 카테고리 구분용 color prop을 그대로 썼는데, 재원이 "빛 색상을 노란
// 계열로" 요청 — 랜턴/등불이랑 톤을 맞춰서 "등불빛이 바닥에 비친다"는 느낌으로 통일함.
// 카테고리 구분은 나중에 필요해지면 지붕 색(color prop)만으로도 충분히 구분되므로,
// 바닥 글로우까지 카테고리색을 쓸 필요는 없다고 판단.)

// 바닥 글로우 링 — 중심이 가장 밝고 가장자리로 갈수록 부드럽게 사라지는 원형 그라디언트.
// 이미지 텍스처 없이 셰이더로 원형 falloff만 계산한다(프로젝트의 "이미지 에셋 안 늘리기" 방침과 동일,
// SceneEnvironment.jsx에서 하늘 셰이더 만들 때 쓴 것과 같은 접근).
const GROUND_GLOW_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`
const GROUND_GLOW_FRAGMENT_SHADER = `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float dist = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.0, dist) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

// 부스 발밑에 까는 반투명 원형 글로우 — 카메라가 아무리 멀어도(기본 지도 줌 기준) 부스 위치
// 자체는 눈에 띄도록 하는 용도. radius는 부스 풋프린트(6m x 3m)보다 여유 있게 크게 잡았다.
// color 기본값은 GROUND_GLOW_COLOR(랜턴과 같은 따뜻한 노란빛) — 필요하면 개별 호출부에서 override 가능.
//
// 2026-09-13(2차): opacity를 밝기 단계(brightnessLevel)에 연동 — 재원 요청("등불 개수에
// 연동해서, 일단 버튼으로 미리 볼 수 있게"). 지도/처마와 마찬가지로 지금은 MapShell의
// 임시 "밝기 미리보기" 버튼값이 그대로 들어온다(실제 데이터 연동은 나중 단계, timeOfDay와
// 동일한 원칙). uniforms는 <shaderMaterial uniforms={...}>로 매번 새 객체를 넘기는 대신
// ref로 материал를 잡아 uOpacity.value만 직접 갱신 — three.js 셰이더 유니폼을 리액트
// 상태에 반응해서 바꿀 때 흔히 쓰는 패턴(매 프레임 재생성 없이 값만 갱신되어 더 안전함).
function GroundGlow({ color = GROUND_GLOW_COLOR, radius = 4.5, opacity = 0.55 }) {
  const materialRef = useRef(null)

  useEffect(() => {
    const material = materialRef.current
    if (!material) return
    material.uniforms.uColor.value.set(color)
    material.uniforms.uOpacity.value = opacity
  }, [color, opacity])

  return (
    <Select enabled>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 32]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={GROUND_GLOW_VERTEX_SHADER}
          fragmentShader={GROUND_GLOW_FRAGMENT_SHADER}
          uniforms={{ uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity } }}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      </mesh>
    </Select>
  )
}

// 기둥에 다는 작은 장식용 랜턴 — 사각 금속 프레임 + 자체발광(emissive) 유리 패널 + 지붕(피라미드) + 손잡이 고리.
// 이미지 텍스처 없이 지오메트리+색상만으로 구성(프로젝트의 "이미지 에셋 안 늘리기" 방침과 동일).
function PoleLantern({ position }) {
  const frameColor = '#2a241c' // 어두운 금속(구리/무쇠) 톤
  const glowColor = '#ffdca0' // 등불 광원 색 — 따뜻한 노란빛
  const size = 0.14 // 프레임 폭/깊이 — "너무 크지 않게" 기준으로 기둥 지름(0.1)보다 살짝 큰 정도
  const height = 0.2 // 프레임 높이

  return (
    <group position={position}>
      {/* 유리(광원) 패널 — emissive+toneMapped=false로 항상 은은히 빛나 보이고,
          <Select enabled>로 표시해서 SelectiveBloom이 빛 번짐(블러) 효과를 입힌다. */}
      <Select enabled>
        <mesh>
          <boxGeometry args={[size * 0.7, height * 0.7, size * 0.7]} />
          <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={LANTERN_GLOW_INTENSITY} toneMapped={false} />
        </mesh>
      </Select>
      {/* 모서리 프레임 기둥 4개 */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz], i) => (
        <mesh key={i} position={[(sx * size) / 2, 0, (sz * size) / 2]}>
          <boxGeometry args={[0.016, height, 0.016]} />
          <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
      {/* 지붕(피라미드형 캡) */}
      <mesh position={[0, height / 2 + 0.045, 0]}>
        <coneGeometry args={[size * 0.68, 0.08, 4]} />
        <meshStandardMaterial color={frameColor} metalness={0.5} roughness={0.6} />
      </mesh>
      {/* 손잡이 고리 */}
      <mesh position={[0, height / 2 + 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.025, 0.005, 6, 12]} />
        <meshStandardMaterial color={frameColor} metalness={0.6} roughness={0.5} />
      </mesh>
    </group>
  )
}

// 천막 조명 테두리(TentLightOutline) — 지붕 각진 라인(용마루+대각선)뿐 아니라, 처마 둘레
// 사각 테두리 + 기둥 6개까지 전부 조명끈으로 감싸서 "빛으로 천막 전체 윤곽을 그린" 느낌을 낸다.
// 재원 피드백("천막 자체가 밋밋하다" + "깃발 같은 장식보다는 빛 효과로 부스를 부각시키고
// 싶다")을 반영해, 새 장식 요소(깃발 등)를 추가하는 대신 기존 "조명끈" 기법을 천막 전체로
// 확장하는 방향으로 풀었다. 라인이 늘어나도 좌표만 배열에 추가하면 되는 구조라 유지보수 부담이
// 크지 않다. 길이가 다른 지붕 크기에도 대응할 수 있도록, 전구 개수를 고정하지 않고 구간 길이 ×
// bulbsPerMeter로 계산한다. PoleLantern과 동일하게 밝기 단계(brightnessLevel)와 무관한
// 고정 장식이라 emissiveIntensity를 상수로 둔다.
//
// 2026-09-13(3차, 12번 항목): 전구 크기를 2~3배 키우고(bulbSize 0.045→0.12) 광원도 더
// 세게(TENT_LIGHT_STRING_INTENSITY), 대신 밀도는 낮춤(bulbsPerMeter 1.6→0.7) — 재원 요청
// ("천막 조명 크기를 2~3배 키우고 광원도 더 세게, 개수는 줄여도 된다"). 전구가 커진 만큼
// sphereGeometry의 분할 수도 6→10으로 올려서 확대됐을 때 각진 티가 덜 나도록 함.
// 2026-09-13(4차, 13번 항목): 막상 반영해보니 블룸(광원 극단적 상향, 11번 항목)과 겹쳐서
// 지붕이 빛 덩어리에 가려질 정도로 과했음 — 재원 요청("전구 크기를 다시 줄여줄래?")으로
// bulbSize를 0.12→0.07로 다시 낮춤(원래값 0.045보다는 여전히 크지만 훨씬 절제된 크기).
// 밀도(bulbsPerMeter)나 광원 강도(TENT_LIGHT_STRING_INTENSITY)는 이번엔 그대로 둠 —
// 딱 크기만 다시 줄여달라는 요청이었기 때문.
function TentLightOutline({
  ridgeSpan,
  slopeSpan,
  poleHeight,
  roofRise,
  poleOffsets,
  poleInsetX,
  poleInsetZ,
  color = LIGHT_STRING_COLOR,
  bulbsPerMeter = 0.7,
  bulbSize = 0.07,
}) {
  const ridgeY = poleHeight + roofRise
  const eaveY = poleHeight // 처마(지붕과 처마 천이 만나는 높이) — 대각선 조명끈의 하단과 동일 높이
  const poleLightBottom = 0.15 // 기둥 조명끈 시작 높이(바닥에서 살짝 띄움)
  const poleLightTop = poleHeight - 0.55 // 랜턴(poleHeight-0.32 부근)과 안 겹치게 그 아래에서 멈춤

  const segments = [
    // 1) 지붕 각진 라인 — 용마루 가로줄 + 게이블 단 대각선 4개(기존 RoofLightStrings와 동일)
    [
      [-ridgeSpan / 2, ridgeY, 0],
      [ridgeSpan / 2, ridgeY, 0],
    ],
    [
      [-ridgeSpan / 2, ridgeY, 0],
      [-ridgeSpan / 2, eaveY, -slopeSpan],
    ],
    [
      [-ridgeSpan / 2, ridgeY, 0],
      [-ridgeSpan / 2, eaveY, slopeSpan],
    ],
    [
      [ridgeSpan / 2, ridgeY, 0],
      [ridgeSpan / 2, eaveY, -slopeSpan],
    ],
    [
      [ridgeSpan / 2, ridgeY, 0],
      [ridgeSpan / 2, eaveY, slopeSpan],
    ],
    // 2) 처마 둘레 사각 테두리 — 발밑까지 천막을 감싸는 느낌을 주는 4변(신규)
    [
      [-ridgeSpan / 2, eaveY, -slopeSpan],
      [ridgeSpan / 2, eaveY, -slopeSpan],
    ],
    [
      [-ridgeSpan / 2, eaveY, slopeSpan],
      [ridgeSpan / 2, eaveY, slopeSpan],
    ],
    [
      [-ridgeSpan / 2, eaveY, -slopeSpan],
      [-ridgeSpan / 2, eaveY, slopeSpan],
    ],
    [
      [ridgeSpan / 2, eaveY, -slopeSpan],
      [ridgeSpan / 2, eaveY, slopeSpan],
    ],
    // 3) 기둥 6개 각각을 감싸는 세로 조명끈(신규) — 바닥~랜턴 바로 아래까지
    ...poleOffsets.map(([signX, signZ]) => [
      [signX * poleInsetX, poleLightBottom, signZ * poleInsetZ],
      [signX * poleInsetX, poleLightTop, signZ * poleInsetZ],
    ]),
  ]

  return (
    <Select enabled>
      <group>
        {segments.map(([start, end], si) => {
          const length = Math.hypot(end[0] - start[0], end[1] - start[1], end[2] - start[2])
          const bulbCount = Math.max(2, Math.round(length * bulbsPerMeter))
          return Array.from({ length: bulbCount }, (_, i) => {
            const t = (i + 0.5) / bulbCount
            const pos = [0, 1, 2].map((k) => start[k] + (end[k] - start[k]) * t)
            return (
              <mesh key={`${si}-${i}`} position={pos}>
                <sphereGeometry args={[bulbSize, 10, 10]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={TENT_LIGHT_STRING_INTENSITY} toneMapped={false} />
              </mesh>
            )
          })
        })}
      </group>
    </Select>
  )
}

export default function BoothMarker({
  position,
  rotationY = 0,
  label,
  category,
  lanternCount = 0,
  color = '#1d5fa8',
  accentColor = '#123f75',
  brightnessLevel = 0,
  onClick,
}) {
  const width = 6 // 부스 폭 — 통로와 나란한 긴 변(정면이 넓게 보이는 방향), 캐노피 천막 표준 규격
  const depth = 3 // 부스 깊이 — 통로에서 안쪽으로 들어가는 짧은 변
  const poleHeight = 2.3
  const roofRise = 0.55 // 처마 대비 용마루 높이
  const eaveOverhang = 0.25 // 처마가 다리보다 살짝 튀어나오는 정도
  const valanceHeight = 0.28 // 처마 밑으로 늘어지는 천 높이

  const halfWidth = width / 2
  const halfDepth = depth / 2
  const poleInsetX = halfWidth - 0.2
  const poleInsetZ = halfDepth - 0.2
  const slopeSpan = halfDepth + eaveOverhang // 용마루 중심에서 처마까지(Z축) 거리
  const ridgeSpan = width + eaveOverhang * 2 // 용마루 길이(X축, 처마 돌출 포함)
  const roofSlopeLength = Math.sqrt(slopeSpan ** 2 + roofRise ** 2)
  const roofSlopeAngle = Math.atan2(roofRise, slopeSpan)

  // 0~4 범위로 안전하게 clamp(잘못된 값이 들어와도 배열 밖을 참조하지 않도록)
  // glowIntensity는 이제 바닥 글로우(GroundGlow)의 밝기/반경 계산에만 쓰인다 — 지붕/처마는
  // 더 이상 이 값에 반응하지 않음(9번 항목 참고).
  const safeLevel = Math.min(Math.max(Math.round(brightnessLevel), 0), BRIGHTNESS_TIERS.length - 1)
  const { emissiveIntensity: glowIntensity } = BRIGHTNESS_TIERS[safeLevel]

  // 다리 6개 — 긴 변(X축)마다 3개씩 2줄로 배치 (실제 3m x 6m 캐노피 천막 프레임과 동일)
  const poleOffsets = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 1],
    [0, 1],
    [1, 1],
  ]

  return (
    <group position={position} rotation={[0, rotationY, 0]} onClick={onClick}>
      {/* 바닥 글로우 링 — 부스 위치 자체를 카메라 거리와 무관하게 눈에 띄게 하는 마커.
          색은 카테고리색이 아니라 랜턴과 같은 따뜻한 노란빛(GROUND_GLOW_COLOR)으로 통일.
          brightnessLevel(등불 개수 단계)이 올라갈수록 밝기(opacity)와 반경이 같이 커지도록
          연동했다 — 재원 요청("등불 개수에 연동, 일단 버튼으로 미리보기"). 0단계에서도
          완전히 안 보이진 않게 최소 opacity는 남겨둠(위치 식별 기능 자체는 항상 유지). */}
      <GroundGlow opacity={0.35 + glowIntensity * 0.5} radius={4.5 + glowIntensity} />

      {/* 다리(프레임) 6개 — 은색 알루미늄 톤 + 기둥마다 장식용 랜턴 1개씩 */}
      {poleOffsets.map(([signX, signZ], i) => (
        <group key={i}>
          <mesh position={[signX * poleInsetX, poleHeight / 2, signZ * poleInsetZ]} castShadow receiveShadow>
            <cylinderGeometry args={[0.05, 0.05, poleHeight, 8]} />
            <meshStandardMaterial color="#c7ccd1" metalness={0.4} roughness={0.5} />
          </mesh>
          {/* 랜턴은 기둥 바깥쪽(통로에서 보이는 쪽)으로 살짝 띄워서 기둥에 매단 것처럼 배치 */}
          <PoleLantern
            position={[
              signX * (poleInsetX + 0.13),
              poleHeight - 0.32,
              signZ * (poleInsetZ + 0.13),
            ]}
          />
        </group>
      ))}

      {/* 맞배지붕 캐노피 — 경사면 2장, 용마루가 X축(통로 방향)과 나란하게.
          카테고리 색(color prop)만 표시하는 일반 재질 — 밝기 단계 표현은 바닥 글로우가
          전담하므로 여기서는 emissive/블룸을 쓰지 않는다(9번 항목, 재원 요청). */}
      <mesh
        position={[0, poleHeight + roofRise / 2, -slopeSpan / 2]}
        rotation={[-roofSlopeAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[ridgeSpan, 0.05, roofSlopeLength]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh
        position={[0, poleHeight + roofRise / 2, slopeSpan / 2]}
        rotation={[roofSlopeAngle, 0, 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[ridgeSpan, 0.05, roofSlopeLength]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* 용마루 포인트 컬러 라인 */}
      <mesh position={[0, poleHeight + roofRise + 0.03, 0]}>
        <boxGeometry args={[ridgeSpan, 0.06, 0.06]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>

      {/* 천막 조명 테두리 — 지붕 각진 라인(용마루+대각선)뿐 아니라 처마 둘레 사각 테두리와
          기둥 6개까지 조명끈으로 감싸서, 천막 전체 윤곽이 빛으로 드러나도록 확장했다
          (재원 피드백: "천막이 밋밋하다" + "깃발보다는 빛 효과로 부각"). 랜턴과 마찬가지로
          밝기 단계와 무관하게 항상 켜져 있는 고정 장식. */}
      <TentLightOutline
        ridgeSpan={ridgeSpan}
        slopeSpan={slopeSpan}
        poleHeight={poleHeight}
        roofRise={roofRise}
        poleOffsets={poleOffsets}
        poleInsetX={poleInsetX}
        poleInsetZ={poleInsetZ}
      />

      {/* 처마 밑으로 늘어지는 천(valance) — 긴 변 2면 + 짧은 변 2면, 처마 둘레를 감싸는 형태.
          지붕과 마찬가지로 카테고리 색만 표시하는 일반 재질(9번 항목, 재원 요청으로 emissive 제거). */}
      <mesh position={[0, poleHeight - valanceHeight / 2, -slopeSpan]}>
        <boxGeometry args={[ridgeSpan, valanceHeight, 0.03]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
      <mesh position={[0, poleHeight - valanceHeight / 2, slopeSpan]}>
        <boxGeometry args={[ridgeSpan, valanceHeight, 0.03]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
      <mesh position={[-ridgeSpan / 2, poleHeight - valanceHeight / 2, 0]}>
        <boxGeometry args={[0.03, valanceHeight, slopeSpan * 2]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>
      <mesh position={[ridgeSpan / 2, poleHeight - valanceHeight / 2, 0]}>
        <boxGeometry args={[0.03, valanceHeight, slopeSpan * 2]} />
        <meshStandardMaterial color={color} side={2} />
      </mesh>

      {/* 부스명 라벨 앵커 — 원래 계획(B안)은 이 좌표 위에 프론트A가 drei Html로 텍스트를 얹는
          것이었음. 2026-09-13: 재원 요청("지금 localhost에서 부스 위에 마커가 뜨게 해줘")으로,
          로컬 확인/데모용 참고 구현을 여기 임시로 붙였다 — 프론트A가 맡을 최종 디자인(아이콘,
          클릭 인터랙션, 카테고리별 스타일 등)을 대체하는 게 아니라 "이 자리에 이렇게 달면 된다"는
          예시. distanceFactor로 카메라 거리에 따라 자연스럽게 크기가 줄어들게 했고, occlude는
          지형/다른 부스에 가려질 때 깜빡임(재계산 비용)이 있어서 이번 참고 구현에는 넣지 않음 —
          필요하면 프론트A가 <Html occlude> 형태로 바꿔도 됨. 색은 랜턴/조명 톤(#ffdca0 계열)과
          맞춰 부스 장식 팔레트와 통일감을 줬다. */}
      {label ? (
        <group
          name={`booth-label-${label}`}
          position={[0, poleHeight + roofRise + 0.5, 0]}
        >
          <Html center distanceFactor={30} zIndexRange={[10, 0]}>
            <PinLabel onClick={onClick} label={label} category={category} lanternCount={lanternCount} />
          </Html>
        </group>  
      ) : null}
    </group>
  )
}
