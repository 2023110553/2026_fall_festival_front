import styled from 'styled-components'

const TEXT = '#100b0b'
const SUB_TEXT = '#737373'
const CARD_BG = '#fdfdfd'
const PLACEHOLDER = '#100b0b'
const ACCENT = '#dc7054'
const DOT = '#9f9c99'

export const List = styled.ul`
  width: 100%;
  padding: 16px 16px 16px 34px;
`

export const Item = styled.li`
  position: relative;
  margin-bottom: 16px;
  &::before {
    content: '';
    position: absolute;
    left: -22px;
    top: 2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: ${({ $isLive }) => ($isLive ? ACCENT : DOT)};
    filter: drop-shadow(0 0 4px rgba(0, 0, 0, 0.25)) blur(3px);
  }
  &::after {
    content: '';
    position: absolute;
    left: -16px;
    top: 24px;
    width: 2px;
    height: 67px;
    background: ${({ $isLive }) =>
    $isLive
      ? 'linear-gradient(180deg, #dc7054 0%, #fcf8f7 100%)'
      : 'linear-gradient(180deg, #dadada 0%, #fcf8f7 100%)'};
  }
`

export const Time = styled.p`
  margin: 0 0 8px;
  color: ${({ $isLive }) => ($isLive ? ACCENT : TEXT)};
  font-size: 14px;
  font-weight: ${({ $isLive }) => ($isLive ? 600 : 400)};
`

export const Card = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 0;
  border-radius: 6px;
  background: ${({ $isLive }) =>
    $isLive ? 'rgba(220, 112, 84, 0.1)' : CARD_BG};
  box-shadow: ${({ $isLive }) =>
    $isLive ? '0 2px 5px 0 rgba(0, 0, 0, 0.15)' : '0 2px 5px 0 rgba(0, 0, 0, 0.1)'};

  &:disabled {
    opacity: 1;
    color: inherit;
  }
`

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Thumb = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${PLACEHOLDER};
`

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`

export const Name = styled.span`
  color: ${TEXT};
  font-size: 16px;
  font-weight: 600;
`

export const Category = styled.span`
  color: ${SUB_TEXT};
  font-size: 12px;
  font-weight: 400;
`

export const Chevron = styled.span`
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  margin-right: 4px;
  border-top: 1.5px solid ${SUB_TEXT};
  border-right: 1.5px solid ${SUB_TEXT};
  transform: rotate(45deg);
`

export const Empty = styled.p`
  padding: 40px 0;
  color: ${SUB_TEXT};
  font-size: 14px;
  text-align: center;
`