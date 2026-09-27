import styled from 'styled-components'

// 지도 3D 씬이 실패했을 때 "지도 자리만" 덮는 화면(MapSceneBoundary.jsx).
// MapArea가 position: relative라서 inset: 0으로 그 안을 정확히 채운다 —
// MapShell에서 형제로 뒤에 오는 PlaceSelector·LanternGuide는 이 위에 그대로 남아 계속 누를 수 있다.
export const Fallback = styled.div`
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 24px 32px;
    text-align: center;
    background: ${({ theme }) => theme.color.surface};
`

export const Title = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.color.text};
`

// 문구에 줄바꿈(\n)이 들어 있어서 pre-line이 필요하다 — 없으면 한 줄로 눌린다.
export const Description = styled.p`
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${({ theme }) => theme.color.textSub};
    white-space: pre-line;
`

export const RetryButton = styled.button`
    margin-top: 10px;
    padding: 10px 24px;
    border: 0;
    border-radius: ${({ theme }) => theme.radius.sm};
    background: ${({ theme }) => theme.color.primary};
    color: #ffffff;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
`
