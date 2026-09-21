import styled from 'styled-components'

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
`

export const Panel = styled.div`
  width: min(305px, 88vw);
  background: ${({ theme }) => theme.color.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 24px 20px;
  text-align: center;
`
