import styled from 'styled-components'

export const PinLabelWrapper = styled.button`
    position: relative;
    display: block;
    width: 40px;
    height: 54px;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    transition: transform 0.12s ease;

    > svg {
        display: block;
        width: 100%;
        height: 100%;
    }

    /* 2026-09-18: 클릭 가능하다는 걸 눈으로도 알 수 있게 hover/active 피드백 추가 —
       기존엔 커서만 pointer였고 눌러도 아무 시각 변화가 없어서 "눌리는 느낌"이 없었음. */
    &:hover {
        transform: scale(1.08);
    }
    &:active {
        transform: scale(0.94);
    }
    &:focus-visible {
        outline: 2px solid #DC7054;
        outline-offset: 3px;
        border-radius: 8px;
    }
    `;

export const PinContent = styled.div`
    position: absolute;
    top: 9px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    > svg {
        display: block;
    }
`;

export const LanternCount = styled.span`
    color: ${({ $color }) => $color ?? '#DC7054'};
    text-align: center;
    font-size: 11.508px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;