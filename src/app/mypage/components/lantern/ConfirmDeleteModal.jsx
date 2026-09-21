import Modal from "../../../../components/common/Modal";
import { useTranslation } from '../../../../i18n/useTranslation'
import * as S from './ConfirmDeleteModal.styles'

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm, pending = false, error = '' }) {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={pending ? () => {} : onClose} style={S.modalStyle}>
      <S.Content>
        <S.Title>{t('delete.title')}</S.Title>
        <S.Description>{t('delete.description')}</S.Description>
      </S.Content>

      {error && <p role="alert">{error}</p>}
      <S.ButtonRow>
        <S.CloseButton type="button" disabled={pending} onClick={onClose}>
          {t('common.close')}
        </S.CloseButton>
        <S.DeleteButton type="button" disabled={pending} onClick={onConfirm}>
          {t('lantern.delete')}
        </S.DeleteButton>
      </S.ButtonRow>
    </Modal>
  );
}
