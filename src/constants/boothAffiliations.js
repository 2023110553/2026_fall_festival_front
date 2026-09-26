// 부스 소속 표 — 등불 마커 색 분류용(constants/boothMarkerColors.js가 읽는다). 2026-09-24 추가.
//
// 왜 프론트에 표로 두나:
//   기디 기준 "야간 부스는 단과대별로 다른 색, 동아리는 한 색"을 판정하려면 부스 소속(단과대/동아리)이 필요한데,
//   백엔드 Booth에는 그런 필드가 없다. 소속은 총학생회 야간 운영표에만 있다
//   (축제부스_전체정리_v5.xlsx '부스' 시트의 '총학 단체명' 열).
//   축제 5일 전이라 백엔드 필드 추가(모델 + 마이그레이션 + fixture + 명세 갱신) 대신 프론트 표로 두기로 했다
//   (재원 결정 — campus-map/booth-lantern-marker-plan.md 3장). 나중에 Booth에 소속 필드가 생기면
//   boothMarkerColors.js의 getBoothAffiliation 한 곳만 그 필드를 읽게 바꾸면 된다.
//
// 키는 booth_id다. 운영 DB는 booths_fixture.json을 loaddata로 넣으면서 pk를 1~48로 직접 지정했기 때문에
// 표시명(바뀔 수 있음)보다 안정적이다. 이름은 사람이 확인하라고 주석으로만 남긴다.
// 부스를 새로 등록하면(pk 49~) 여기에 한 줄 추가해야 색이 잡힌다. 빠뜨리면 '그 외' 색으로 보이고,
// 개발 모드에서는 콘솔에 경고가 한 번 뜬다(boothMarkerColors.js의 getBoothMarkerGroup).

export const AFFILIATION = Object.freeze({
  HUMANITIES: 'HUMANITIES', // 문과대학
  LAW: 'LAW', // 법과대학
  BUDDHISM: 'BUDDHISM', // 불교대학
  EDUCATION: 'EDUCATION', // 사범대학
  ADVANCED_CONVERGENCE: 'ADVANCED_CONVERGENCE', // 첨단융합대학
  SOCIAL_SCIENCES: 'SOCIAL_SCIENCES', // 사회과학대학
  BUSINESS: 'BUSINESS', // 경영대학
  BIOSYSTEMS: 'BIOSYSTEMS', // 바이오시스템대학
  OPEN_MAJOR: 'OPEN_MAJOR', // 열린전공학부
  FUTURE_CONVERGENCE: 'FUTURE_CONVERGENCE', // 미래융합대학
  ENGINEERING: 'ENGINEERING', // 공과대학
  // 동아리 — 단과대가 아닌 학생 단체는 전부 한 색(기디 기준 "동아리들이 여는 부스는 색 통일").
  // 운영표에 '(중앙동아리)' 표시가 없는 축구부 프런트·참사람봉사단·부지run(소모임)도 여기에 넣었다(재원 확인).
  CLUB: 'CLUB',
})

// 야간 부스 booth_id → 소속. 학과 부스는 운영표에 앞에 적힌 단과대로 묶는다(예: "문과대학 철학과" → 문과대학).
// 예외 한 곳: 39 사회복지상담학과는 운영표 밖이라 소속 칸이 비어 있어서, 학과 공식 홈페이지
// (https://dswc.dongguk.edu) 기준 미래융합대학으로 넣었다.
export const NIGHT_BOOTH_AFFILIATION = Object.freeze({
  1: AFFILIATION.BUSINESS, // 경영학과 — 경영대학
  2: AFFILIATION.ENGINEERING, // 공과대학
  3: AFFILIATION.HUMANITIES, // 문과대학
  4: AFFILIATION.HUMANITIES, // 국어국문문예창작학부 — 문과대학
  5: AFFILIATION.HUMANITIES, // 철학과 — 문과대학
  6: AFFILIATION.BIOSYSTEMS, // 식품바이오융합공학과 — 바이오시스템대학
  7: AFFILIATION.LAW, // 법과대학
  8: AFFILIATION.BUDDHISM, // 불교대학
  9: AFFILIATION.BUDDHISM, // 불교학부 — 불교대학
  10: AFFILIATION.EDUCATION, // 사범대학
  11: AFFILIATION.EDUCATION, // 체육교육과 — 사범대학
  12: AFFILIATION.SOCIAL_SCIENCES, // 광고홍보학과 — 사회과학대학
  13: AFFILIATION.SOCIAL_SCIENCES, // 북한학전공 — 사회과학대학
  14: AFFILIATION.SOCIAL_SCIENCES, // 식품산업관리학과 — 사회과학대학
  15: AFFILIATION.SOCIAL_SCIENCES, // 정치외교학전공 — 사회과학대학
  16: AFFILIATION.SOCIAL_SCIENCES, // 행정학전공 — 사회과학대학
  17: AFFILIATION.OPEN_MAJOR, // 열린전공학부
  18: AFFILIATION.ADVANCED_CONVERGENCE, // 의료인공지능학과 — 첨단융합대학
  19: AFFILIATION.CLUB, // 축구부 프런트 DGUFF
  20: AFFILIATION.CLUB, // 디프(중앙동아리)
  21: AFFILIATION.CLUB, // FC 엘레펜테(중앙동아리)
  22: AFFILIATION.CLUB, // 프론티어(중앙동아리)
  23: AFFILIATION.CLUB, // E.L.F(중앙동아리)
  24: AFFILIATION.CLUB, // 푸름누리(중앙동아리)
  25: AFFILIATION.CLUB, // 참사람봉사단
  26: AFFILIATION.CLUB, // 부지run(소모임)
  39: AFFILIATION.FUTURE_CONVERGENCE, // 사회복지상담학과 — 미래융합대학(운영표 밖, 위 예외)
})

// 주간 푸드트럭 booth_id — 등불 색을 '주간 푸드트럭'으로 **강제 지정**하고 싶을 때만 쓴다.
//
// 2026-09-26 변경: 푸드트럭이 부스로 등록되면서(만해광장, 트럭 11대를 부스 1개로 묶음) 판정 방식을 바꿨다.
// 이제 기본 판정은 부스 목록 API가 내려주는 placements의 structure === "TRUCK"이다
// (boothMarkerColors.js의 isFoodTruck). 지도에 트럭 모형으로 그려지는 기준과 같은 값을 보는 거라
// 모양과 색이 따로 놀 수가 없고, 사람이 booth_id를 표에 옮겨 적을 필요도 없다 —
// DB를 다시 넣어 pk가 바뀌어도 색이 안 깨진다.
//
// 이 배열은 placements를 못 받는 경로에서 쓰는 보조 수단으로 남겨둔다:
// 좌표를 아직 안 받아 placements가 빈 부스, 목데이터, placements를 안 내려주는 API를 쓰게 될 때.
// 그런 경우가 없으면 비워 둬도 된다.
export const FOOD_TRUCK_BOOTH_IDS = Object.freeze([])
