import Modal from '../../../../components/common/Modal'
import { FESTIVAL_DATES } from '../../../../constants/festivalDates'
import * as S from './MyCouponListModal.styles'

const STATUS_LABELS = {
  unscratched: '결과 확인',
  win: '당첨 | 사용 가능',
  lose: '미당첨 | 꽝',
  used: '당첨 | 사용 완료',
  expired: '당첨 | 사용 만료',
}

export default function MyCouponListModal({ isOpen, onClose, coupons = [], onSelect }) {
  const couponsByDate = new Map(coupons.map((coupon) => [coupon.date, coupon]))
  const receivedCoupons = FESTIVAL_DATES.map((date, index) => ({
    day: index + 1,
    coupon: couponsByDate.get(date),
  })).filter(({ coupon }) => coupon)

  return (
    <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
      <S.Header>
        <S.Title>나의 쿠폰</S.Title>
        <S.SubTitle>축제 기간 동안 받은 쿠폰을 확인해보세요</S.SubTitle>
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
                aria-label={`DAY ${day} 쿠폰, ${STATUS_LABELS[coupon.status] ?? '확인'}`}
              >
                <S.Day>DAY {day}</S.Day>
                <S.Divider aria-hidden="true" />
                <S.Status $isUsed={isUsed}>{STATUS_LABELS[coupon.status] ?? '결과 확인'}</S.Status>
                <S.Brand>Pulse on</S.Brand>
                {!isUsed && <S.Chevron aria-hidden="true">›</S.Chevron>}
              </S.CouponCard>
            )
          })}
        </S.CouponList>
      ) : (
        <S.EmptyState>아직 받은 쿠폰이 없습니다.</S.EmptyState>
      )}

      <S.FooterNotice>
        <S.InfoIcon width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M5.5 3.5H6.5V6.5H5.5V3.5ZM5.5 7.5H6.5V8.5H5.5V7.5Z" fill="#9F9C99" />
          <path d="M6 11C8.755 11 11 8.755 11 6C11 3.245 8.755 1 6 1C3.245 1 1 3.245 1 6C1 8.755 3.245 11 6 11ZM6 2C8.205 2 10 3.795 10 6C10 8.205 8.205 10 6 10C3.795 10 2 8.205 2 6C2 3.795 3.795 2 6 2Z" fill="#9F9C99" />
        </S.InfoIcon>
        <S.NoticeText>
          당첨 쿠폰은 동국대학교 멋쟁이사자처럼 동아리방(학생회관 2층)에서 수령할 수 있어요. 쿠폰 화면을 운영진에게 보여주세요. 확인 코드는 운영진이 직접 입력해요.
        </S.NoticeText>
      </S.FooterNotice>

      <S.CloseBtn type="button" onClick={onClose}>닫기</S.CloseBtn>
    </Modal>
  )
}
