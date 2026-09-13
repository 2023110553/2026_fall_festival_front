import styled from 'styled-components'

export const Wrapper = styled.nav`
  position: fixed;
  left: 50%;
  bottom: calc(15px + env(safe-area-inset-bottom));
  width: calc(100% - 32px);
  max-width: 343px;
  height: 88px;
  transform: translateX(-50%);
  filter: drop-shadow(0 4px 4px rgba(255, 255, 255, 0.4));
  z-index: ${({ theme }) => theme.zIndex.bottomNav};
`

export const Bar = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px 8px;
  border-radius: 99px;
  background: #fff;
`

export const ItemGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`

export const NavItem = styled.button`
  width: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #9f9c99;
`

export const Icon = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
`

export const Label = styled.span`
  color: #9f9c99;
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
`

export const LanternItem = styled.button`
  position: absolute;
  top: 0;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: transparent;
  transform: translateX(-50%);
`

export const LanternButton = styled.span`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 2px rgba(159, 156, 153, 0.4);
`

export const PlusIcon = styled.img`
  width: 41px;
  height: 41px;
  object-fit: contain;
`
