import styled from 'styled-components'
import { ButtonGroup as BaseButtonGroup, PrimaryButton, COUPON_LAYOUT } from './CouponModal.styles'

export { couponPanelStyle as panelStyle, Title, Description, Button as CloseButton } from './CouponModal.styles'

export const CodeInput = styled.input`
  width: 100%;
  display: block;
  height: ${COUPON_LAYOUT.inputHeight}px;
  margin-top: 0;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #ddd;
  font-size: 18px;
  line-height: 21px;
  box-sizing: border-box;
`
export const ErrorMessage = styled.p`
  text-align: left;
  font-size: 10px;
  color: #dc7054;
  line-height: 14px;
  margin: 0 0 0 4px;
`
export const FeedbackSlot = styled.div`
  /* 혜택 영역 + 버튼 간격과 같은 높이를 확보해 버튼 위치까지 맞춘다. */
  height: ${COUPON_LAYOUT.rewardHeight + COUPON_LAYOUT.buttonGap - COUPON_LAYOUT.inputHeight}px;
  display: flex;
  align-items: center;
`
export const ButtonGroup = styled(BaseButtonGroup)`
  margin-top: 0;
`
export const SubmitButton = styled(PrimaryButton)`
  &:disabled { cursor: not-allowed; }
`
