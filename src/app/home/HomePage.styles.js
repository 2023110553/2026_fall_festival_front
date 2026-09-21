import styled from 'styled-components'


export const Page = styled.main`
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  background: transparent;
`
// 여기 간격 계산
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px;
  margin-top: 15px;
`

export const Gap = styled.div`
  margin-top: ${({ $size }) => `${$size}px`};
`

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  margin-top: 18px; /* 배너 ~ 날짜 18px */
`

/* regular10 */
export const HeroDate = styled.p`
  margin: 0;
  color: #000;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
`

export const HeroRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

// DIRVANA 로고
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
  width: 46px;
  flex: 0 0 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  border: 0;
  border-radius: 999px;
  /* aurora_orange */
  background: #dc7054;
  /* button_shadow */
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.15);

  /* semi10 */
  color: #fdfdfd;
  font-size: 10px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
`
