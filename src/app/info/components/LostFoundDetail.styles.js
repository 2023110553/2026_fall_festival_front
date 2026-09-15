import styled from 'styled-components'

export const Page = styled.article`
  min-height: calc(100vh - 230px);
  display: flex;
  flex-direction: column;
  gap: 14px;
  color: ${({ theme }) => theme.color.text};
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const DateBadge = styled.span`
  flex: 0 0 auto;
  padding: 4px 7px;
  border-radius: 4px;
  background: #686868;
  color: #fff;
  font-size: 10px;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 15px;
`

export const Image = styled.img`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 8px;
  background: #0d0708;
  object-fit: cover;
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;

  span {
    padding: 4px 8px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.08);
    font-size: 11px;
  }
`

export const Link = styled.a`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border-radius: 999px;
  background: #e46f4e;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`
