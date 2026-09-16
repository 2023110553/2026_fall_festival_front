import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const SearchWrap = styled.label`
  position: relative;
  display: block;
`

export const SearchIcon = styled.span`
  position: absolute;
  top: 50%;
  left: 12px;
  color: #777;
  font-size: 18px;
  transform: translateY(-54%);
`

export const Search = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 12px 0 36px;
  border: 1px solid #b8a09a;
  border-radius: 8px;
  outline: none;
  background: transparent;
  color: ${({ theme }) => theme.color.text};
  font: inherit;

  &::placeholder {
    color: #8b8b8b;
  }

  &:focus {
    border-color: #dc7054;
  }
`

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const DateFilters = styled.div`
  display: flex;
  gap: 8px;
`

export const DateFilter = styled.button`
  min-width: 42px;
  height: 26px;
  padding: 0 8px;
  border: 0;
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? '#676767' : '#8a8a8a')};
  color: #fff;
  font-size: 10px;
`

export const FilterHint = styled.span`
  color: #9a8b87;
  font-size: 9px;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Card = styled.button`
  width: 100%;
  min-height: 68px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.color.border};
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.06);
  color: ${({ theme }) => theme.color.text};
  text-align: left;
`

export const Body = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const TitleRow = styled.span`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const DateBadge = styled.span`
  flex: 0 0 auto;
  padding: 4px 6px;
  border-radius: 4px;
  background: #6d6d6d;
  color: #fff;
  font-size: 9px;
`

export const Hashtags = styled.span`
  display: flex;
  gap: 4px;
  overflow: hidden;

  span {
    flex: 0 0 auto;
    padding: 2px 5px;
    border-radius: 999px;
    background: #f6f6f6;
    color: #333;
    font-size: 9px;
  }
`

export const Thumbnail = styled.span`
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
  background: #0d0708;
  color: #fff;
  font-size: 9px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
