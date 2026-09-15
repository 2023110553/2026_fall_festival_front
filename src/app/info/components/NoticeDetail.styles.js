import styled from 'styled-components'

export const Page = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.color.text};
`

export const Article = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.68);
`

export const TitleRow = styled.div`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Image = styled.img`
  width: 100%;
  aspect-ratio: 1.2;
  border-radius: 8px;
  background: #0d0708;
  object-fit: cover;
`

export const Content = styled.p`
  margin: 0;
  color: #4f4f4f;
  font-size: 13px;
  line-height: 1.8;
  white-space: pre-wrap;
`
