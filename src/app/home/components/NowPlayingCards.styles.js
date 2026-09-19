import styled from 'styled-components'

export const Wrapper = styled.section`
    display: flex;
    flex-direction: column;
    gap: 12px;
`

export const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const TitleGroup = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

/* 섹션 제목 앞 글로우 점 — blur가 10px 박스 밖으로 번지면서 빛나는 느낌을 낸다 */
export const Marker = styled.span`
    width: 10px;
    height: 10px;
    flex: 0 0 10px;
    aspect-ratio: 1 / 1;

    border-radius: 99px;

    /* aurora_orange */
    background: #dc7054;

    opacity: 0.7;
    filter: blur(2.5px);
`

/* semi20 */
export const Title = styled.h2`
    margin: 0;

    color: #000;

    font-size: 20px;
    font-weight: 600;
    line-height: normal;
`

export const MoreLink = styled.button`
    display: inline-flex;
    align-items: center;
    gap: 2px;

    padding: 0;

    border: 0;
    background: transparent;

    color: #9f9c99;

    font-size: 12px;
    font-weight: 400;
    text-align: center;

    cursor: pointer;
`

export const ArrowBox = styled.span`
    width: 16px;
    height: 16px;
    flex: 0 0 16px;

    display: flex;
    align-items: center;
    justify-content: center;
`

export const Scroller = styled.ul`
    display: flex;

    margin: 0 -16px;
    padding: 0 16px;

    overflow-x: auto;

    list-style: none;

    scroll-snap-type: x mandatory;
    scroll-padding-left: 16px;

    -webkit-overflow-scrolling: touch;

    &::-webkit-scrollbar {
    display: none;
    }
`

export const Card = styled.li`
    position: relative;

    width: 274px;
    height: 181px;
    flex: 0 0 274px;

    overflow: hidden;

    border-radius: 12px;

    scroll-snap-align: start;
`

export const CardButton = styled.button`
    position: relative;

    display: block;

    width: 100%;
    height: 100%;

    padding: 0;

    overflow: hidden;

    border: 0;
    border-radius: inherit;

    background: transparent;

    text-align: left;

    cursor: pointer;
`

export const Thumbnail = styled.img`
    position: absolute;
    inset: 0;

    display: block;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;
`

export const BottomGradient = styled.div`
    position: absolute;

    left: 10px;
    right: 9px;
    bottom: 0;

    height: 63px;

    border-radius: 0 0 12px 12px;

    background: rgba(
    159,
    156,
    153,
    0.7
    );

    backdrop-filter: blur(3px);
    -webkit-backdrop-filter: blur(2px);
`

export const CardInfo = styled.div`
    position: absolute;

    left: 24px;
    right: 24px;
    bottom: 16px;

    display: flex;
    flex-direction: column;
    gap: 14px;
`

export const InfoRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const CardName = styled.span`
    min-width: 0;

    overflow: hidden;

    color: #fdfdfd;

    font-size: 16px;
    font-weight: 600;

    text-overflow: ellipsis;
    white-space: nowrap;
`

export const CardTime = styled.span`
    flex-shrink: 0;

    color: #fdfdfd;

    font-size: 12px;
    font-weight: 400;
`

export const ProgressTrack = styled.span`
    display: block;

    width: 100%;
    height: 3px;

    overflow: hidden;

    border-radius: 99px;

    background: rgba(
    255,
    255,
    255,
    0.8
    );
`

export const ProgressFill = styled.span`
    display: block;

    width: ${({ $value }) =>
    `${Math.min(
        Math.max($value, 0),
        1
    ) * 100}%`};

    height: 100%;

    border-radius: inherit;

    background: #ef6c4d;
`