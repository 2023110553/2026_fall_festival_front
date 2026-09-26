import styled from 'styled-components'

export const Sheet = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;

    width: 100%;
    --sheet-top-gap: 40px;
    --middle-height: 62dvh;
    --collapsed-height: min(calc(100dvh - var(--sheet-top-gap)), max(26dvh, calc(${({ theme }) => theme.nav.height} + 142px + env(safe-area-inset-bottom))));
    height: ${({ $snapPosition }) => $snapPosition === 'high' ? 'calc(100dvh - var(--sheet-top-gap))' : $snapPosition === 'low' ? 'var(--collapsed-height)' : 'var(--middle-height)'};
    min-height: var(--collapsed-height);
    max-height: calc(100dvh - var(--sheet-top-gap));
    transition: ${({ $isDragging }) => $isDragging ? 'none' : 'height 240ms ease, border-radius 240ms ease'};
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    border-radius: 28px 28px 0 0;
    background: rgba(244, 244, 244, 0.57);
    backdrop-filter: blur(12px);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
    z-index: ${({ theme }) => theme.zIndex.bottomNav - 1};

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`

export const DragHandle = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    flex-shrink: 0;
    touch-action: none;
    user-select: none;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`

export const HandleBar = styled.div`
    width: 48px;
    height: 4px;
    border-radius: 999px;
    background: ${({ $isNight }) => $isNight ? '#272727' : '#9F9C99'};
`

export const Content = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 0 20px calc(${({ theme }) => theme.nav.height} + 39px + env(safe-area-inset-bottom));
`
