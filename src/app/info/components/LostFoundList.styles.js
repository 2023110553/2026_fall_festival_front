import styled from 'styled-components'

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const SearchWrap = styled.label`
  position: relative;
  display: block;
`

export const SearchIcon = styled.img`
  position: absolute;
  top: 50%;
  left: 10px;
  width: 20px;
  height: 20px;
  transform: translateY(-50%);
`

export const Search = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 10px 0 38px;
  border: 0.6px solid #737373;
  border-radius: 8px;
  outline: none;
  background: transparent;
  color: #100b0b;
  font-size: 14px;
  font-weight: 400;

  &::placeholder {
    color: #737373;
  }

  &:focus {
    border-color: #dc7054;
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
