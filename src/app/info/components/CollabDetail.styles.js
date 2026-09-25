import styled from 'styled-components'

export const Page = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
  color: #100b0b;
`

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  border-radius: 10px;
  background: #fdfdfd;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

export const Image = styled.img`
  width: 100%;
  height: 231px;
  border-radius: 10px;
  background: #f2f2f2;
  object-fit: ${({ $fit }) => $fit || 'cover'};
`

export const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1;
  text-align: center;
`

export const Label = styled.strong`
  color: #100b0b;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
`

export const Copy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Description = styled.p`
  margin: 0;
  color: #737373;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  overflow-wrap: break-word;
  text-wrap: pretty;
  white-space: pre-line;
  word-break: keep-all;
`

export const Sns = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Link = styled.a`
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: #0c3393;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
`

export const InstagramIcon = styled.img`
  width: 24px;
  height: 24px;
  flex: 0 0 24px;
  display: block;
  border-radius: 9.429px;
`
