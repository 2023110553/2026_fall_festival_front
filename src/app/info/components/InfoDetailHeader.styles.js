import styled from 'styled-components'

export const Header = styled.header`
  display: grid;
  grid-template-columns: 24px 1fr 24px;
  align-items: center;

  h2 {
    margin: 0;
    color: #100b0b;
    font-size: ${({ $compact }) => ($compact ? '14px' : '18px')};
    font-weight: ${({ $compact }) => ($compact ? 400 : 600)};
    line-height: 1;
    text-align: center;
  }
`

export const Back = styled.button`
  width: 24px;
  height: 24px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #100b0b;
  font-size: 30px;
  line-height: 20px;
`
