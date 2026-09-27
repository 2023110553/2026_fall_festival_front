import styled from 'styled-components'

const getSheetHeight = ({ $isSearching, $snapPosition }) => {
    if ($isSearching) return 'calc(100svh - var(--sheet-top-gap))'
    if ($snapPosition === 'high') return 'calc(100dvh - var(--sheet-top-gap))'
    if ($snapPosition === 'detail') return 'var(--detail-height)'
    if ($snapPosition === 'low') return 'var(--low-height)'
    if ($snapPosition === 'middle') return 'var(--middle-height)'
    return 'var(--low-height)'
}

const getSheetMaxHeight = ({ $isSearching }) => $isSearching
    ? 'calc(100svh - var(--sheet-top-gap))'
    : 'calc(100dvh - var(--sheet-top-gap))'

export const Sheet = styled.div`
    position: fixed;
    top: ${({ $isSearching }) => $isSearching ? 'var(--sheet-top-gap)' : 'auto'};
    bottom: ${({ $isSearching }) => $isSearching ? 'auto' : '0'};
    left: 0;

    width: 100%;
    /* 화면 높이에 비례해 최상단 위치를 조절하되 지나치게 붙거나 내려가지 않게 제한한다.
       검색 중에는 키보드가 열려도 위치가 바뀌지 않도록 small viewport 높이를 기준으로 삼는다. */
    --sheet-top-gap: ${({ $isSearching }) => $isSearching
      ? 'clamp(32px, 5svh, 48px)'
      : 'clamp(32px, 5dvh, 48px)'};
    --middle-height: 62dvh;
    /* 하단 내비게이션(+ 버튼) 상단보다 80px 위에 low 시트 상단을 맞춘다. */
    --low-height: min(
      calc(100dvh - var(--sheet-top-gap)),
      calc(${({ theme }) => theme.nav.height} + 95px + env(safe-area-inset-bottom))
    );
    /* 하단 내비게이션(+ 버튼) 상단보다 200px 위에 상세 시트 상단을 맞춘다.
       내비게이션은 화면 하단에서 safe-area + 15px 떨어져 있고 높이가 88px이다. */
    --detail-height: min(
      calc(100dvh - var(--sheet-top-gap)),
      calc(${({ theme }) => theme.nav.height} + 215px + env(safe-area-inset-bottom))
    );
    height: ${getSheetHeight};
    min-height: var(--low-height);
    max-height: ${getSheetMaxHeight};
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
    height: 30px;
    flex-shrink: 0;
    touch-action: none;
    user-select: none;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
`

export const HandleBar = styled.div`
    width: 51.785px;
    height: 4.795px;
    flex-shrink: 0;
    box-sizing: border-box;
    border-radius: 19.179px;
    border: 0.959px solid ${({ $isNight }) => $isNight ? '#272727' : '#9F9C99'};
    background: ${({ $isNight }) => $isNight ? '#272727' : '#9F9C99'};
`

export const Content = styled.div`
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    padding: 0 20px;
    &::after {
        content: '';
        display: block;
        height: calc(${({ theme }) => theme.nav.height} + 39px + env(safe-area-inset-bottom));
    }
`
