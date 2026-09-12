import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100%;
  padding-bottom: calc(${({ theme }) => theme.nav.height} + 12px);
`

export const Nav = styled.nav`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${({ theme }) => theme.nav.height};
  display: flex;
  border-top: 1px solid ${({ theme }) => theme.color.border};
  background: ${({ theme }) => theme.color.bg};
  z-index: ${({ theme }) => theme.zIndex.bottomNav};
`

export const NavItem = styled.button`
  flex: 1;
  border: none;
  background: none;
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ theme, $active }) => ($active ? theme.color.primary : theme.color.textSub)};
`
