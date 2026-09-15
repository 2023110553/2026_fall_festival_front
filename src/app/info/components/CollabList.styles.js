import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export const Heading = styled.header`
  h2 {
    margin: 0;
    color: ${({ theme }) => theme.color.text};
    font-size: 22px;
  }

  p {
    margin: 7px 0 0;
    color: ${({ theme }) => theme.color.textSub};
    font-size: 13px;
  }
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const Card = styled.button`
  width: 100%;
  min-height: 82px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 16px;
  background: ${({ theme }) => theme.color.surface};
  color: ${({ theme }) => theme.color.text};
  text-align: left;
`

export const Thumbnail = styled.span`
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  border-radius: 12px;
  background: linear-gradient(135deg, #d8d8da, #eeeeef);
`

export const Body = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-size: 15px;
  }

  span {
    overflow: hidden;
    color: ${({ theme }) => theme.color.textSub};
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const Chevron = styled.span`
  color: #777;
  font-size: 24px;
`

export const More = styled.button`
  min-height: 44px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 12px;
  background: #fff;
  color: ${({ theme }) => theme.color.text};
  font-size: 14px;
`
