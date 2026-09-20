import styled from 'styled-components'

export const HeaderRow = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
    align-self: stretch;
    margin: 0 8px 14px 8px;
`

export const Header = styled.div`
    text-align: left;
    width: 100%;
`

export const Title = styled.h2`
    margin: 0;
    color: var(--aurora_black, #100B0B);
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 600;
`

export const SubTitle = styled.p`
    margin: 6px 0 0 0;
    color: var(--aurora_black, #100B0B);
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 400;
`

export const DayPicker = styled.div`
    position: relative;
    flex-shrink: 0;
`

export const DayBadge = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 3px;
    padding: 6px 7px 6px 8px;
    border: none;
    border-radius: 20px;
    background-color: #dc7054;
    color: var(--aurora_white, #FDFDFD);
    font-family: Pretendard;
    font-size: 10px;
    font-weight: 500;
    cursor: pointer;
`

export const DayBadgeChevron = styled.svg`
    flex-shrink: 0;
`

export const DayDropdown = styled.div`
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    width: 76px;
    padding: 4px;
    gap: 4px;
    border-radius: 8px;
    background-color: #FDFDFD;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.15);
`

export const DayOption = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 4px;
    padding: 4px 6px;
    border: none;
    border-radius: 4px;
    background-color: ${({ $active }) => ($active ? 'rgba(220, 112, 84, 0.20)' : 'transparent')};
    cursor: pointer;
    text-align: left;

    &:hover {
        background-color: ${({ $active }) => ($active ? 'rgba(220, 112, 84, 0.12)' : '#f4f4f4')};
    }
`

export const DayOptionLabel = styled.span`
    display: flex;
    flex-direction: column;
    font-size: 10px;
    font-weight: 500;
    color: ${({ $active }) => ($active ? '#DC7054' : '#272727')};
`

export const DayOptionDate = styled.span`
    font-family: Pretendard;
    font-size: 6px;
    font-weight: 500;
    color: #9F9C99;
`

export const DayOptionCheck = styled.svg`
    flex-shrink: 0;

    path {
        stroke: ${({ $active }) => ($active ? '#dc7054' : '#272727')};
    }
`
export const EmptyState = styled.p`
    margin: 0;
    padding: 45px 15px;
    color: var(--aurora_gray, #9F9C99);
    text-align: center;
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 400;
`
export const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`


/* 삭제된 등불 카드 스타일 */
export const DeletedCard = styled.div`
    background-color: ${({ $isAdmin }) => ($isAdmin ? 'rgba(134, 85, 72, 0.50)' : '#D8D8D8')};
    border-radius: 9px;
    padding: 12px 18px 8px 20px;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
`

export const DeletedNickname = styled.div`
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 400;
    color: ${({ $isAdmin }) => ($isAdmin ? '#D8D8D8' : '#9F9C99')};
`

export const DeletedBoothName = styled.div`
    font-family: Pretendard;
    font-size: 10px;
    font-weight: 400;
    color: ${({ $isAdmin }) => ($isAdmin ? 'rgba(216, 216, 216, 0.80)' : 'rgba(159, 156, 153, 0.60)')};
`

export const DeletedMessage = styled.div`
    font-size: 14px;
    font-family: Pretendard;
    font-weight: 500;
    color: ${({ $isAdmin }) => ($isAdmin ? '#D8D8D8' : '#9F9C99')};
    margin-top: 4px;
`

export const DeletedTime = styled.div`
    font-size: 10px;
    font-family: Pretendard;
    font-weight: 400;
    color: ${({ $isAdmin }) => ($isAdmin ? '#D8D8D8' : '#9F9C99')};
    margin-top: 8px;
`

export const FooterNotice = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 6px;
    width: 100%;
    text-align: left;
    margin-top: 10px;
`

export const InfoIcon = styled.svg`
    flex-shrink: 0;
    margin-top: 1px;
`

export const NoticeText = styled.p`
    margin: 0;
    color: var(--aurora_gray, #9F9C99);
    font-family: Pretendard;
    font-size: 8px;
    font-weight: 400;
`

export const CloseBtn = styled.button`
    width: 100%;
    margin-top: 16px;
    padding: 10px;
    background-color: #D8D8D8;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #605D5D;
    cursor: pointer;

    &:hover {
        background-color: #d8d8d8;
    }
`