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
// 부스 목록 필터 칩 전용 — 백엔드 GET /api/booths/?category= 가 받는 값(BOOTH / TOILET / ALCOHOL / ECO).
// 'BOOTH'는 서버가 협업(COLLAB)+일반(ETC) 부스를 묶어서 내려주는 칩이라 COLLAB/ETC를 따로 보내면 400이 난다.
// 마커 색상 구분(BOOTH_CATEGORIES)과 필터 칩(BOOTH_FILTER_CHIPS)은 역할이 달라 분리해둔다.
export const BOOTH_FILTER_CHIPS = [
  { value: 'BOOTH', labelKey: 'map.category.BOOTH' },
  { value: 'TOILET', labelKey: 'map.category.TOILET' },
  { value: 'ALCOHOL', labelKey: 'map.category.ALCOHOL' },
  { value: 'ECO', labelKey: 'map.category.ECO' },
]

// 상세·카드에서 '간단 표시'로 그릴 곳인지 — 위치(와 가는 길)만 보여주고
// 소개문구·운영시간·메뉴·등불은 감춘다. 등불을 받을 수 없는 시설이 대상이다.
//
// 2026-09-26 수정: 원래 조건이
//   place_type === 'FACILITY' || ['TOILET', 'ALCOHOL'].includes(category)
// 였는데, ALCOHOL은 야간 주점 부스에 붙는 **필터 칩 카테고리**(위 BOOTH_FILTER_CHIPS)이지
// 시설이 아니다. 시설과 같이 묶여 있던 탓에 야간 주점 25곳이 전부 위치만 보이고
// 소개문구(24곳)·운영시간·메뉴(94줄)가 감춰졌다. 등불 개수와 등불 탭도 같이 가려져서
// 그 부스들은 등불 등록 자체가 막혀 있었다 — 등불 색 분류표(boothAffiliations.js의
// NIGHT_BOOTH_AFFILIATION)가 바로 그 부스들을 단과대·동아리로 나눠 두고 있으니,
// 야간 주점이 등불 대상인 건 분명하다.
//
// 같은 식이 BoothDetailPanel과 BoothCardList 두 곳에 복사돼 있던 것도 한쪽만 고치고
// 지나칠 위험이 있어 여기로 모았다. 판정 기준이 바뀌면 이 함수만 고치면 된다.
export function isSimplePlace(booth) {
  return booth?.place_type === 'FACILITY' || booth?.category === 'TOILET'
}
