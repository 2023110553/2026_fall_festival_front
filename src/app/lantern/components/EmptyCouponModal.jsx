import Modal from '../../../components/common/Modal'
import * as S from './EmptyCouponModal.styles'

export default function EmptyCouponModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Title>등불이 아직 없습니다.</S.Title>
      <S.Description>
        첫 등불을 달고 스크래치 쿠폰을 받아보세요.
      </S.Description>
      <S.CloseButton type="button" onClick={onClose}>
        닫기
      </S.CloseButton>
    </Modal>
  )
}
