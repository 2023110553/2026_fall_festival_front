import Modal from './Modal'
import * as S from './AlertModal.styles'

export default function AlertModal({ isOpen, onClose, title, subTitle, buttonText = '닫기' }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <S.Container>
                <S.Header>
                {title && <S.Title>{title}</S.Title>}
                {subTitle && <S.SubTitle>{subTitle}</S.SubTitle>}
                </S.Header>

                <S.CloseBtn type="button" onClick={onClose}>
                {buttonText}
                </S.CloseBtn>
            </S.Container>
        </Modal>
    )
}