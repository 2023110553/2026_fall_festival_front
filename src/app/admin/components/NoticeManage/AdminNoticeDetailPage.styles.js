import styled from 'styled-components'

export { TypeTag, BottomBar, PrimaryButton } from './AdminNoticePage.styles'

export const Page = styled.div`
  min-height: 100vh;
  background-color: #E0E0E0;
`

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding-bottom: 100px;
`

export const Header = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-top: 16px;
  padding: 0 16px;
`

export const BackButton = styled.button`
  position: absolute;
  left: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
`

export const HeaderTitle = styled.h1`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 400;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 16px 16px;
`

export const Title = styled.h2`
  margin: 0;
  color: #000;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.35;
  word-break: keep-all;
  padding-top: 1px;
`

export const ContentCard = styled.article`
  margin: 0 16px;
  padding: 12px 16px 20px;
  border-radius: 12px;
  background: #FDFDFD;
`

export const Image = styled.img`
  display: block;
  width: 100%;
  border-radius: 8px;
  object-fit: cover;
`

export const Content = styled.p`
  margin: 16px 0 0;
  color: #000;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: keep-all;
`

export const DangerButton = styled.button`
  width: 137px;
  height: 60px;
  flex-shrink: 0;
  border: 1px solid #C62828;
  border-radius: 99px;
  background: #EDB5B5;
  color: #C62828;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
`
