import Modal from './Modal'
import * as S from './AlertModal.styles'

export default function AlertModal({ isOpen, onClose, title, subTitle, buttonText = '닫기', onConfirm, confirmText, disabled = false }) {
    return (
        <Modal isOpen={isOpen} onClose={disabled ? undefined : onClose} style={S.modalStyle}>
            <S.Container>
                <S.Header>
                {title && <S.Title>{title}</S.Title>}
                {subTitle && <S.SubTitle>{subTitle}</S.SubTitle>}
                </S.Header>

                {onConfirm ? (
                    <S.ButtonRow>
                        <S.CloseBtn type="button" onClick={onClose} disabled={disabled}>
                        {buttonText}
                        </S.CloseBtn>
                        <S.ConfirmBtn type="button" onClick={onConfirm} disabled={disabled}>
                        {confirmText}
                        </S.ConfirmBtn>
                    </S.ButtonRow>
                ) : (
                    <S.CloseBtn type="button" onClick={onClose} disabled={disabled}>
                    {buttonText}
                    </S.CloseBtn>
                )}
            </S.Container>
        </Modal>
    )
}