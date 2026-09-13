import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// 낮/노을/밤 공통으로 쓰는 절차적(procedural) 하늘 배경 셰이더 — "미니멀 그라디언트" 버전.
//
// 히스토리(재원 확인, 2026-09-13):
//   1차: drei <Sky>(물리 기반 대기 산란) → 이 지도 특유의 항상-내려다보는 카메라 구도에서
//        거의 흰색으로만 나와서 폐기.
//   2차: fbm 노이즈로 오로라/구름을 흐릿하게 그리는 커스텀 셰이더 → 색 경계가 뿌옇게
//        번져서 포스터의 또렷한 그래픽 느낌과 다르고 "안 예쁘다"는 피드백을 받음.
//   3차(현재): 노이즈/애니메이션을 전부 걷어내고, 색상 스톱 3단(top/mid/horizon) +
//        광원 글로우(선명한 방사형 그라디언트, 노이즈 아님) 만으로 구성한 미니멀 버전.
//        정적이고 색 경계가 또렷해서 안정감 있고, 등불(라푼젤 연출, 기획 취소됨) 같은
//        다른 요소를 나중에 얹어도 배경이 방해되지 않음.
//
// 색상/모양은 전부 environment/timeOfDayPresets.js 의 프리셋 값으로 관리한다.
// 이 파일은 "어떻게 그릴지"만 담당하고, "무슨 색으로 그릴지"는 건드리지 않는다.
const VERTEX_SHADER = /* glsl */ `
  varying vec3 vWorldDir;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldDir = normalize(worldPosition.xyz - cameraPosition);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = /* glsl */ `
  varying vec3 vWorldDir;

  uniform vec3 uTopColor;
  uniform vec3 uMidColor;
  uniform vec3 uHorizonColor;
  uniform float uMidStop; // 0~1, skyT 축에서 mid 색이 자리하는 위치
  uniform vec3 uBurstColor;
  uniform vec3 uBurstGlowColor;
  uniform float uBurstSkyT;
  uniform float uBurstCoreSharpness;
  uniform float uBurstGlowSharpness;

  void main() {
    vec3 dir = normalize(vWorldDir);

    // skyT: 0(카메라가 내려다보는 가장 가파른 방향) ~ 1(이 지도 카메라 구도에서 지평선에
    // 가장 가까운 방향). 이 지도는 카메라가 항상 위에서 내려다보기 때문에 실제로 보이는
    // dir.y 범위(대략 -1.0~-0.25)만 스무스하게 0~1로 펼쳐서 쓴다.
    float skyT = smoothstep(-1.0, -0.25, dir.y);

    // 3단 색상 스톱을 두 번의 smoothstep으로 이어붙여 또렷한(노이즈 없는) 그라디언트를 만든다.
    vec3 base = mix(uTopColor, uMidColor, smoothstep(0.0, uMidStop, skyT));
    base = mix(base, uHorizonColor, smoothstep(uMidStop, 1.0, skyT));

    // 광원 코어 — 노이즈 없이 순수 방사형 글로우(포스터의 또렷한 빛 번짐과 동일한 형태)
    float burstDist = length(vec2(dir.x, skyT - uBurstSkyT) * vec2(1.0, 2.6));
    float burstCore = exp(-burstDist * burstDist * uBurstCoreSharpness);
    float burstGlow = exp(-burstDist * burstDist * uBurstGlowSharpness);
    base += uBurstGlowColor * burstGlow * 0.55;
    base += uBurstColor * burstCore * 1.1;

    gl_FragColor = vec4(base, 1.0);
  }
`

export default function ProceduralSky({
  topColor,
  midColor,
  horizonColor,
  midStop = 0.55,
  burstColor,
  burstGlowColor,
  burstSkyT = 0.92,
  burstCoreSharpness = 22,
  burstGlowSharpness = 4,
}) {
  const materialRef = useRef()

  const uniforms = useMemo(
    () => ({
      uTopColor: { value: new THREE.Color(topColor) },
      uMidColor: { value: new THREE.Color(midColor) },
      uHorizonColor: { value: new THREE.Color(horizonColor) },
      uMidStop: { value: midStop },
      uBurstColor: { value: new THREE.Color(burstColor) },
      uBurstGlowColor: { value: new THREE.Color(burstGlowColor) },
      uBurstSkyT: { value: burstSkyT },
      uBurstCoreSharpness: { value: burstCoreSharpness },
      uBurstGlowSharpness: { value: burstGlowSharpness },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // 정적인 배경이라 시간에 따라 움직일 값은 없지만, timeOfDay 프리셋이 바뀔 때(컴포넌트가
  // 그대로 유지된 채 색만 바뀌는 경우) 유니폼 값을 매 프레임 최신 props로 맞춰준다.
  useFrame(() => {
    const u = materialRef.current?.uniforms
    if (!u) return
    u.uTopColor.value.set(topColor)
    u.uMidColor.value.set(midColor)
    u.uHorizonColor.value.set(horizonColor)
    u.uMidStop.value = midStop
    u.uBurstColor.value.set(burstColor)
    u.uBurstGlowColor.value.set(burstGlowColor)
    u.uBurstSkyT.value = burstSkyT
    u.uBurstCoreSharpness.value = burstCoreSharpness
    u.uBurstGlowSharpness.value = burstGlowSharpness
  })

  return (
    <mesh>
      <sphereGeometry args={[900, 32, 16]} />
      <shaderMaterial
        ref={materialRef}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER}
        uniforms={uniforms}
      />
    </mesh>
  )
}
