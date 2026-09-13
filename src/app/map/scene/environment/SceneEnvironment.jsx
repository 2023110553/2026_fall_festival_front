import { getTimeOfDayPreset } from './timeOfDayPresets'

// 시간대(낮/노을/밤)에 따라 배경 밝기 + 조명을 다르게 적용하는 컴포넌트.
// MapCanvas는 이 컴포넌트에 timeOfDay만 넘기면 되고, 프리셋 값 자체는
// timeOfDayPresets.js 한 곳에서만 관리한다(값 튜닝 시 여기 손댈 필요 없음).
//
// 2026-09-13: 하늘(배경) 셰이더를 세 번 갈아엎었다가(drei Sky → 오로라 노이즈 셰이더 →
// 미니멀 그라디언트 셰이더) 재원이 "배경엔 색상 같은 거 아예 넣지 말고, 시간대별로
// 밝기 변화만 주자"고 최종 정리함. 처음엔 조명(intensity)만 바꿨는데, 조명은 실제
// 메시에만 영향을 줘서 빈 캔버스 영역(하늘 자리)은 계속 흰색 그대로였음 — 그래서
// <color attach="background" .../>로 캔버스 배경 자체도 무채색(그레이스케일) 한 가지
// 값으로 채워서 밝기를 맞춘다. R=G=B라 "색상"이 아니라 "밝기"로 취급.
//
// 그림자(directionalLight)는 시간대별로 세기가 달라져서 낮에는 또렷하게, 밤에는 은은하게 진다.
export default function SceneEnvironment({ timeOfDay }) {
  const preset = getTimeOfDayPreset(timeOfDay)

  return (
    <>
      <color attach="background" args={[preset.backgroundColor]} />
      <ambientLight color={preset.ambientLight.color} intensity={preset.ambientLight.intensity} />
      <directionalLight
        color={preset.directionalLight.color}
        intensity={preset.directionalLight.intensity}
        position={preset.directionalLight.position}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={400}
      />
    </>
  )
}
