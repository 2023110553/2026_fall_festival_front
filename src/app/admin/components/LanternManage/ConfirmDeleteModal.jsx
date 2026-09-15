import Modal from '../../../../components/common/Modal'
import * as S from './ConfirmDeleteModal.styles'
import { ButtonRow, CloseButton, DeleteButton } from './LanternDetailModal.styles'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Title>정말 삭제하시겠습니까?</S.Title>
      <S.Description>삭제 후에는 데이터가 복구되지 않습니다.</S.Description>
      <ButtonRow>
        <CloseButton type="button" onClick={onClose}>
          닫기
        </CloseButton>
        <DeleteButton type="button" onClick={onConfirm}>
          삭제하기
        </DeleteButton>
      </ButtonRow>
    </Modal>
  )
}
