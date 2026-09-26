import styled from 'styled-components'

export const CardContainer = styled.div`
    position: relative;
    width: 100%;
    padding: 12px 18px 8px 20px;
    border-radius: 9px;
    background-color: #ffffff;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);


    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    text-align: left;
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 6px;
`

export const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 6px;
`

export const Nickname = styled.span`
color: var(--aurora_black, #100B0B);

font-family: Pretendard;
font-size: 12px;
font-weight: 400;
`

export const BoothName = styled.span`
    color: var(--aurora_gray, #9F9C99);
font-family: Pretendard;
font-size: 10px;
font-weight: 400;
`

export const MoreButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 0 2px;
    font-size: 16px;
    color: #888888;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #333333;
    }
`

export const Content = styled.p`
color: var(--aurora_black, #100B0B);
font-family: Pretendard;
font-size: 14px;
font-weight: 500;
margin: 0;
`

export const Time = styled.span`
color: var(--aurora_gray, #9F9C99);
font-family: Pretendard;
font-size: 10px;
font-weight: 400;
margin-top: 8px;
`

/* 더보기 팝오버 메뉴 */
export const DropdownMenu = styled.div`
    position: absolute;
    top: 32px;
    right: 12px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    z-index: 20;
    width: 80px;
    overflow: hidden;
`

export const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
    width: 100%;
    padding: 12px 8px;
    border: none;
    background: none;
    cursor: pointer;
    white-space: nowrap;

    color: var(--text_black, #272727);
    text-align: center;
    font-family: Pretendard;
    font-size: 10px;
    font-weight: 400;

    &:not(:last-child) {
        border-bottom: 1px solid #f0f0f0;
    }

    &:hover {
        background-color: #f9f9f9;
    }
`