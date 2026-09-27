import styled from 'styled-components'

// Canvas 안에서 drei <Html fullscreen>이 만든 div 안에 들어가는 내용(SceneLoading.jsx).
// 캔버스를 덮는 크기라 pointer-events를 꺼야 로딩 중에도 지도를 돌리거나 다른 UI를 누를 수 있다.
export const Overlay = styled.div`
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    pointer-events: none;
`

export const Label = styled.span`
    padding: 8px 16px;
    border-radius: ${({ theme }) => theme.radius.lg};
    background: rgba(17, 18, 20, 0.55);
    color: #ffffff;
    font-size: 13px;
    font-weight: 500;
`
