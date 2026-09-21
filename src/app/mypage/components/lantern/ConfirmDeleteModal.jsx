import Modal from "../../../../components/common/Modal";
import * as S from './ConfirmDeleteModal.styles'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.modalStyle}>
      <S.Content>
        <S.Title>정말 삭제하시겠습니까?</S.Title>
        <S.Description>삭제 후에는 데이터가 복구되지 않습니다.</S.Description>
      </S.Content>

      {/* 하단 버튼 영역 */}
      <S.ButtonRow>
        <S.CloseButton type="button" onClick={onClose}>
          닫기
        </S.CloseButton>
        <S.DeleteButton type="button" onClick={onConfirm}>
          삭제하기
        </S.DeleteButton>
      </S.ButtonRow>
    </Modal>
  );
}
