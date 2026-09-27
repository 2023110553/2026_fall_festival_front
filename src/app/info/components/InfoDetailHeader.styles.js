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
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
`

export const BackIcon = styled.img`
  width: 11px;
  height: 18px;
  display: block;
`
