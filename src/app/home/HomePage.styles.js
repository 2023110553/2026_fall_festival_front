import styled from 'styled-components'


export const Page = styled.main`
  width: 100%;
  max-width: 375px;
  margin: 0 auto;
  padding-top: calc(44px + env(safe-area-inset-top));
`

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-top: 16px;
`

export const Gap = styled.div`
  margin-top: ${({ $size }) => `${$size}px`};
`

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 24px; /* 배너 ~ 날짜 24px */
`

export const HeroDate = styled.p`
  margin: 0;
  color: #fff;
  font-size: 10px;
  font-weight: 400;
  letter-spacing: 0.5px;
`

export const HeroRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

// DIRVANA 로고 — 별도 이미지가 아닌거 맞는지 추후에 기디측 확인 필요함@
export const HeroLogo = styled.h2`
  display: flex;
  align-items: center;
  margin: 0;
  color: #dc7054;
  font-size: 40px;
  font-weight: 800;
  line-height: normal;
`

export const FlippedR = styled.span`
  display: inline-block;
  transform: scaleX(-1);
`

export const DayBadge = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 10px;
  border: 0;
  border-radius: 10px;
  background: #fff;
  color: #dc7054;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
`
