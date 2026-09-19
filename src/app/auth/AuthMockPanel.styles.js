import styled from 'styled-components'

export const Panel = styled.aside`
  position: fixed;
  left: 50%;
  bottom: 84px;
  transform: translateX(-50%);
  z-index: 100;
  width: max-content;
  max-width: calc(100vw - 24px);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid #d6a900;
  border-radius: 8px;
  background: #fff5c2;
  color: #222;
  font-size: 12px;
`
