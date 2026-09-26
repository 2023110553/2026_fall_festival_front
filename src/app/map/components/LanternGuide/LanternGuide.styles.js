import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 9px;
  right: 11.74px;
  z-index: 2;
`

export const Toggle = styled.button`
  display: grid;
  place-items: center;
  width: 34.26px;
  height: 34.26px;
  padding: 0;
  border: 0;
  border-radius: 9px;
  background: ${({ $isOpen }) => $isOpen ? 'var(--light_grey, #D8D8D8)' : '#FDFDFD'};
  opacity: 0.9;
  filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.10));

  &:focus-visible {
    outline: 2px solid #DC7054;
    outline-offset: 2px;
  }
`

export const Description = styled.div`
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: min(220px, calc(100vw - 32px));
  padding: 11px 13px;
  border-radius: 10px;
  background: rgba(253, 253, 253, 0.75);
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  color: var(--text-or-darkgrey, #737373);
  font-family: Pretendard;
  font-size: 10px;
  font-style: normal;
  font-weight: 400;
  line-height: 14px;
  word-break: keep-all;

  &::before {
    position: absolute;
    top: -7px;
    right: 10px;
    width: 0;
    height: 0;
    border-right: 7px solid transparent;
    border-bottom: 8px solid rgba(253, 253, 253, 0.75);
    border-left: 7px solid transparent;
    content: '';
  }
`
