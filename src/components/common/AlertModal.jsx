import Modal from './Modal'
import * as S from './AlertModal.styles'

export default function AlertModal({ isOpen, onClose, title, subTitle, buttonText = '닫기', onConfirm, confirmText }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} style={S.modalStyle}>
            <S.Container>
                <S.Header>
                {title && <S.Title>{title}</S.Title>}
                {subTitle && <S.SubTitle>{subTitle}</S.SubTitle>}
                </S.Header>

                {onConfirm ? (
                    <S.ButtonRow>
                        <S.CloseBtn type="button" onClick={onClose}>
                        {buttonText}
                        </S.CloseBtn>
                        <S.ConfirmBtn type="button" onClick={onConfirm}>
                        {confirmText}
                        </S.ConfirmBtn>
                    </S.ButtonRow>
                ) : (
                    <S.CloseBtn type="button" onClick={onClose}>
                    {buttonText}
                    </S.CloseBtn>
                )}
            </S.Container>
        </Modal>
    )
}