import Modal from '../../../../components/common/Modal'
import { panelStyle, Title, Description } from '../LanternManage/ConfirmDeleteModal.styles'
import { ButtonRow, CloseButton, DeleteButton } from '../LanternManage/LanternDetailModal.styles'

export default function ConfirmLeaveModal({ isOpen, onClose, onConfirm, continueLabel = '계속 수정하기' }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={panelStyle}>
      <Title>정말 나가시겠습니까?</Title>
      <Description>저장하지 않은 게시물은 사라집니다</Description>
      <ButtonRow>
        <CloseButton type="button" onClick={onClose}>
          {continueLabel}
        </CloseButton>
        <DeleteButton type="button" onClick={onConfirm}>
          나가기
        </DeleteButton>
      </ButtonRow>
    </Modal>
  )
}
