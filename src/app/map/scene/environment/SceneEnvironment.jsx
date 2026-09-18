import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { getTimeOfDayPreset } from './timeOfDayPresets'

// 시간대(낮/노을/밤)에 따라 배경 밝기 + 조명을 다르게 적용하는 컴포넌트.
// MapCanvas는 이 컴포넌트에 timeOfDay만 넘기면 되고, 프리셋 값 자체는
// timeOfDayPresets.js 한 곳에서만 관리한다(값 튜닝 시 여기 손댈 필요 없음).
//
// 2026-09-13: 하늘(배경) 셰이더를 세 번 갈아엎었다가 재원이 "배경엔 색상 같은 거 아예 넣지 말고,
// 시간대별로 밝기 변화만 주자"고 최종 정리함. 캔버스 배경을 무채색 한 가지 값으로 채우고
// (당시엔 <color attach="background"/>, 09-16부터는 아래 설명대로 CSS 배경), 조명도 전부 무채색으로만 쓴다.
//
// 2026-09-16 조명 구조 개편(이슈 #37, 프리셋 파일 상단 주석에 원인 정리):
//   - ambientLight(사방 균일) → hemisphereLight(위 밝고 아래 어두운 반구광): 지붕·벽·바닥 밝기 차이가 생겨
//     건물 입체감이 살아남. 여전히 무채색.
//   - GradientEnvironment 추가: 천정→지면 무채색 그라디언트 환경맵을 런타임에 PMREM으로 구워 scene.environment에
//     연결(IBL). 금속(베어메탈·멀리언), 유리, 창문에 반사가 생기고 그늘진 면에도 은은한 간접광이 들어감.
//     HDR 파일 다운로드 없음 → 외부 네트워크 의존 없음. 배경으로는 그리지 않음(배경은 단색 유지).
//   - 그림자 해상도 1024→2048 + normalBias 0.02(계단·연석 같은 얇은 박스의 셀프섀도 줄무늬 방지).
//   - 톤매핑은 여기가 아니라 MapCanvas의 <EffectComposer> 안 <ToneMapping>에서 처리한다(EffectComposer가
//     renderer.toneMapping을 강제로 끄기 때문에 효과로 넣어야 적용됨).
//   - 배경색은 <color attach="background"/>(WebGL 클리어 컬러) 대신 캔버스 엘리먼트의 CSS background로 칠한다.
//     이유: WebGL 배경은 EffectComposer 파이프라인(블룸→톤매핑)을 같이 통과해서 프리셋에 적은 값과 화면에
//     보이는 값이 달라진다(실측: #f5f5f5→#dfdfdf, #1c1c1c→#0a0a0a). 배경은 "가시성 좋은 단색"이 목표라
//     적은 값이 그대로 보여야 튜닝이 된다. R3F <Canvas>는 기본이 alpha:true(투명 클리어)라 캔버스 뒤 CSS 배경이
//     그대로 비치고, 모델 실루엣 픽셀은 두 방식이 완전히 동일함을 헤드리스 렌더로 확인했다.
//     주의: MapCanvas의 <Canvas gl={{ alpha: false }}> 같은 설정을 넣으면 배경이 검게 나오니 그대로 둘 것.

// 무채색 그라디언트 환경맵(IBL). 프리셋의 environment 값이 바뀔 때만 다시 굽는다(시간대 전환 시 1회).
function GradientEnvironment({ topColor, bottomColor, intensity, sunPosition }) {
  const { gl, scene } = useThree()
  const sunKey = sunPosition.join(',')

  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const envScene = new THREE.Scene()

    // 안쪽을 바라보는 큰 구 — 위(topColor)에서 아래(bottomColor)로 부드럽게 변하는 정점색
    const sphere = new THREE.SphereGeometry(50, 32, 16)
    const top = new THREE.Color(topColor)
    const bottom = new THREE.Color(bottomColor)
    const position = sphere.attributes.position
    const colors = new Float32Array(position.count * 3)
    for (let i = 0; i < position.count; i++) {
      const t = THREE.MathUtils.clamp((position.getY(i) / 50) * 0.5 + 0.5, 0, 1)
      const c = bottom.clone().lerp(top, Math.pow(t, 0.8))
      colors.set([c.r, c.g, c.b], i * 3)
    }
    sphere.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const skyMaterial = new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })
    envScene.add(new THREE.Mesh(sphere, skyMaterial))

    // 태양 방향에 작은 밝은 원판 — 유리·금속에 하이라이트가 잡히게 하는 용도(색은 무채색, 값만 1 이상)
    const discGeometry = new THREE.CircleGeometry(6, 32)
    const discMaterial = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 4, 4) })
    const disc = new THREE.Mesh(discGeometry, discMaterial)
    disc.position.copy(new THREE.Vector3(...sunPosition).normalize().multiplyScalar(45))
    disc.lookAt(0, 0, 0)
    envScene.add(disc)

    const renderTarget = pmrem.fromScene(envScene, 0.04)
    scene.environment = renderTarget.texture
    scene.environmentIntensity = intensity

    return () => {
      if (scene.environment === renderTarget.texture) scene.environment = null
      renderTarget.dispose()
      pmrem.dispose()
      sphere.dispose()
      skyMaterial.dispose()
      discGeometry.dispose()
      discMaterial.dispose()
    }
    // sunKey는 sunPosition 배열을 문자열로 바꾼 값 — 배열 참조가 아니라 내용이 바뀔 때만 다시 굽기 위함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, topColor, bottomColor, intensity, sunKey])

  return null
}

export default function SceneEnvironment({ timeOfDay }) {
  const preset = getTimeOfDayPreset(timeOfDay)
  const gl = useThree((state) => state.gl)

  // 배경 단색 — 캔버스 CSS 배경으로(위 주석 참고). 시간대가 바뀌면 값만 갈아 끼운다.
  useEffect(() => {
    const canvas = gl.domElement
    canvas.style.background = preset.backgroundColor
    return () => {
      canvas.style.background = ''
    }
  }, [gl, preset.backgroundColor])

  return (
    <>
      <hemisphereLight
        color={preset.hemisphereLight.skyColor}
        groundColor={preset.hemisphereLight.groundColor}
        intensity={preset.hemisphereLight.intensity}
      />
      <directionalLight
        color={preset.directionalLight.color}
        intensity={preset.directionalLight.intensity}
        position={preset.directionalLight.position}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-normalBias={0.02}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={400}
      />
      <GradientEnvironment
        topColor={preset.environment.topColor}
        bottomColor={preset.environment.bottomColor}
        intensity={preset.environment.intensity}
        sunPosition={preset.directionalLight.position}
      />
    </>
  )
}
