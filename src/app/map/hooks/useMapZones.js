import { useMapContext } from '../context/MapProvider'

// 현재 선택한 구역의 3D 부스 마커가 Provider의 구역별 목록을 사용한다.
export function useMapZoneBooths() {
  return useMapContext().booths
}
