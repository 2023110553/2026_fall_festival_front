import styled from 'styled-components'

export const Page = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #100b0b;
`

export const Article = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: rgba(253, 253, 253, 0.5);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

export const TitleRow = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Image = styled.img`
  width: 100%;
  height: 231px;
  border-radius: 10px;
  background: #030202;
  object-fit: cover;
`

export const Content = styled.p`
  margin: 0;
  color: #2d2d2d;
  font-size: 14px;
  line-height: 24px;
  white-space: pre-wrap;
`
