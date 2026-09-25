import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const SearchWrap = styled.label`
  display: flex;
  align-items: center;
  width: 100%;
  height: 40px;
  border: 1px solid #272727;
  border-radius: 8px;
`

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  margin: 0 6px;
  flex: 0 0 24px;
`

export const Search = styled.input`
  width: 100%;
  min-width: 0;
  padding: 8px 4px;
  border: 0;
  outline: none;
  background: transparent;
  color: #272727;
  font: inherit;
  font-size: 16px;

  &::placeholder {
    color: #272727;
    opacity: 1;
  }
`

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

export const DateFilters = styled.div`
  display: flex;
  gap: 8px;
`

export const DateFilter = styled.button`
  min-width: 43px;
  height: 26px;
  padding: 6px 8px;
  border: ${({ $selected }) => ($selected ? '0' : '0.5px solid #d8d8d8')};
  border-radius: 4px;
  background: ${({ $selected }) => ($selected ? '#100b0b' : '#fdfdfd')};
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  color: ${({ $selected }) => ($selected ? '#fdfdfd' : '#737373')};
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  opacity: 0.9;
`

export const FilterHint = styled.span`
  color: #9f9c99;
  font-size: 8px;
  font-weight: 500;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Card = styled.button`
  width: 100%;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 0;
  border-radius: 12px;
  background: rgba(253, 253, 253, 0.8);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #100b0b;
  text-align: left;
`

export const Body = styled.span`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 230px;
  gap: 12px;
`

export const TitleRow = styled.span`
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    overflow: hidden;
    max-width: 187px;
    font-size: 14px;
    font-weight: 600;
    line-height: 1;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const DateBadge = styled.span`
  flex: 0 0 auto;
  width: 35px;
  padding: 4px 6px;
  border-radius: 4px;
  background: #9f9c99;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  color: #fdfdfd;
  font-size: 10px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
`

export const Hashtags = styled.span`
  display: flex;
  gap: 6px;
  overflow: hidden;

  span {
    flex: 0 0 auto;
    height: 16px;
    padding: 2px 8px;
    border: 0.5px solid #d8d8d8;
    border-radius: 999px;
    background: rgba(253, 253, 253, 0.8);
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
    color: #272727;
    font-size: 10px;
    line-height: 11px;
  }
`

export const Thumbnail = styled.span`
  width: 56px;
  height: 56px;
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 5px;
  background: #100b0b;
  color: #fff;
  font-size: 9px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
