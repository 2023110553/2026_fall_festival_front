import styled from 'styled-components'

const TEXT = '#100b0b'
const SUB_TEXT = '#747474'
const ACCENT = '#dc7054'
const PLACEHOLDER = '#100b0b'

export const Card = styled.div`
    width: 100%;
    height: 99px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
    padding: 12px 16px;
    border-radius: ${({ theme }) => theme.radius.md};
    background: rgba(245, 245, 245, 0.5);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`

export const Empty = styled.p`
  width: 100%;
  margin: 0;
  color: ${SUB_TEXT};
  font-size: 14px;
  text-align: center;
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const Thumb = styled.div`
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${PLACEHOLDER};
`

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`

export const Name = styled.span`
  color: ${TEXT};
  font-size: 16px;
  font-weight: 600;
`

export const Category = styled.span`
  color: ${SUB_TEXT};
  font-size: 12px;
  font-weight: 400;
`

export const ProgressArea = styled.div`
  width: 100%;
`

export const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  color: ${SUB_TEXT};
  font-size: 12px;
`

export const Bar = styled.div`
  width: 100%;
  height: 3px;
  border-radius: 999px;
  background: #e4e4e4;
`

export const Fill = styled.div`
  width: ${({ $percent }) => $percent}%;
  height: 100%;
  border-radius: 999px;
  background: ${ACCENT};
`