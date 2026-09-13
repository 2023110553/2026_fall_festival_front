import styled from 'styled-components'

export const TabList = styled.div`
  width: 100%;
  max-width: 343px;
  height: 40px;
  display: flex;
  overflow: hidden;
  border-radius: 999px;
  background: #fff;
`

export const Tab = styled.button`
  flex: ${({ $selected }) => ($selected ? '0 0 120px' : '1 1 0')};
  height: 40px;
  padding: 5px 0;
  border: 0;
  border-radius: ${({ $selected }) => ($selected ? '30px' : '0')};
  background: ${({ $selected }) => ($selected ? '#737373' : 'transparent')};
  color: ${({ $selected }) => ($selected ? '#fff' : '#737373')};
  font-size: 14px;
  font-weight: 500;
  line-height: 1;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.color.primary};
    outline-offset: -2px;
  }
`
