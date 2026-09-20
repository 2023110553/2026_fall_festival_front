// 등불아이콘 + 등불개수 + 부스명을 3D 앵커 좌표 위에 얹는 라벨.
// 재원-프론트1 합의(B안): @react-three/drei의 <Html>로 MapCanvas가 넘겨주는 카메라/앵커 좌표를
// 받아서 그리는 방식. 좌표 연동 방식 확정되면 이 컴포넌트 안에서 Html 포지셔닝을 구현한다.
//
// 2026-09-18: 재원이 직접 마무리 — 목데이터 연결 동작 확인하다가 이 컴포넌트가 참고용
// 정적 구현 그대로 남아있던 걸 발견해서(onClick 없음, 등불개수 하드코딩, 접근성 라벨 없음,
// 카테고리 구분 없음) 한 번에 정리함:
//   1) onClick 연결 — BoothMarker가 이미 갖고 있던 onClick을 그대로 흘려보냄.
//   2) 등불개수 실제 데이터 연동 — 하드코딩된 32 → lanternCount prop.
//   3) 접근성 — 버튼에 aria-label 추가(스크린리더가 "OO 부스, 등불 N개"로 읽음).
//   4) 카테고리별 색 구분 — constants/categories.js의 BOOTH_CATEGORIES.color를 그대로 재사용
//      (중복 매핑 새로 안 만듦). 매칭 안 되면 기본 브랜드색(#DC7054)으로 폴백.
// 클릭 시 hover/active 피드백은 PinLabel.styles.js에서 처리.
// 2026-09-18(2차): 마커 아래 부스명 칩(BoothName)은 재원 요청으로 다시 뺌 — 마커가
// 촘촘해지면 이름표끼리 겹치는 문제가 있어서 지도 위에는 안 보이는 게 낫다는 판단.
// label은 여전히 aria-label(접근성)에는 쓰이므로 prop 자체는 유지.

import * as S from './PinLabel.styles'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'

const DEFAULT_PIN_COLOR = '#DC7054'

function getCategoryColor(category) {
  return BOOTH_CATEGORIES.find((item) => item.value === category)?.color ?? DEFAULT_PIN_COLOR
}

export default function PinLabel({ onClick, label, category, lanternCount = 0 }) {
  const pinColor = getCategoryColor(category)

  return (
    <S.PinLabelWrapper
      type="button"
      onClick={onClick}
      aria-label={label ? `${label} 부스, 등불 ${lanternCount}개` : `부스, 등불 ${lanternCount}개`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="54"
        viewBox="0 0 40 54"
        fill="none">
        <path d="M40 20.3025C40 29.5444 27.8125 45.9979 22.4688 52.7866C21.1875 54.4045 18.8125 54.4045 17.5313 52.7866C12.1875 45.9979 0 29.5444 0 20.3025C0 9.09385 8.95833 0 20 0C31.0417 0 40 9.09385 40 20.3025Z" fill="#FDFDFD"/>
      </svg>
      <S.PinContent>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none">
          <path d="M10.01 18V16H4.01V18C4.01 19.1 4.91 20 6.01 20H8.01C9.11 20 10.01 19.1 10.01 18ZM3.2 13.08C3.33 13.26 3.49 13.61 3.63 14H10.39C10.54 13.61 10.69 13.26 10.82 13.08C11.17 12.58 11.54 12.15 11.9 11.72C12.93 10.51 14 9.26 14 7C14 3.14 10.86 0 7 0C3.14 0 0 3.14 0 7C0 9.28 1.07 10.53 2.1 11.73C2.46 12.15 2.83 12.58 3.19 13.08H3.2ZM7.01 3V5C5.91 5 5.01 5.9 5.01 7H3.01C3.01 4.79 4.8 3 7.01 3Z" fill={pinColor}/>
        </svg>
        <S.LanternCount $color={pinColor}>{lanternCount}</S.LanternCount>
      </S.PinContent>
    </S.PinLabelWrapper>
  )
}
