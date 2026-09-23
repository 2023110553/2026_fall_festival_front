import styled from 'styled-components'

export const Panel = styled.div`
  padding: 24px 8px 0;
  color: #555;
  button:focus-visible, input:focus-visible {
    outline: none;
    outline-offset: 2px;
  }
`
export const SearchRow = styled.form`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #737373;
`
export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 40px;
  border: 1px solid #272727;
  border-radius: 8px;
`
export const Input = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 8px 4px;
  background: transparent;
  font: inherit;
  font-size: 16px;
  color: #272727;
  &::placeholder { color: #272727; opacity: 1; }
`
export const TextButton = styled.button`
  padding: 4px 0;
  border: 0;
  background: transparent;
  color: #555;
  font-size: 14px;
  white-space: nowrap;
  &:disabled { opacity: 0.45; cursor: default; }
`
export const IconButton = styled.button`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  padding: 0;
  border: 0;
  background: transparent;
`
export const CloseMark = styled.span`
  color: #9F9C99;
  font-size: 26px;
  line-height: 1;
  font-weight: 300;
`
export const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 8px;
`
export const Heading = styled.h2`
  margin: 0;
  padding-top: 12px;
  font-size: 14px;
  font-weight: 600;
`
export const HistoryList = styled.ul`list-style: none; margin: 0; padding: 0;`
export const HistoryItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding-left: 8px;
`
export const TermButton = styled(TextButton)`
  flex: 1;
  min-width: 0;
  text-align: left;
  white-space: normal;
  overflow-wrap: anywhere;
  font-size: 16px;
`
export const Empty = styled.p`padding: 8px; font-size: 14px; color: #737373;`
