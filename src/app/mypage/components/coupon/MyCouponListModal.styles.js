import styled from 'styled-components'

export const panelStyle = {
  display: 'flex',
  width: '305px',
  padding: '28px 16px 16px 16px',
  flexDirection: 'column',
  alignItems: 'flex-start',
  borderRadius: '12px',
  background: '#F7F7F7',
  boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.15)',
}

export const Header = styled.div`
  width: 100%;
  margin: 0 8px 14px;
  text-align: left;
`

export const Title = styled.h2`
  margin: 0;
  color: var(--aurora_black, #100b0b);
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 600;
`

export const SubTitle = styled.p`
  margin: 6px 0 0;
  color: var(--aurora_black, #100b0b);
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
`

export const CouponList = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 8px;
`

export const CouponCard = styled.button`
  position: relative;
  display: flex;
  width: 100%;
  height: 87px;
  align-items: flex-start;
  padding: 14px 20px;
  overflow: hidden;
  border: 0;
  border-radius: 9px;
  background-color: transparent;
  background-image: url('${import.meta.env.BASE_URL}images/${({ $isUsed }) => ($isUsed ? 'mycoupon-end.png' : 'mycoupon.png')}');
  background-position: center;
  background-size: 100% 100%;
  color: ${({ $isUsed }) => ($isUsed ? '#66625e' : '#cf7459')};
  font-family: Pretendard;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #dc7054;
    outline-offset: 2px;
  }

  &:disabled {
    cursor: default;
  }
`

export const Day = styled.span`
  font-size: 12px;
  line-height: 18px;
`

export const Divider = styled.span`
  width: 1px;
  height: 16px;
  margin: 1px 10px 0;
  background: currentColor;
  opacity: 0.8;
`

export const Status = styled.span`
  padding: 4px 8px;
  border-radius: 999px;
  background: ${({ $isUsed }) => ($isUsed ? '#66625e' : '#cf7459')};
  color: #fdfdfd;
  font-size: 9px;
  font-weight: 500;
  line-height: 1;
`

export const Brand = styled.span`
  position: absolute;
  bottom: 14px;
  left: 20px;
  color: currentColor;
  font-size: 24px;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.8px;
`

export const Chevron = styled.span`
  position: absolute;
  top: 12px;
  right: 14px;
  color: #403d3a;
  font-family: Arial, sans-serif;
  font-size: 24px;
  font-weight: 300;
  line-height: 1;
`

export const EmptyState = styled.p`
  width: 100%;
  margin: 0;
  padding: 45px 15px;
  box-sizing: border-box;
  color: var(--aurora_gray, #9f9c99);
  text-align: center;
  font-family: Pretendard;
  font-size: 12px;
  font-weight: 400;
`

export const FooterNotice = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 6px;
  margin-top: 10px;
  text-align: left;
`

export const InfoIcon = styled.svg`
  flex-shrink: 0;
  margin-top: 1px;
`

export const NoticeText = styled.p`
  margin: 0;
  color: var(--aurora_gray, #9f9c99);
  font-family: Pretendard;
  font-size: 8px;
  font-weight: 400;
`

export const CloseBtn = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background-color: #d8d8d8;
  color: #605d5d;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
`
