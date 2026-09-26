import styled from 'styled-components'

export const CardContainer = styled.div`
    position: relative;
    width: 100%;
    padding: ${({ $mapAppearance }) => $mapAppearance ? '12px 16px' : '12px 18px 8px 20px'};
    border-radius: ${({ $mapAppearance }) => $mapAppearance ? '9.14px' : '9px'};
    background: ${({ $mapAppearance }) => $mapAppearance ? 'var(--aurora_white, #FDFDFD)' : '#FFFFFF'};
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.10);


    display: ${({ $mapAppearance }) => $mapAppearance ? 'grid' : 'flex'};
    grid-template-columns: ${({ $mapAppearance }) => $mapAppearance ? 'minmax(0, 1fr) 16px' : 'none'};
    column-gap: ${({ $mapAppearance }) => $mapAppearance ? '10px' : '0'};
    flex-direction: column;
    box-sizing: border-box;
    text-align: left;
`

export const Header = styled.div`
    display: ${({ $mapAppearance }) => $mapAppearance ? 'contents' : 'flex'};
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ $mapAppearance }) => $mapAppearance ? '0' : '6px'};
`

export const TitleGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    grid-column: ${({ $mapAppearance }) => $mapAppearance ? '1' : 'auto'};
    grid-row: ${({ $mapAppearance }) => $mapAppearance ? '1' : 'auto'};
    min-width: 0;
    margin-bottom: ${({ $mapAppearance }) => $mapAppearance ? '0' : '6px'};
`

export const Nickname = styled.span`
color: ${({ $mapAppearance, $hasCustomNickname }) =>
  $mapAppearance && $hasCustomNickname ? '#DC7054' : 'var(--aurora_black, #100B0B)'};

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
    width: ${({ $mapAppearance }) => $mapAppearance ? '16px' : 'auto'};
    height: ${({ $mapAppearance }) => $mapAppearance ? '16px' : 'auto'};
    min-width: ${({ $mapAppearance }) => $mapAppearance ? '16px' : '0'};
    min-height: ${({ $mapAppearance }) => $mapAppearance ? '16px' : '0'};
    flex-shrink: 0;
    grid-column: ${({ $mapAppearance }) => $mapAppearance ? '2' : 'auto'};
    grid-row: ${({ $mapAppearance }) => $mapAppearance ? '1 / span 3' : 'auto'};
    align-self: start;
    padding: ${({ $mapAppearance }) => $mapAppearance ? '0' : '0 2px'};
    font-size: 16px;
    color: #888888;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
        display: block;
        width: 16px;
        height: 16px;
        flex: 0 0 16px;
    }

    &:hover {
        color: #333333;
    }
`

export const Content = styled.p`
overflow: ${({ $mapAppearance }) => $mapAppearance ? 'hidden' : 'visible'};
grid-column: ${({ $mapAppearance }) => $mapAppearance ? '1' : 'auto'};
grid-row: ${({ $mapAppearance }) => $mapAppearance ? '2' : 'auto'};
color: var(--aurora_black, #100B0B);
text-overflow: ${({ $mapAppearance }) => $mapAppearance ? 'ellipsis' : 'clip'};
font-family: Pretendard;
font-size: 14px;
font-style: normal;
font-weight: ${({ $mapAppearance }) => $mapAppearance ? '600' : '500'};
line-height: normal;
margin: ${({ $mapAppearance }) => $mapAppearance ? '4px 0 0' : '0'};
`

export const Time = styled.span`
grid-column: ${({ $mapAppearance }) => $mapAppearance ? '1' : 'auto'};
grid-row: ${({ $mapAppearance }) => $mapAppearance ? '3' : 'auto'};
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
