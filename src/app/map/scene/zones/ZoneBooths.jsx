import BoothMarker from './BoothMarker'
import BoothPin from './BoothPin'
import { BOOTH_PIN_PREVIEW, BOOTH_PIN_PROPS } from './boothPinPreview'
import { getBoothTents } from './boothTents'

// 구역 부스 목록(API 응답의 booths[]) → BoothMarker 배치.
//
// 2026-09-19: 원래 Zone1Scene 안에 있던 "places.map → <BoothMarker …/>" 블록을 떼어내 공통화한
// 컴포넌트. 팔정도/만해광장/학림관에도 같은 API 부스 데이터를 붙이면서
// 같은 코드가 네 파일에 복사될 상황이라 한 곳으로 모았다.
//
// 2026-09-19(2차): booth 스키마를 세호님 '장소 목록 조회' API(GET /api/booths/) 응답과
// 1:1로 맞췄다. 예전에는 3D 배치 전용으로 별도 coordinates{x,y,z,rotation} 필드를 썼는데,
// 명세에 "map_x/map_y/map_elevation/rotation은 FE 3D 씬 좌표를 무변환으로 반환한다"고
// 확정되면서(map_x=씬 x, map_y=씬 z, map_elevation=씬 y, rotation=y축 회전) 그 필드들이 곧
// 3D 좌표 그 자체가 됐다. 그래서 이제 coordinates 없이 map_x/map_y/map_elevation/rotation을
// 바로 BoothMarker position/rotationY에 꽂는다. 현재 GET /api/booths/의 data.booths를
// 별도 매핑 없이 사용한다.
//
// 2026-09-20: 부스 마커를 3D 핀(BoothPin)으로 교체 — 재원 요청("마커를 3D로, 구글맵 핀 느낌으로").
// 이 컴포넌트가 "부스 한 동 = 천막(BoothMarker) + 마커(BoothPin)"를 같은 좌표에 나란히 놓는
// 자리가 됐다. 둘을 합치지 않고 형제로 둔 이유는 BoothPin.jsx 상단 주석 참고(B안 합의 + 충돌 회피).
// 백엔드 변동은 없다 — 핀이 쓰는 값(map_x/map_y/map_elevation/category/lantern_count/name/booth_id)이
// 전부 이미 GET /api/booths/ 명세에 있는 필드라, 렌더 방식만 바뀌고 데이터 계약은 그대로다.
// 기존 <Html> PinLabel은 3D 핀과 겹치므로 기본값에서는 끈다(BoothMarker의 showLabel=false).
// ?marker=label / ?marker=both 로 되돌려 비교할 수 있다 — boothPinPreview.js 참고.
//
// 2026-09-22: booth_size 연결 — 한 천막을 나눠 쓰던 부스를 3x3 작은 천막으로 분리하기로 하면서(재원 결정)
// 부스마다 천막 규격을 받는다. 값은 그대로 BoothMarker에 넘기고, "BIG"/"SMALL" 정리와 기본값("BIG")은
// BoothMarker 안(constants/boothSizes.js의 normalizeBoothSize)에서 한다 — 백엔드가 필드를 추가하기 전에는
// undefined가 넘어가서 전부 기존 3x6 천막으로 그려진다. 핀(BoothPin) 높이는 작은 천막 꼭대기(피니얼 포함 약 4.1m)보다
// 이미 충분히 높아서(5.5m) 크기와 상관없이 그대로 둔다.
//
// 2026-09-24: "부스 1개 = 천막 1동" 제약을 풀었다 — 재원이 좌표 목록에 문과대학(1)/(2)처럼 여러 동을 적어도
// 지도에는 한 동만 나오는 문제(142동 중 66동 누락). 원인은 Booth 테이블이 부스당 좌표를 한 세트만 들고 있고
// 이 컴포넌트도 booths.map으로 1:1로 돌았기 때문. 백엔드 Booth.placements(날짜·시간대별 천막 배열)를 받아
// boothTents.js가 "부스 1개 → 천막 n동"으로 펴고, 여기서는 그 배열을 그린다. 세 가지를 정했다(재원 결정):
//   - 핀(BoothPin)은 부스당 1개, 첫 천막 위에만. 천막마다 달면 같은 부스 등불 수가 n번 보이고
//     디프(7동)처럼 넓은 부스는 핀이 뭉쳐서 지저분해진다.
//   - 천막은 n동 전부 클릭 가능. 어느 동을 눌러도 같은 booth_id로 바텀시트가 열린다.
//   - <Html> 라벨(?marker=label)도 첫 천막에만. 같은 이름이 n번 뜨는 걸 막는다.
// 바닥 글로우(등불 단계)는 천막마다 켠다 — 한 부스가 쓰는 자리 전체가 밝아지는 게 실제에 가깝다.
// 대표 천막만 켜고 싶으면 아래 glow 조건을 showLabel과 같은 방식으로 바꾸면 된다.
//
// booth 스키마(GET /api/booths/ 명세):
//   - booth_id: BoothMarker key + onBoothClick(boothId)에 넘기는 값
//   - map_x / map_y / map_elevation / rotation: Three.js 씬 좌표(m) — map_x=씬 x, map_y=씬 z,
//     map_elevation=씬 y(높이), rotation은 도 단위 Y축 회전. 천막이 여러 동이면 "첫 천막" 대표값이다
//   - placements: 그 날짜·시간대에 그 부스가 쓰는 천막 배열(없거나 null이면 대표 좌표로 1동) — boothTents.js
//   - name / category / lantern_count — 라벨(PinLabel), 카테고리 색, 등불 개수(밝기 단계 자동 계산)
//   - booth_size — 천막 규격 "BIG"(3x6, 기본) | "SMALL"(3x3). 명세상 rotation 바로 다음 필드, 없으면 "BIG"
//
// props:
//   - booths: 부스 배열(없으면 아무것도 안 그림)
//   - brightnessLevel: (선택) 밝기 단계 override — null이면 BoothMarker가 lantern_count로 자동 계산
//     (BoothMarker.jsx 19번 항목). MapProvider.boothBrightnessPreview가 MapCanvas → 씬 → 여기로 내려온다.
//   - onBoothClick(boothId): 부스 클릭 콜백(MapShell이 바텀시트 열기로 연결)
export default function ZoneBooths({ booths = [], brightnessLevel = null, onBoothClick }) {
  const { showPin, showLabel } = BOOTH_PIN_PREVIEW

  return booths.map((booth, index) => {
    // 좌표가 없는 부스(정보 미수령)는 천막이 0동으로 나온다 — 3D 씬에서는 건너뛴다.
    // 그대로 두면 전부 원점에 겹쳐 그려진다(카드 목록 등 2D 리스트에는 그대로 노출).
    const tents = getBoothTents(booth)
    if (tents.length === 0) {
      return null
    }

    // 핀과 라벨이 붙는 대표 천막. placements는 백엔드에서 날짜·시간대·천막번호 순으로 정렬돼 오고,
    // 없으면 부스 자신이 첫 항목이라 어느 쪽이든 "대표 좌표"와 같은 자리다.
    const [representative] = tents
    const handleClick = () => onBoothClick?.(booth.booth_id)

    return (
      <group key={booth.booth_id}>
        {tents.map((tent) => (
          <BoothMarker
            key={`${booth.booth_id}-${tent.unitNo}`}
            position={tent.position}
            rotationY={tent.rotationY}
            size={tent.size}
            label={booth.name}
            showLabel={showLabel && tent === representative}
            category={booth.category}
            lanternCount={booth.lantern_count}
            brightnessLevel={brightnessLevel}
            onClick={handleClick}
          />
        ))}
        {showPin ? (
          <BoothPin
            position={representative.position}
            category={booth.category}
            count={Number(booth.lantern_count) || 0}
            // 부스마다 다른 위상을 줘야 핀들이 한 몸처럼 같이 출렁이지 않고 따로 논다
            bobPhase={index * 0.7}
            onClick={handleClick}
            {...BOOTH_PIN_PROPS}
          />
        ) : null}
      </group>
    )
  })
}
