import styled from 'styled-components'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Card = styled.button`
  width: 100%;
  min-height: 66px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  color: ${({ theme }) => theme.color.text};
  text-align: left;
`

export const TitleRow = styled.span`
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Summary = styled.span`
  width: 100%;
  display: flex;
  gap: 4px;
  overflow: hidden;
  color: ${({ theme }) => theme.color.textSub};
  font-size: 10px;
  white-space: nowrap;

  time {
    flex: 0 0 auto;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
