import styled from 'styled-components'

const cardTransform = (position) => {
  if (position === 0) return 'translateX(-50%)'
  if (position === -1) return 'translateX(calc(-50% - 120px)) translateY(148px) scale(0.714285) rotate(-10deg)'
  if (position === 1) return 'translateX(calc(-50% + 121px)) translateY(148px) scale(0.714285) rotate(10deg)'
  if (position <= -2) return 'translateX(calc(-50% - 171px)) translateY(164px) scale(0.714285) rotate(-20deg)'
  return 'translateX(calc(-50% + 172px)) translateY(164px) scale(0.714285) rotate(20deg)'
}

const cardLayer = (position) => {
  if (position <= -2) return 1
  if (position === -1) return 2
  if (position === 0) return 3
  if (position === 1) return 4
  return 5
}

export const Wrapper = styled.div`
  position: relative;
  min-height: 514px;
`

export const RoleTabs = styled.div`
  display: flex;
  gap: 16px;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 6px;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`

export const RoleTab = styled.button`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 4px 12px;
  border: 0;
  border-radius: 8px;
  opacity: 0.9;
  background: ${({ $active }) => ($active ? '#272727' : '#fdfdfd')};
  color: ${({ $active }) => ($active ? '#fdfdfd' : '#272727')};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  font-family: Pretendard, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: normal;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease, background 0.2s ease;
  &:focus-visible { outline: 2px solid #dc7054; outline-offset: 2px; }
`

export const Hint = styled.p`
  margin: 15px 0 0;
  color: #737373;
  font-size: 12px;
  line-height: 17px;
  text-align: center;
`

export const CardStage = styled.div`
  position: relative;
  width: calc(100% + 32px);
  height: 408px;
  margin-left: -16px;
  overflow: hidden;
  touch-action: pan-y;
  user-select: none;

  &::after {
    position: absolute;
    top: 250px;
    left: 50%;
    z-index: 1;
    width: 288px;
    height: 72px;
    border-radius: 50%;
    background: rgba(80, 67, 57, 0.14);
    filter: blur(18px);
    transform: translateX(-50%);
    content: '';
  }

  &:focus-visible { outline: 2px solid #dc7054; outline-offset: -2px; }
`

export const CardSlot = styled.button`
  position: absolute;
  top: 16px;
  left: 50%;
  z-index: ${({ $position }) => cardLayer($position)};
  width: 210px;
  height: 280px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: ${({ $position }) => cardTransform($position)};
  transform-origin: center;
  cursor: pointer;
  transition: transform 0.32s ease, z-index 0s linear 0.16s;

  &:focus-visible { outline: 2px solid #dc7054; outline-offset: 4px; }
`
