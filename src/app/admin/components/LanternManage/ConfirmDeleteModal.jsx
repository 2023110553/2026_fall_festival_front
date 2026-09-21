import Modal from '../../../../components/common/Modal'
import * as S from './ConfirmDeleteModal.styles'
import { ButtonRow, CloseButton, DeleteButton } from './LanternDetailModal.styles'

// isDeleting / errorMessage는 선택값 — 삭제 요청을 실제로 보내는 화면에서만 넘긴다
export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting = false,
  errorMessage = '',
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Title>정말 삭제하시겠습니까?</S.Title>
      <S.Description>삭제 후에는 데이터가 복구되지 않습니다.</S.Description>
      {errorMessage && <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage>}
      <ButtonRow>
        <CloseButton type="button" disabled={isDeleting} onClick={onClose}>
          닫기
        </CloseButton>
        <DeleteButton type="button" disabled={isDeleting} onClick={onConfirm}>
          {isDeleting ? '삭제 중...' : '삭제하기'}
        </DeleteButton>
      </ButtonRow>
    </Modal>
  )
}
