import { MapProvider } from './context/MapProvider'
import MapShell from './components/MapShell/MapShell'

// 지도 메인 페이지 — 실제 화면 조립은 MapShell 안에서 이뤄진다.
// MapProvider로 감싸서 하위 컴포넌트 어디서든 useMapContext()로 구역/주야/날짜/검색어 등을 꺼내 쓸 수 있게 한다.
export default function MapPage() {
  return (
    <MapProvider>
      <MapShell />
    </MapProvider>
  )
}
