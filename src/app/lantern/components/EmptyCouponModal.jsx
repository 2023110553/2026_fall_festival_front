import Modal from '../../../components/common/Modal'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './EmptyCouponModal.styles'

export default function EmptyCouponModal({ isOpen, onClose }) {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Title>{t('coupon.emptyTitle')}</S.Title>
      <S.Description>
        {t('coupon.emptyDescription')}
      </S.Description>
      <S.CloseButton type="button" onClick={onClose}>
        {t('common.close')}
      </S.CloseButton>
    </Modal>
  )
}
