// 지도 카테고리 필터 — 와이어프레임 기준 (백엔드 응답 필드명 확정되면 value 맞춰서 수정)
// color: 2026-09-18 추가 — 3D 지도 PinLabel 마커를 카테고리별로 구분하기 위한 포인트 컬러.
// 기존 브랜드 강조색(#DC7054, 포커스 아웃라인/활성 탭 등)을 ETC(기본) 그대로 쓰고,
// 나머지는 의미가 바로 연상되는 톤으로 골랐다(화장실=파랑, 주류=와인, 협업=보라, 에코=초록).
// 2026-09-20: PR #68 병합 — 부스 목록 필터 칩에서는 ETC와 COLLAB을 하나로 묶어서 보여준다
// (BoothListPanel.jsx 참고). 여기서는 지도 마커 색상 구분을 위해 COLLAB을 별도 항목으로 유지.
export const BOOTH_CATEGORIES = [
  { value: 'ETC', label: '주야간부스', color: '#DC7054' },
  { value: 'TOILET', label: '화장실', color: '#4A90D9' },
  { value: 'ALCOHOL', label: '주류', color: '#8B3A62' },
  { value: 'COLLAB', label: '협업', color: '#6B5FCE' },
  { value: 'ECO', label: '동빛/에코코', color: '#4C9A6B' },
]