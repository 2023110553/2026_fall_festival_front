import { useMapContext } from '../../context/MapProvider'

// 검색 input — 결과는 서버 재호출 없이 이미 불러온 구역 부스 목록을 클라이언트에서 필터링 (useBoothSearch)
export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useMapContext()

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="장소명을 검색해보세요"
    />
  )
}
