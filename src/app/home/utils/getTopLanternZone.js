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
