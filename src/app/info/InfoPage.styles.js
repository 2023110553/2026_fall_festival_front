import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 0 32px;
  background: transparent;
`
export const Content = styled.div`
  padding: 16px 16px 0;
`

export const Section = styled.section`
  padding-top: ${({ $isDetail }) => ($isDetail ? '0' : '16px')};
`
