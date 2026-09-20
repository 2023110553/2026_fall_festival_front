import styled from 'styled-components'

export {
  Page,
  TotalCount,
  TitleRow,
  Title,
  BottomBar,
  PrimaryButton,
} from '../NoticeManage/AdminNoticePage.styles'

export const ItemList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const DateTag = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 35px;
  padding: 4px 6px;
  border-radius: 4px;
  background: #9F9C99;
  color: #FFF;
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
  font-family: var(--font-pretendard);
`

export const ItemCard = styled.li`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #FDFDFD;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`

export const CardContent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
`

export const KeywordList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const Keyword = styled.span`
  padding: 2px 8px;
  border: 1px solid #E6E6E6;
  border-radius: 99px;
  background: #FDFDFD;
  color: #000;
  font-size: 10px;
  white-space: nowrap; 
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
  font-family: var(--font-pretendard);
`

export const Thumbnail = styled.div`
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  overflow: hidden;
  border-radius: 4px;
  background: #0F0B0B;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`
