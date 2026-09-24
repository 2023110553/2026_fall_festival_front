// 부스 하나를 정면에서 크게 보는 카메라 자리를 계산한다. three 의존 없는 순수 함수.
//
// 왜 MapCanvas 안이 아니라 별도 파일인가 —
// 각도·거리 계산은 3D 씬을 띄우지 않고 값만으로 검증할 수 있어야 한다. 카메라 연출을 손볼 때마다
// 지도를 전부 렌더해서 눈으로 확인해야 하면 조정이 느려진다. 또 "어디를 볼지 정하는 로직"과
// "실제로 카메라를 옮기는 로직"을 나눠두면(MapCanvas의 ZoneCamera가 후자), 나중에 연출이
// 바뀌어도 한쪽만 고치면 된다 — timeOfDay·부스 밝기에서 쓴 것과 같은 방식이다.
//
// 좌표 규칙은 scene/zones/ZoneBooths.jsx와 같다:
//   씬 x = booth.map_x, 씬 z = booth.map_y, 씬 y(높이) = booth.map_elevation,
//   booth.rotation = 도 단위 Y축 회전.
//
// "정면"을 어떻게 정하나 —
// 천막은 rotation이 0일 때 긴 변(BIG 기준 width 6m)이 x축과 나란하다(constants/boothSizes.js).
// 그래서 긴 변이 바라보는 방향, 즉 천막 로컬 ±z가 정면과 후면이다.
// 캐노피 천막은 앞뒤가 대칭이고 API에도 "어느 쪽이 손님 오는 방향"인지가 없어서,
// 둘 중 **지금 카메라와 가까운 쪽**을 고른다.
//   - 어느 쪽을 골라도 화면에 보이는 모양은 같다(앞뒤 대칭)
//   - 카메라가 반 바퀴 돌아가지 않으니 이동이 짧고, 가는 길에 건물을 가로지를 일이 줄어든다
//   - 나중에 백엔드가 정면 방향을 내려주면 이 함수 안에서 그 값만 쓰면 된다

// 부스에서 카메라까지 거리(m). MapCanvas의 MIN_DISTANCE(20)보다 커야 한다 —
// 작으면 OrbitControls가 첫 update()에서 밀어내서 의도한 구도가 깨진다.
// 25면 천막 한 동과 양옆 여백이 화면에 들어온다(거리별 렌더 비교로 고른 값).
export const BOOTH_FOCUS_DISTANCE = 25

// 내려보는 각(도). 구역 기본 시점은 48.8°로 꽤 위에서 보는데, 그대로 두면 "정면"이 아니라
// 여전히 내려다보는 그림이 된다. 18°면 천막 옆면이 제대로 서 보이면서 지붕도 조금 보인다.
// MapCanvas의 회전 한계(올려본 각 1.7°~65°) 안이라 도착하자마자 튕기지 않는다.
export const BOOTH_FOCUS_ELEVATION_DEG = 18

// 카메라가 바라보는 지점의 높이(m, 부스 바닥 기준). 천막 전체 높이가 3.3m(기둥 2.3 + 지붕 1)라
// 그 중간쯤을 본다. 바닥(0)을 보면 천막이 화면 위로 붕 뜨고, 꼭대기를 보면 바닥이 잘린다.
export const BOOTH_FOCUS_TARGET_HEIGHT = 1.6

const toRadians = (deg) => (deg * Math.PI) / 180

/**
 * 부스를 정면에서 보는 카메라 위치와 타깃을 구한다.
 *
 * @param booth          GET /api/booths/ 부스 항목(map_x / map_y / map_elevation / rotation)
 * @param cameraPosition 지금 카메라 위치 [x, y, z] — 앞뒤 중 가까운 쪽을 고르는 데 쓴다.
 *                       없으면 천막 로컬 +z 쪽을 기본으로 쓴다.
 * @param options        distance / elevationDeg / targetHeight 로 연출을 바꿀 수 있다.
 * @returns { position, target } 또는 좌표가 없는 부스면 null
 */
export function getBoothFocus(booth, cameraPosition = null, options = {}) {
  if (!booth) return null

  const { map_x: x, map_y: z, map_elevation: y } = booth
  // 좌표 컬럼이 nullable이라 미입력 부스가 있다. 그대로 계산하면 원점으로 날아가므로 아무것도 안 한다.
  if (!Number.isFinite(x) || !Number.isFinite(z) || !Number.isFinite(y)) return null

  const {
    distance = BOOTH_FOCUS_DISTANCE,
    elevationDeg = BOOTH_FOCUS_ELEVATION_DEG,
    targetHeight = BOOTH_FOCUS_TARGET_HEIGHT,
  } = options

  const target = [x, y + targetHeight, z]

  // 천막 로컬 +z를 월드로 돌린 방향 = 긴 변이 바라보는 쪽
  const rotationY = toRadians(Number(booth.rotation) || 0)
  let frontX = Math.sin(rotationY)
  let frontZ = Math.cos(rotationY)

  // 앞뒤 중 지금 카메라가 있는 쪽을 고른다(수평 성분만 본다 — 높이는 elevationDeg가 정한다)
  if (Array.isArray(cameraPosition)) {
    const towardCameraX = cameraPosition[0] - x
    const towardCameraZ = cameraPosition[2] - z
    if (towardCameraX * frontX + towardCameraZ * frontZ < 0) {
      frontX = -frontX
      frontZ = -frontZ
    }
  }

  const elevation = toRadians(elevationDeg)
  const horizontal = distance * Math.cos(elevation)

  return {
    position: [
      target[0] + frontX * horizontal,
      target[1] + distance * Math.sin(elevation),
      target[2] + frontZ * horizontal,
    ],
    target,
  }
}
