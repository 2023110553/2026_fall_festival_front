import { useMapContext } from '../../context/MapProvider'
import LanternViewTab from '../LanternViewTab/LanternViewTab'

// 실제 부스 설명은 장소 상세 페이지와 공통 콘텐츠를 재사용하도록 연결한다.
export default function BoothDetailPanel({ boothId, onBack }) {
  const { sheetTab, setSheetTab } = useMapContext()
  return (
    <>
      <button type="button" onClick={onBack}>목록으로</button>
      <button type="button" onClick={() => setSheetTab('info')} disabled={sheetTab === 'info'}>부스 설명</button>
      <button type="button" onClick={() => setSheetTab('lantern')} disabled={sheetTab === 'lantern'}>등불 보기</button>
      {sheetTab === 'info' ? (
        <p>부스 기본정보/소개/운영정보 placeholder (boothId: {boothId})</p>
      ) : (
        <LanternViewTab boothId={boothId} />
      )}
    </>
  )
}
