import styled from 'styled-components'

export const Wrapper = styled.div`
    position: absolute;
    top: 9px;
    left: 13px;
    width: 96px;
    z-index: 1;
`

export const Menu = styled.div`
    position: absolute;
    top: calc(100% + 13px);
    left: 0;
    width: 100%;
    padding: 8px 0;
    border-radius: 16px;
    background: rgba(244, 244, 244, 0.8);
    backdrop-filter: blur(12px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`

export const PlaceButton = styled.button`
    display: block;
    width: 100%;
    min-height: 36px;
    padding: 8px;
    border: 0;
    background: transparent;
    color: #272727;
    font-family: inherit;
    font-size: 14px;

    &:disabled {
        opacity: 0.45;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.5);
    }

    &:focus-visible {
        outline: 2px solid #DC7054;
        outline-offset: -2px;
    }
`

export const Toggle = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    width: 100%;
    min-height: 40px;
    padding: 10px 30px 10px 12px;
    overflow-wrap: anywhere;
    border: 0;
    border-radius: 12px;
    background: rgba(244, 244, 244, 0.9);
    backdrop-filter: blur(12px);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    color: #272727;
    font-family: inherit;
    font-size: 14px;
    font-weight: 600;

    > svg {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        width: 14px;
        height: 14px;
        pointer-events: none;
    }

    &:focus-visible {
        outline: 2px solid #DC7054;
        outline-offset: 2px;
    }
`
