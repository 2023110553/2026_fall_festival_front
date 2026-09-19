// 등불아이콘 + 등불개수 + 부스명을 3D 앵커 좌표 위에 얹는 라벨.
// 재원-프론트1 합의(B안): @react-three/drei의 <Html>로 MapCanvas가 넘겨주는 카메라/앵커 좌표를
// 받아서 그리는 방식. 좌표 연동 방식 확정되면 이 컴포넌트 안에서 Html 포지셔닝을 구현한다.

import * as S from './PinLabel.styles'

export default function PinLabel() {
  return (
    <S.PinLabelWrapper>
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
          <path d="M10.01 18V16H4.01V18C4.01 19.1 4.91 20 6.01 20H8.01C9.11 20 10.01 19.1 10.01 18ZM3.2 13.08C3.33 13.26 3.49 13.61 3.63 14H10.39C10.54 13.61 10.69 13.26 10.82 13.08C11.17 12.58 11.54 12.15 11.9 11.72C12.93 10.51 14 9.26 14 7C14 3.14 10.86 0 7 0C3.14 0 0 3.14 0 7C0 9.28 1.07 10.53 2.1 11.73C2.46 12.15 2.83 12.58 3.19 13.08H3.2ZM7.01 3V5C5.91 5 5.01 5.9 5.01 7H3.01C3.01 4.79 4.8 3 7.01 3Z" fill="#DC7054"/>
        </svg>
        <S.LanternCount>32</S.LanternCount>
      </S.PinContent>
    </S.PinLabelWrapper>
  )
}
