import styled from 'styled-components'

export const Header = styled.header`
  position: relative;
  z-index: 100;
  display: flex;
  width: 100%;
  max-width: 375px;
  height: 24px;
  align-items: center;
  margin: 0 auto;
  padding: 0 16px;
`

export const TitleGroup = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 8px;
`

export const MarkerBox = styled.span`
  position: relative;
  width: 10px;
  height: 10px;
  flex: 0 0 10px;
`

export const Marker = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 20px;
  height: 20px;
  transform: translate(-50%, -50%);
`

export const Title = styled.h1`
  overflow: hidden;
  margin: 0;
  color: ${({ $appearance, theme }) => ($appearance === 'light' ? theme.color.text : '#fff')};
  font-size: 18px;
  font-weight: 600;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Actions = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 8px;
`

export const LanguageControl = styled.div`
  position: relative;
  width: 80px;
  height: 24px;
`

export const LanguageButton = styled.button`
  display: flex;
  width: 80px;
  height: 24px;
  align-items: center;
  justify-content: space-between;
  padding: 6px 8px;
  border: 0;
  border-radius: 99px;
  background: #fdfdfd;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.25);
  color: #100b0b;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;

  &:focus-visible {
    outline: 2px solid #dc7054;
    outline-offset: 2px;
  }
`

export const LanguageLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
`

export const Flag = styled.img`
  display: block;
  width: 12px;
  height: 12px;
  flex: 0 0 12px;
  border: 0.2px solid #9f9c99;
  border-radius: 50%;
  object-fit: cover;
`

export const LanguageChevron = styled.img`
  display: block;
  width: 4.042px;
  height: 6.976px;
  flex: 0 0 auto;
  transform: ${({ $open }) => ($open ? 'rotate(90deg)' : 'rotate(-90deg)')};
  transition: transform 0.2s ease;
`

export const LanguageMenu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  z-index: 220;
  display: flex;
  width: 80px;
  flex-direction: column;
  align-items: flex-start;
  padding: 4px 8px;
  border-radius: 8px;
  background: #fdfdfd;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
`

export const LanguageOption = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
  padding: 10px 0;
  border: 0;
  border-bottom: ${({ $hasDivider }) => ($hasDivider ? '0.4px solid #d8d8d8' : '0')};
  background: #fdfdfd;
  color: #100b0b;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  white-space: nowrap;

  &:disabled {
    color: #100b0b;
    cursor: default;
    opacity: 1;
  }
`

export const ProfileButton = styled.button`
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
`

export const ProfileIcon = styled.img`
  display: block;
  width: 24px;
  height: 24px;
`

export const LoginButton = styled.button`
  width: 54px;
  height: 24px;
  flex: 0 0 54px;
  padding: 0;
  border: 1px solid #d8d8d8;
  border-radius: 12px;
  background: #fdfdfd;
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 16px;
  z-index: 200;
  display: flex;
  width: 80px;
  flex-direction: column;
  align-items: stretch;
  padding: 4px 8px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
`

export const MenuItem = styled.button`
  width: 100%;
  padding: 10px 0;
  border: 0;
  border-bottom: 0.4px solid #e4e4e4;
  background: transparent;
  color: #000;
  font-size: 10px;
  font-weight: 400;
  line-height: normal;
  text-align: left;
  white-space: nowrap;
`

export const LogoutItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  gap: 4px;
  border-bottom: 0;
  color: red;
`

export const LogoutIcon = styled.img`
  width: 10px;
  height: 12px;
  object-fit: contain;
`
