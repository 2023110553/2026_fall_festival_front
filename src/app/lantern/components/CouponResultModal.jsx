import Modal from '../../../components/common/Modal'

// 당첨/꽝 결과 모달 — 당첨이면 쿠폰 혜택 문구 + "사용하기", 꽝이면 "아쉽지만 내일 다시 도전하세요"
export default function CouponResultModal({ open, onClose, result }) {
  return (
    <Modal open={open} onClose={onClose}>
      {result === 'win' ? <p>등불을 성공적으로 남겼어요! (쿠폰 혜택 placeholder)</p> : <p>꽝 — 아쉽지만 내일 다시 도전하세요</p>}
    </Modal>
  )
}
