import Modal from '../../../components/common/Modal'
import * as S from './CouponResultModal.styles'

export default function CouponResultModal({ isOpen, onClose, coupon, onUseClick }) {
  if (!coupon || !['win', 'lose', 'used'].includes(coupon.status)) return null
  const isLose = coupon.status === 'lose'
  const isUsed = coupon.status === 'used'
  const description = isLose ? '아쉽지만 내일 다시 도전해봐요.'
    : isUsed ? '사용된 쿠폰이에요.' : '주점에서 직접 서버한테 보여주세요.'
  return <Modal isOpen={isOpen} onClose={onClose} style={S.panelStyle}>
    <S.Title>등불을 성공적으로 남겼어요!</S.Title>
    <S.Description>{description}</S.Description>
    <S.Reward>
      <S.RewardTitle>{isLose ? '꽝' : coupon.reward}</S.RewardTitle>
      {!isLose && coupon.usageDescription && <S.UsageDescription>{coupon.usageDescription}</S.UsageDescription>}
    </S.Reward>
    <S.ButtonGroup>
      <S.CloseButton type="button" onClick={onClose}>닫기</S.CloseButton>
      {!isLose && <S.UseButton type="button" disabled={isUsed} onClick={onUseClick}>
        {isUsed ? '사용완료' : '사용하기'}
      </S.UseButton>}
    </S.ButtonGroup>
  </Modal>
}
