import { useParams } from 'react-router-dom'
import LanternViewTab from '../LanternViewTab/LanternViewTab'

// 장소 상세(풀페이지) — BottomSheet와 데이터/레이아웃이 거의 동일하고 이벤트/인스타 링크만 추가되므로
// "부스 설명" 탭 내용은 BottomSheet와 동일한 컴포넌트를 재사용한다 (map-section-scope-and-roles.md 지시사항).
// 현재 라우터에는 아직 연결하지 않음 — 지도 메인 흐름이 먼저 확정되면 /map/booths/:boothId 라우트로 연결 예정
export default function PlaceDetailPage() {
  const { boothId } = useParams()

  return (
    <div>
      <p>장소 상세 placeholder (boothId: {boothId})</p>
      <p>이벤트 정보 / 인스타그램 링크 — 이 화면에만 추가되는 부분</p>
      <LanternViewTab boothId={boothId} />
    </div>
  )
}
