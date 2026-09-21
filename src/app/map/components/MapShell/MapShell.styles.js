import styled from 'styled-components'

export const Shell = styled.div`
    position: fixed;
    top: calc(45px + env(safe-area-inset-top));
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
`

export const HeaderArea = styled.div`
    flex-shrink: 0;
`

export const MapArea = styled.div`
    position: relative;
    flex: 1;
    min-height: 0;
`

export const DateArea = styled.div`
    max-width: 375px;
    margin: 24px auto 0;
    padding: 0 16px 25px;
`
