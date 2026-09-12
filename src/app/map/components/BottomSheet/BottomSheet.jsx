import { useMapContext } from '../../context/MapProvider'
import LanternViewTab from '../LanternViewTab/LanternViewTab'

// 부스 핀/카드 선택 시 화면 하단에서 올라오는 바텀시트.
// "부스 설명" / "등불 보기" 탭 전환은 MapProvider의 sheetTab 상태로 관리한다.
// PlaceDetailPage(풀페이지)와 데이터/레이아웃 구조가 거의 동일하므로,
// 실제 "부스 설명" 탭 내용은 별도 컴포넌트로 분리해서 두 곳에서 함께 재사용할 것 (새로 만들지 말 것).
export default function BottomSheet({ open, boothId, onClose }) {
  const { sheetTab, setSheetTab } = useMapContext()

  if (!open || !boothId) return null

  return (
    <div>
      <button onClick={onClose}>{'<'}</button>
      <button onClick={() => setSheetTab('info')} disabled={sheetTab === 'info'}>
        부스 설명
      </button>
      <button onClick={() => setSheetTab('lantern')} disabled={sheetTab === 'lantern'}>
        등불 보기
      </button>

      {sheetTab === 'info' ? (
        <p>부스 기본정보/소개/운영정보 placeholder (boothId: {boothId})</p>
      ) : (
        <LanternViewTab boothId={boothId} />
      )}
    </div>
  )
}
