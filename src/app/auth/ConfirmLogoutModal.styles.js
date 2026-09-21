import styled from 'styled-components'

export const Content = styled.div`
  padding: 4px 0;
  text-align: left;
`

export const Title = styled.h2`
  margin: 0;
  color: #111;
  font-size: 18px;
  font-weight: 700;
`

export const Description = styled.p`
  margin: 6px 0 0;
  color: #666;
  font-size: 12px;
`

export const Error = styled.p`
  margin: 12px 0 0;
  color: #d32f2f;
  font-size: 12px;
`

export const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 20px;
`

const ActionButton = styled.button`
  flex: 1;
  padding: 12px;
  border: 0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled { opacity: 0.6; cursor: wait; }
`

export const CancelButton = styled(ActionButton)`
  background: #ededed;
  color: #666;
`

export const ConfirmButton = styled(ActionButton)`
  background: #333;
  color: #fff;
`
