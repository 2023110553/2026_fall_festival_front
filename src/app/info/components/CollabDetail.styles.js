import styled from 'styled-components'

export const Page = styled.article`
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: ${({ theme }) => theme.color.text};
`

export const Image = styled.img`
  width: 100%;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  background: #222;
  object-fit: cover;
`

export const Title = styled.h2`
  margin: 0;
  font-size: 24px;
`

export const Label = styled.strong`
  color: #999;
  font-size: 13px;
`

export const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.color.textSub};
  font-size: 14px;
  line-height: 1.7;
`

export const Link = styled.a`
  display: flex;
  justify-content: center;
  padding: 13px;
  border-radius: 12px;
  background: ${({ theme }) => theme.color.primary};
  color: #fff;
  font-weight: 600;
`
