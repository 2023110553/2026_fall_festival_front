import styled from 'styled-components'

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Card = styled.button`
  width: 100%;
  min-height: 72px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 13px 12px;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: rgba(253, 253, 253, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #100b0b;
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
  font-size: 12px;
  line-height: 1;
  white-space: nowrap;

  time {
    flex: 0 0 auto;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
