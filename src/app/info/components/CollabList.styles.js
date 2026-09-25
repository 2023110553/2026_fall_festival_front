import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Heading = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  color: #100b0b;

  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
  }

  span {
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
  }
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Card = styled.button`
  width: 100%;
  min-height: 92px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 0;
  border-radius: 12px;
  background: rgba(253, 253, 253, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  color: #100b0b;
  text-align: left;
`

export const Thumbnail = styled.span`
  width: 66px;
  height: 66px;
  flex: 0 0 66px;
  overflow: hidden;
  border-radius: 5px;
  background: #100b0b;

  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
  }
`

export const Body = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;

  strong {
    overflow: hidden;
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    display: -webkit-box;
    overflow: hidden;
    color: #737373;
    font-size: 12px;
    line-height: 14px;
    text-overflow: ellipsis;
    overflow-wrap: break-word;
    text-wrap: pretty;
    word-break: keep-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
`

export const Chevron = styled.img`
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
`

export const More = styled.button`
  align-self: center;
  display: flex;
  flex-direction: ${({ $expanded }) => ($expanded ? 'column-reverse' : 'column')};
  align-items: center;
  gap: 4px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #100b0b;
  font-size: 12px;
`

export const MoreArrow = styled.img`
  width: 18px;
  height: 11px;
  transform: ${({ $expanded }) => ($expanded ? 'rotate(180deg)' : 'none')};
`

