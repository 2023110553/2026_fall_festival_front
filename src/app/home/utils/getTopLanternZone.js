import { MAP_ZONES } from '../../../constants/zones'

// 부스 목록(GET /api/booths/ 응답의 booths[])을 구역별 등불 합계로 묶는다.
// - 구역 매칭은 MapProvider와 동일하게 booth.zone(문자열) === MAP_ZONES[].label 기준.
//   백엔드 zone이 자유 텍스트라 라벨과 한 글자라도 다르면 그 부스는 어느 구역에도 안 잡힌다(지도 핀도 마찬가지).
// - lantern_count는 백엔드 Booth 모델의 누적 컬럼(축제 전체 기준)이라 "오늘" 필터 개념은 없다.
// - 반환 순서는 MAP_ZONES 순서 그대로(정렬은 pickTopLanternZone에서).
export function sumLanternsByZone(booths = []) {
  const list = Array.isArray(booths) ? booths : []
  return MAP_ZONES.map((zone) => ({
    zoneId: zone.id,
    lanternCount: list
      .filter((booth) => booth?.zone === zone.label)
      .reduce((sum, booth) => sum + (Number(booth.lantern_count) || 0), 0),
  }))
}

// 등불 합계가 가장 큰 구역 하나를 고른다. 동률이면 MAP_ZONES 순서가 빠른 쪽(안정 정렬).
// 전 구역이 0개면 null — 호출부(LanternPreview)가 기본 구역(DEFAULT_PREVIEW_ZONE_ID)으로 대체한다.
export function pickTopLanternZone(booths = []) {
  const totals = sumLanternsByZone(booths)
  const top = totals.reduce((best, zone) => (zone.lanternCount > best.lanternCount ? zone : best), totals[0])
  return top && top.lanternCount > 0 ? top : null
}

// 2026-09-23: 부스 id → 구역 id.
// 홈 부스 랭킹에서 "이 부스가 어느 구역인지"를 알아야 /map?zone=zone2&booth=57 처럼 구역까지 짚어서 보낼 수 있다.
// 구역 없이 보내도 지도가 부스 목록을 받은 뒤 알아서 찾아가지만, 그동안 기본 구역(혜화관)이 잠깐 보였다가
// 바뀌는 깜빡임이 생긴다. 구역을 같이 넘기면 처음부터 맞는 구역이 그려진다.
//
// 구역 매칭 기준은 sumLanternsByZone과 같다 — booth.zone(문자열) === MAP_ZONES[].label.
// 어느 구역에도 안 잡히는 부스(라벨 불일치, 구역에서 빠진 건물 등)는 아예 빠지고,
// 그런 부스는 호출부가 구역 없이 /map?booth=57로 보낸다(지도가 목록을 받은 뒤 스스로 구역을 찾아간다).
export function mapZoneIdByBoothId(booths = []) {
  const list = Array.isArray(booths) ? booths : []
  const zoneIdByLabel = new Map(MAP_ZONES.map((zone) => [zone.label, zone.id]))

  return list.reduce((zoneIdByBoothId, booth) => {
    const zoneId = zoneIdByLabel.get(booth?.zone)
    if (zoneId && Number.isInteger(booth?.booth_id)) zoneIdByBoothId[booth.booth_id] = zoneId
    return zoneIdByBoothId
  }, {})
}
