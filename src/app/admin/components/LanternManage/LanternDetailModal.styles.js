import styled from 'styled-components'

export const panelStyle = {
  width: 'min(310px, 88vw)',
  background: '#FFF',
  borderRadius: '18px',
  padding: '28px 20px 16px',
  textAlign: 'left',
}

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const Nickname = styled.h2`
  margin: 0;
  color: #000;
  font-size: 22px;
  font-weight: 600;
`

export const ReportBadge = styled.span`
  padding: 2px 6px;
  border-radius: 99px;
  background: #F2B8B8;
  color: #B71C1C;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
`

export const ReportCount = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #000;
  font-size: 12px;
  flex-shrink: 0;
`

export const SirenIcon = styled.img`
  width: 18px;
  height: 18px;
`

export const BoothName = styled.p`
  margin: 8px 0 0;
  color: #000;
  font-size: 11px;
`

export const MessageBox = styled.p`
  margin: 10px 0 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #9E9D99;
  color: #FFF;
  font-size: 13px;
  text-align: center;
  word-break: keep-all;
`

export const ButtonRow = styled.div`
  display: flex;
  gap: 9px;
  margin-top: 12px;
`

const BaseButton = styled.button`
  flex: 1;
  height: 36px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
`

export const CloseButton = styled(BaseButton)`
  background: #EFEFEF;
  color: #7A7A7A;
`

export const DeleteButton = styled(BaseButton)`
  background: #EDB5B5;
  color: #B71C1C;
`
