// 부스 하나가 쓰는 천막 목록 펴기 — 2026-09-24 추가.
//
// 왜 있나: Booth 테이블은 부스 1행에 좌표를 map_x/map_y/map_elevation/rotation 한 세트만 들고 있어서
// "한 부스가 천막을 여러 동 쓰는" 경우를 담지 못했다. 실제 배치는 142동 중 66동이 그런 경우라
// (문과대학 9/29 2동, 사범대학 4동, 디프 10/1 7동 …) 지도에 천막이 절반만 그려지고 있었다.
// 백엔드 Booth에 placements(JSON 배열) 필드를 추가해 천막 전체를 내려받기로 하면서(재원 결정,
// 문서: campus-map/booth-placements-backend-guide.md) 이 파일이 "부스 1개 → 천막 n동"으로 펴는 자리가 됐다.
//
// 데이터 계약(GET /api/booths/):
//   - placements: 그 요청의 날짜·시간대에 해당하는 천막만. 백엔드가 이미 걸러서 내려주므로
//     프론트에서 날짜를 다시 거르지 않는다.
//   - 항목의 map_x/map_y/map_elevation/rotation/booth_size는 Booth의 같은 이름 필드와 의미·단위가 같다.
//     그래서 아래에서 "천막 항목"과 "부스 자신"을 같은 코드로 읽을 수 있다.
//   - placements가 null이거나 빈 배열이면 대표 좌표(부스 자신의 map_*)로 천막 1동만 그린다.
//     → 백엔드에 필드만 배포되고 데이터가 아직 안 들어간 상태에서도 화면이 지금과 똑같다.
//       배포 순서를 프론트·백엔드가 맞출 필요가 없다는 뜻이다.
//
// 축제 후 BoothPlacement 테이블로 옮겨도(관련 논의는 위 문서 8장) related_name을 "placements"로 두면
// 응답 모양이 같아서 이 파일은 그대로 둘 수 있다.

import { HAS_STRUCTURE_PREVIEW, STRUCTURE_PREVIEW } from './structurePreview'

// 좌표 세 축이 모두 있어야 씬에 놓을 수 있다. 백엔드 컬럼이 nullable이라 정보 미수령 부스는
// null로 내려오는데, 그대로 두면 전부 원점(0,0,0)에 겹쳐 그려진다(카드 목록 등 2D 리스트는 그대로 노출).
function hasCoordinates(source) {
  return source?.map_x != null && source?.map_y != null && source?.map_elevation != null
}

// rotation은 nullable이고 명세상 "도" 단위다. null은 0으로 치지만 undefined는 NaN이 되므로
// (NaN이 rotation에 들어가면 천막이 통째로 사라진다) Number로 한 번 걸러서 라디안으로 바꾼다.
function toRadians(degrees) {
  const value = Number(degrees)
  return (Number.isFinite(value) ? value : 0) * (Math.PI / 180)
}

// 부스 1개 → 천막 배열. 좌표가 없는 천막(과 부스)은 빠지므로 빈 배열이 나올 수 있다.
//   - unitNo:   그 날 그 부스의 몇 번째 천막인지(1부터). React key와 디버깅용
//   - position: BoothMarker/BoothLantern에 그대로 넘기는 [x, y, z] (map_x=씬 x, map_elevation=씬 y, map_y=씬 z)
//   - rotationY: Y축 회전(라디안)
//   - size:     천막 규격. 천막별 값이 우선이고, 없으면 부스 단위 값으로 떨어진다.
//               둘 다 없으면 BoothMarker 안의 normalizeBoothSize가 "BIG"으로 본다.
//               ※ 만화얼처럼 날짜에 따라 크기가 다른 부스가 있어서(9/29·9/30 SMALL, 10/1 BIG)
//                 부스 단위 booth_size보다 천막별 값이 진실이다.
//   - spec:     천막이 아닌 구조물용 { structure, width, depth } (2026-09-26 추가).
//               placements에 structure가 없으면 undefined가 되고, 받는 쪽(constants/boothSizes.js)이
//               "TENT"로 보기 때문에 기존 부스는 동작이 그대로다. 값 정리·범위 제한도 그쪽에서 한다.
//               ?truck= / ?market= 쿼리가 있으면 그 booth_id는 쿼리 값으로 덮어쓴다(structurePreview.js).
//               데이터가 DB에 들어가기 전에 푸드트럭·차양막을 눈으로 확인하려고 둔 개발용 스위치다.
export function getBoothTents(booth) {
  const placements = Array.isArray(booth?.placements) ? booth.placements : []
  // 천막 정보가 없으면 부스 자신을 천막 1동으로 취급한다(위 계약 3번).
  const sources = placements.length > 0 ? placements : [booth]
  // 쿼리가 없으면 STRUCTURE_PREVIEW가 빈 객체라 항상 undefined다 → 평소 동작에는 영향이 없다.
  const preview = HAS_STRUCTURE_PREVIEW ? STRUCTURE_PREVIEW[booth?.booth_id] : undefined

  return sources.filter(hasCoordinates).map((tent, index) => ({
    unitNo: tent.unit_no ?? index + 1,
    position: [tent.map_x, tent.map_elevation, tent.map_y],
    rotationY: toRadians(tent.rotation),
    size: tent.booth_size ?? booth?.booth_size,
    // 미리보기 항목은 구조물을 통째로 지정하는 값이라(structure + 크기) 섞지 않고 그대로 대체한다.
    spec: preview ?? {
      structure: tent.structure,
      width: tent.width,
      depth: tent.depth,
    },
  }))
}
