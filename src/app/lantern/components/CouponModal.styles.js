import styled from 'styled-components'

export const COUPON_LAYOUT = {
  height: 206,
  rewardHeight: 58,
  inputHeight: 44,
  buttonGap: 12,
}

// 공용 Modal이 패널 스타일을 style prop으로 받으므로 이 값도 스타일 파일에서 관리한다.
export const panelStyle = {
  width: '304px', maxWidth: 'calc(100vw - 32px)', boxSizing: 'border-box',
  padding: '28px 20px 16px', borderRadius: '20px', backgroundColor: '#fff',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.12)', textAlign: 'center',
}

export const couponPanelStyle = { ...panelStyle, minHeight: `${COUPON_LAYOUT.height}px` }

export const Title = styled.h2`
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  margin: 0;
  color: #100b0b;
  letter-spacing: -0.6px;
  word-break: keep-all;
  text-align: center;
`

export const Description = styled.p`
  font-size: 12px;
  line-height: 14px;
  color: #100b0b;
  margin: 8px 0 10px;
  text-align: center;
`

export const Button = styled.button`
  flex: 1;
  height: 36px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  background-color: #ededed;
  color: #9f9c99;
  cursor: pointer;
`

export const PrimaryButton = styled(Button)`
  background-color: #737373;
  color: #fff;

  &:disabled {
    background-color: #d9d9d9;
    color: #9f9c99;
    cursor: default;
  }
`

export const FullWidthButton = styled(Button)`width: 100%;`

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-top: ${COUPON_LAYOUT.buttonGap}px;
`

export const Reward = styled.div`
  height: ${COUPON_LAYOUT.rewardHeight}px;
  padding: 10px 16px;
  box-sizing: border-box;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background-color: #9f9c99;
  color: #100b0b;
  font-size: 16px;
  font-weight: 700;
`

export const RewardTitle = styled.span`
  font-size: 16px;
  line-height: 19px;
`

export const UsageDescription = styled.span`
  font-size: 10px;
  line-height: 12px;
  font-weight: 400;
`
