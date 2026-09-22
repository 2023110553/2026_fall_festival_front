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

export const StatusMessage = styled.p`
  margin: 0;
  padding: 48px 16px;
  color: #737373;
  font-size: 14px;
  text-align: center;
`

export const LoadMoreArea = styled.div`
  padding: 4px 0 8px;
`
