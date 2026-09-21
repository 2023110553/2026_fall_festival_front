import Modal from '../../../../components/common/Modal'
import { FESTIVAL_DATES } from '../../../../constants/festivalDates'
import { useTranslation } from '../../../../i18n/useTranslation'
import * as S from './MyCouponListModal.styles'

const STATUS_LABELS = {
  unscratched: 'coupon.result',
  win: 'coupon.available',
  lose: 'coupon.notWon',
  used: 'coupon.used',
  expired: 'coupon.expired',
}

export default function MyCouponListModal({ isOpen, onClose, coupons = [], onSelect }) {
  const { t } = useTranslation()
  const couponsByDate = new Map(coupons.map((coupon) => [coupon.date, coupon]))
  const receivedCoupons = FESTIVAL_DATES.map((date, index) => ({
    day: index + 1,
    coupon: couponsByDate.get(date),
  })).filter(({ coupon }) => coupon)

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Header>
        <S.Title>{t('coupon.myTitle')}</S.Title>
        <S.SubTitle>{t('coupon.myDescription')}</S.SubTitle>
      </S.Header>

      {receivedCoupons.length > 0 ? (
        <S.CouponList>
          {receivedCoupons.map(({ day, coupon }) => {
            const isUsed = coupon.status === 'used' || coupon.status === 'expired'
            return (
              <S.CouponCard
                key={coupon.id}
                type="button"
                disabled={isUsed}
                $isUsed={isUsed}
                onClick={() => onSelect?.(coupon)}
                aria-label={t('coupon.cardLabel', { day, status: t(STATUS_LABELS[coupon.status] ?? 'common.confirm') })}
              >
                <S.Day>DAY {day}</S.Day>
                <S.Divider aria-hidden="true" />
                <S.Status $isUsed={isUsed}>{t(STATUS_LABELS[coupon.status] ?? 'coupon.result')}</S.Status>
                <S.Brand>Pulse on</S.Brand>
                {!isUsed && <S.Chevron aria-hidden="true">›</S.Chevron>}
              </S.CouponCard>
            )
          })}
        </S.CouponList>
      ) : (
        <S.EmptyState>{t('coupon.none')}</S.EmptyState>
      )}

      <S.FooterNotice>
        <S.InfoIcon width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M5.5 3.5H6.5V6.5H5.5V3.5ZM5.5 7.5H6.5V8.5H5.5V7.5Z" fill="#9F9C99" />
          <path d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2Z" fill="#9F9C99" />
        </S.InfoIcon>
        <S.NoticeText>
          {t('coupon.pickup')}
        </S.NoticeText>
      </S.FooterNotice>

      <S.CloseBtn type="button" onClick={onClose}>{t('common.close')}</S.CloseBtn>
    </Modal>
  )
}
