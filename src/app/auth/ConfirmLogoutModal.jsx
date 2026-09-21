import Modal from '../../components/common/Modal'
import * as S from './ConfirmLogoutModal.styles'

export default function ConfirmLogoutModal({ isOpen, onClose, onConfirm, pending = false }) {
  return (
    <Modal isOpen={isOpen} onClose={pending ? undefined : onClose}>
      <S.Content>
        <S.Title>로그아웃 하시겠습니까?</S.Title>
        <S.Description>등불을 달려면 다시 로그인해야 합니다.</S.Description>
        <S.Actions>
          <S.CancelButton type="button" onClick={onClose} disabled={pending}>닫기</S.CancelButton>
          <S.ConfirmButton type="button" onClick={onConfirm} disabled={pending}>
            {pending ? '로그아웃 중…' : '로그아웃'}
          </S.ConfirmButton>
        </S.Actions>
      </S.Content>
    </Modal>
  )
}
