import styled from 'styled-components'

export const CardContainer = styled.div`
    position: relative;
    width: 100%;
    padding: 14px 16px 12px 16px;
    border-radius: 16px;
    background-color: #ffffff;
    /* 💡 카드 테두리 및 부드러운 음영 추가 */
    border: 1px solid #f2f2f2;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);

    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    text-align: left;
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
`

export const Nickname = styled.span`
    font-size: 14px;
    font-weight: 700;
    color: #111111;
    line-height: 1.2;
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
    margin: 0;
    font-size: 13px;
    font-weight: 400;
    color: #222222;
    line-height: 1.45;
    word-break: break-all;
    white-space: pre-wrap;
`

export const Time = styled.span`
    margin-top: 8px;
    font-size: 11px;
    font-weight: 400;
    color: #aaaaaa;
`

/* 더보기 팝오버 메뉴 */
export const DropdownMenu = styled.div`
    position: absolute;
    top: 32px;
    right: 12px;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.12);
    border: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    z-index: 20;
    min-width: 90px;
    overflow: hidden;
`

export const DropdownItem = styled.button`
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    padding: 9px 12px;
    border: none;
    background: none;
    font-size: 12px;
    font-weight: 500;
    color:'#333333';
    cursor: pointer;
    text-align: left;

    &:not(:last-child) {
        border-bottom: 1px solid #f5f5f5;
    }

    &:hover {
        background-color: #f9f9f9;
    }
`