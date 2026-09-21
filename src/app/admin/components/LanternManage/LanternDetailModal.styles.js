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
  display: flex;
  height: 14px;
  padding: 2px 5px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 999px;
  background: #FFB2B2;
  color: #AD0000;
  font-family: var(--font-pretendard);
  font-size: 8px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
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
  background: #9E9C99;
  color: #FFF;
  font-size: 14px;
  text-align: center;
  word-break: keep-all;
  font-family: var(--font-pretendard);
  font-weight: 500;
`

export const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #AD0000;
  font-size: 11px;
  text-align: center;
  font-family: var(--font-pretendard);
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
  font-family: var(--font-pretendard);
  cursor: pointer;

  /* 삭제 요청 중 중복 클릭 방지 상태 */
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const CloseButton = styled(BaseButton)`
  background: #EEE;
  color: #100B0B;
  opacity: 0.6;
`

export const DeleteButton = styled(BaseButton)`
  background: #FFB2B2;
  color: #AD0000;
`
