import styled from 'styled-components'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  justify-content: space-between;
  padding: 12px 0;
`

export const SortSelect = styled.select`
  display: flex;
  padding: 4px 8px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 5px;
  background: #F0F0F0;
  color: #000;
  font-size: 14px;
  border: none;
`

export const TotalCount = styled.p`
  color: #000;
  text-align: right;
  font-size: 12px;
`

export const LanternList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const LanternCard = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px 12px 20px;
  border-radius: 12px;
  border: 1px solid #E0E0E0;
  background: #F7F7F7;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
`

export const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

export const Nickname = styled.p`
  margin: 0;
  color: #000;
  font-size: 14px;
  font-weight: 600;
`

export const ReportBadge = styled.span`

  padding: 2px 10px;
  border-radius: 99px;
  background: #F2D6D6;
  color: #D62525;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
`

export const Message = styled.p`
  margin: 0;
  color: #000;
  font-size: 12px;
  word-break: keep-all;
`

export const BoothName = styled.p`
  margin: 0;
  color: #8A8A8A;
  font-size: 10px;
`

export const CardSide = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  flex-shrink: 0;
`

export const ReportCount = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  color: #000;
  font-size: 8px;
`

export const SirenIcon = styled.img`
  width: 12px;
  height: 12px;
`

export const DeleteButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border-radius: 50%;
  border: 1px solid #C62828;
  background: #F2B8B8;
  cursor: pointer;

  img {
    width: 10px;
    height: 10px;
  }
`