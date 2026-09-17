import styled from 'styled-components'

export const Header = styled.div`
    text-align: left;
    width: 100%;
    margin-bottom: 14px;
`

export const Title = styled.h2`
    font-size: 20px;
    font-weight: 800;
    margin: 0;
    color: #111111;
`

export const SubTitle = styled.p`
    font-size: 12px;
    color: #666666;
    margin: 3px 0 0 0;
    font-weight: 500;
`

export const ListWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`

/* 삭제된 등불 카드 스타일 */
export const DeletedCard = styled.div`
    background-color: ${({ $isAdmin }) => ($isAdmin ? '#593838' : '#828282')};
    border-radius: 16px;
    padding: 10px 14px;
    text-align: left;
    width: 100%;
    box-sizing: border-box;
`

export const DeletedNickname = styled.div`
    font-weight: bold;
    font-size: 13px;
    color: ${({ $isAdmin }) => ($isAdmin ? '#bdbdbd' : '#e0e0e0')};
`

export const DeletedMessage = styled.div`
    font-size: 11px;
    color: ${({ $isAdmin }) => ($isAdmin ? '#8e6e6e' : '#c4c4c4')};
    margin-top: 3px;
    line-height: 1.3;
`

export const DeletedTime = styled.div`
    font-size: 10px;
    color: ${({ $isAdmin }) => ($isAdmin ? '#735252' : '#b0b0b0')};
    margin-top: 5px;
`

export const FooterNotice = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 6px;
    width: 100%;
    text-align: left;
    margin-top: 10px;
`

export const InfoIcon = styled.span`
    font-size: 10px;
    color: #aaaaaa;
    border: 1px solid #aaaaaa;
    border-radius: 50%;
    width: 12px;
    height: 12px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 1px;
`

export const NoticeText = styled.p`
    font-size: 9.5px;
    color: #aaaaaa;
    line-height: 1.3;
    margin: 0;
`

export const CloseBtn = styled.button`
    width: 100%;
    margin-top: 12px;
    padding: 11px;
    background-color: #e5e5e5;
    border: none;
    border-radius: 14px;
    font-weight: bold;
    font-size: 13px;
    color: #333333;
    cursor: pointer;

    &:hover {
        background-color: #d8d8d8;
    }
`