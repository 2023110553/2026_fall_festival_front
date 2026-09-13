import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100vh;
  padding: 32px 16px 136px;
  background: #111214;
  color: #fff;
`

export const Content = styled.div`
  width: 100%;
  max-width: 343px;
  margin: 0 auto;

  > h1 {
    margin: 0 0 32px;
    font-size: 22px;
  }
`

export const Section = styled.section`
  margin-bottom: 36px;

  > h2 {
    margin: 0 0 16px;
    font-size: 16px;
  }

  p {
    margin: 0;
    color: #9f9c99;
    font-size: 14px;
  }
`

export const Value = styled.p`
  margin-top: 12px !important;
`

export const HeaderPreview = styled.div`
  width: calc(100% + 32px);
  margin-bottom: 28px;
  margin-left: -16px;
`

export const StateLabel = styled.p`
  margin: 0 0 10px !important;
  padding: 0 16px;
  color: #9f9c99;
  font-size: 12px !important;
`
