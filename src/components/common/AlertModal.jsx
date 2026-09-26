import Modal from './Modal'
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './AlertModal.styles'

export default function AlertModal({ isOpen, onClose, title, subTitle, buttonText, onConfirm, confirmText, disabled = false, portal = false }) {
    const { t } = useTranslation()
    const resolvedButtonText = buttonText ?? t('common.close')
    return (
        <Modal isOpen={isOpen} onClose={disabled ? undefined : onClose} style={S.modalStyle} portal={portal}>
            <S.Container>
                <S.Header>
                {title && <S.Title>{title}</S.Title>}
                {subTitle && <S.SubTitle>{subTitle}</S.SubTitle>}
                </S.Header>

                {onConfirm ? (
                    <S.ButtonRow>
                        <S.CloseBtn type="button" onClick={onClose} disabled={disabled}>
                        {resolvedButtonText}
                        </S.CloseBtn>
                        <S.ConfirmBtn type="button" onClick={onConfirm} disabled={disabled}>
                        {confirmText}
                        </S.ConfirmBtn>
                    </S.ButtonRow>
                ) : (
                    <S.CloseBtn type="button" onClick={onClose} disabled={disabled}>
                    {resolvedButtonText}
                    </S.CloseBtn>
                )}
            </S.Container>
        </Modal>
    )
}
