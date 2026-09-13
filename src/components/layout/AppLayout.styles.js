import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100vh;
  padding-bottom: calc(
    ${({ theme }) => theme.nav.height} + 30px + env(safe-area-inset-bottom)
  );

  background: #000;
`