import styled from 'styled-components'

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 16px 110px;
`

export const TotalCount = styled.p`
  margin: 0;
  padding: 16px 0 8px;
  color: #000;
  text-align: right;
  font-size: 12px;
`

export const NoticeList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0;
  margin: 0;
  list-style: none;
`

export const NoticeCard = styled.li`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 12px 12px 12px;
  border-radius: 12px;
  background: #FDFDFD;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  cursor: pointer;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

export const TypeTag = styled.span`
  flex-shrink: 0;
  padding: 3px 7px;
  border-radius: 4px;
  background: ${({ $urgent }) => ($urgent ? '#D2735A' : '#6E6E6E')};
  color: #FFF;
  font-size: 10px;
  font-weight: 400;
  white-space: nowrap;
  font-family: var(--font-pretendard);
`

export const Title = styled.p`
  margin: 0;
  min-width: 0;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--font-pretendard);
`

export const Preview = styled.p`
  margin: 0;
  color: #8A8A8A;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 400;
  text-overflow: ellipsis;
  font-family: var(--font-pretendard);
`

export const BottomBar = styled.div`
  position: fixed;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  gap: 4px;
  width: min(343px, calc(100% - 32px));
`

export const PrimaryButton = styled.button`
  flex: 1;
  height: 60px;
  border: none;
  border-radius: 99px;
  background: #000;
  color: #FFF;
  font-size: 17px;
  font-weight: 500;
  cursor: pointer;
  font-family: var(--font-pretendard);

  /* 저장 요청 중 중복 클릭 방지 상태 */
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
