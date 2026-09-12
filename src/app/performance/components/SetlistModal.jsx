import Modal from '../../../components/common/Modal'

// 공연 상세(선택 시) — 출연진 소개, 공연순서(셋리스트) 표시
export default function SetlistModal({ open, onClose, setlist = [] }) {
  return (
    <Modal open={open} onClose={onClose}>
      <ol>
        {setlist.map((song, i) => (
          <li key={i}>{song}</li>
        ))}
      </ol>
    </Modal>
  )
}
