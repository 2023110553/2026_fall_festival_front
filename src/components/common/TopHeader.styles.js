import styled from 'styled-components'

export const Header = styled.header`
  position: relative;
  width: 100%;
  max-width: 375px;
  height: 24px;
  display: flex;
  align-items: center;
  margin: 0 auto;
  padding: 0 16px;
`

export const TitleGroup = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
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
  font-size: 20px;
  font-weight: 600;
  line-height: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const Actions = styled.div`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const LanguageButton = styled.button`
  height: 24px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid rgba(17, 18, 20, 0.18);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.86);
  color: #333;
  font-size: 9px;
  opacity: 1;
  cursor: default;
`

export const LanguageChevron = styled.span`
  margin-left: 1px;
  color: #555;
  font-size: 10px;
  transform: translateY(-1px);
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
  border: 1px solid #D8D8D8;
  border-radius: 12px;
  background: #FDFDFD;
  font-size: 10px;
  font-weight: 400;
  line-height: 22px;
`

export const Menu = styled.div`
  position: absolute;
  top: calc(100% + 5px);
  right: 16px;
  width: 80px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  padding: 4px 8px;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
  z-index: 200;
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
