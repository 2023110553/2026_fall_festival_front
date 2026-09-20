import styled from 'styled-components'

export const Panel = styled.div`
  color: #272727;
  font-size: 12px;
  line-height: 1.6;
  overflow-wrap: anywhere;
  button:focus-visible, a:focus-visible {
    outline: 2px solid #DC7054;
    outline-offset: 3px;
  }
`

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
`

export const Back = styled.button`
  border: 0;
  background: transparent;
  color: #737373;
  width: 32px;
  height: 32px;
  font-size: 22px;
  padding: 0;
  flex-shrink: 0;
`

export const Tabs = styled.div`
  display: flex;
  background: #272727;
  border-radius: 20px;
  padding: 2px;
`

export const Tab = styled.button`
  border: 0;
  border-radius: 18px;
  padding: 5px 8px;
  font-size: 10px;
  white-space: nowrap;
  color: #fff;
  background: ${({ $active }) => $active ? '#DC7054' : 'transparent'
}
`

export const Header = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
`

export const Identity = styled.div`
  flex: 1;
  min-width: 0;
`

export const Title = styled.span`
color: var(--aurora_black, #100B0B);

/* semi20 */
font-family: Pretendard;
font-size: 20px;
font-style: normal;
font-weight: 600;
line-height: normal;
`

export const Subtitle = styled.p`
color: var(--text-or-darkgrey, #737373);

/* medium14 */
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 500;
line-height: normal;

margin: 0px;
margin-top: 4px;
`

export const Lantern = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  min-width: 28px;
  font-size: 10px;
  color: ${({ $on }) => $on ? '#DC7054' : '#272727'
}
img {
  width: 20px;
  height: 24px;
  object-fit: contain;
}
`

export const Section = styled.section`
  padding: 14px 0;
  & + & {
    border-top: 1px solid rgba(159,156,153,0.22);
  }
`

export const Label = styled.h3`
  display: table;
  color: var(--aurora_orange, #DC7054);
  /* semi12 */
  font-family: Pretendard;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  border: 1px solid #DC7054;
  border-radius: 3px;
  padding: 2px 6px;
  margin: 0 0 12px;
`

export const LabelRow = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
`

export const Reusable = styled.span`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #0D9352;
  font-family: Pretendard;
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`

export const Text = styled.span`
color: var(--text_black, #272727);

/* regular14 */
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;

padding: 12px 0px;
`

export const Operations = styled.ul`
color: var(--text_black, #272727);
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
  list-style: none;
  padding: 0;
  margin: 0;
`

export const MenuList = styled.ul`
color: var(--text_black, #272727);
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: 400;
line-height: normal;
  list-style: none;
  padding: 0;
  margin: 0;
  li {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  
  
`

export const Instagram = styled.a`
  display: inline-block;
  color: #225CB0;
  background: #fff;
  padding: 2px 6px;
  border-radius: 4px;
`

export const Poster = styled.img`
  display: block;
  width: 100%;
  height: auto;
  border-radius: 4px;
`

export const Message = styled.p`
  padding: 16px 0;
  color: #737373;
`

export const Retry = styled.button`
  display: block;
  margin-top: 12px;
  padding: 6px 12px;
  border: 1px solid #9F9C99;
  border-radius: 4px;
  background: #fff;
`
