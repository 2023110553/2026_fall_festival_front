import Modal from '../../../components/common/Modal'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './CouponResultModal.styles'

export default function CouponResultModal({ isOpen, onClose, coupon, onUseClick }) {
  const { t } = useTranslation()
  if (!coupon || !['win', 'lose', 'used', 'expired'].includes(coupon.status)) return null
  const isLose = coupon.status === 'lose'
  const isUsed = coupon.status === 'used'
  const isExpired = coupon.status === 'expired'
  const description = isLose ? t('coupon.tryTomorrow')
    : isUsed ? t('coupon.usedDescription') : isExpired ? t('coupon.expiredDescription') : t('coupon.checkWinner')
  return <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
    <S.Title>{t('coupon.success')}</S.Title>
    <S.Description>{description}</S.Description>
    <S.Reward>
      <S.RewardTitle>{isLose ? t('coupon.lose') : coupon.reward}</S.RewardTitle>
      {!isLose && coupon.usageDescription && <S.UsageDescription>{coupon.usageDescription}</S.UsageDescription>}
    </S.Reward>
    <S.ButtonGroup>
      <S.CloseButton type="button" onClick={onClose}>{t('common.close')}</S.CloseButton>
      {!isLose && <S.UseButton type="button" disabled={isUsed || isExpired} onClick={onUseClick}>
        {isUsed ? t('coupon.useComplete') : isExpired ? t('coupon.useExpired') : t('coupon.use')}
      </S.UseButton>}
    </S.ButtonGroup>
  </Modal>
}
