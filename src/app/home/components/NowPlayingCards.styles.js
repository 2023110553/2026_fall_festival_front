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
    gap: 9px;
`

export const Marker = styled.img`
    width: 10px;
    height: 10px;
`

export const Title = styled.h2`
    margin: 0;

    color: #ffffff;

    font-size: 20px;
    font-weight: 600;
`

export const MoreLink = styled.button`
    padding: 0;

    border: 0;
    background: transparent;

    color: #ffffff;

    font-size: 12px;
    font-weight: 400;

    cursor: pointer;
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

    background: rgba(159, 156, 153, 0.7);

    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
`

export const CardInfo = styled.div`
    position: absolute;

    left: 24px;
    right: 24px;
    bottom: 12px;

    display: flex;
    flex-direction: column;
    gap: 16px;
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
    font-weight: 300;
`

export const ProgressTrack = styled.span`
    display: block;

    width: 100%;
    height: 3px;

    overflow: hidden;

    border-radius: 99px;

    background: rgba(255, 255, 255, 0.8);
`

export const ProgressFill = styled.span`
    display: block;

    width: ${({ $value }) =>
    `${Math.min(Math.max($value, 0), 1) * 100}%`};

    height: 100%;

    border-radius: inherit;

    background: #ef6c4d;
`