import styled from 'styled-components'
import { Reward, COUPON_LAYOUT } from './CouponModal.styles'

export { couponPanelStyle as panelStyle, Title, Description, RewardTitle, UsageDescription, FullWidthButton as CloseButton } from './CouponModal.styles'

export const Container = styled.div`text-align: center;`
export const ScratchArea = styled.div`
  position: relative;
  width: 100%;
  height: ${({ $height }) => $height}px;
  margin: 0 auto;
`
export const Result = styled(Reward)`
  position: absolute;
  inset: 0;
`
export const Canvas = styled.canvas`
  position: absolute;
  inset: 0;
  width: 100%;
  height: ${({ $height }) => $height}px;
  touch-action: none;
  border-radius: 8px;
  cursor: pointer;
`
export const Footer = styled.div`margin-top: ${COUPON_LAYOUT.buttonGap}px;`
