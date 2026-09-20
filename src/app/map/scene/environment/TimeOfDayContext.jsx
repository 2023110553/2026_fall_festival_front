import { createContext, useContext } from 'react'

// 3D 씬 안에서 현재 시간대('day' | 'sunset' | 'night')를 읽기 위한 컨텍스트.
//
// 2026-09-19: 부스 밝기가 부스별 lantern_count로 자동 계산되면서(BoothMarker.jsx 19번 항목) 5단계 부스의
// 바닥 글로우가 낮 화면에서도 그대로 번져 보이는 문제가 드러났다(팔정도처럼 5단계 부스가 몰린 구역은
// 낮에 광장 가운데가 하얀 구름처럼 덮임). 낮에는 글로우를 위치 식별용 최소값으로 눌러야 하는데, 그러려면
// BoothMarker가 시간대를 알아야 한다. MapCanvas → ZoneNScene → ZoneBooths → BoothMarker로 prop을 세 단계
// 내려보내는 대신 컨텍스트로 두었다 — 구역 씬/ZoneBooths는 시간대와 무관한 코드라 손대지 않아도 되고,
// 나중에 가로등처럼 시간대에 반응해야 하는 씬 요소가 늘어나도 같은 훅만 쓰면 된다.
//
// Provider는 MapCanvas가 <Canvas> 안쪽에서 감싸준다(React Three Fiber는 Canvas 밖 컨텍스트도 브리징해주지만,
// 안쪽에 두면 그 동작에 기대지 않아도 된다). Provider 없이 BoothMarker를 단독 렌더(프리뷰/검증 페이지)하면
// 기본값 'night'로 동작해서 글로우/조명 효과가 전부 보인다 — 검증 시 효과가 잘려 보이는 일이 없도록 한 선택.
export const TimeOfDayContext = createContext('night')

export function useTimeOfDay() {
  return useContext(TimeOfDayContext)
}
