import styled from 'styled-components'

export const Panel = styled.aside`
  position: fixed;
  right: 12px;
  bottom: 90px;
  z-index: 200;
  max-width: calc(100vw - 24px);
  border: 2px solid #f59e0b;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px #0002;
  font-size: 12px;
`

export const Toggle = styled.button`
  width: 100%;
  padding: 8px 12px;
  border: 0;
  background: transparent;
  font-weight: 700;
  cursor: pointer;
`

export const Content = styled.div`
  width: 250px;
  max-width: calc(100vw - 48px);
  padding: 0 12px 12px;

  p { margin: 6px 0; }
`

export const Actions = styled.div`
  display: grid;
  gap: 6px;

  button {
    padding: 7px;
    border: 1px solid #e4e4e7;
    border-radius: 6px;
    background: #fafafa;
    cursor: pointer;
  }
`
