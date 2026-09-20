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

    border-radius: 99px;

    opacity: 1;

    background: var(
    --aurora_orange,
    #dc7054
    );

    filter: blur(2px);
`

export const Title = styled.h2`
    margin: 0;

    color: #000;

    font-size: 20px;
    font-weight: 600;
`

export const MoreLink = styled.button`
    display: flex;
    align-items: center;

    padding: 0;

    border: 0;
    gap: 4px;
    background: transparent;

    color: #000;

    font-size: 12px;
    font-weight: 400;
    text-align: center;

    cursor: pointer;
`

export const Scroller = styled.ul`
    display: flex;
    gap: 16px;

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

    box-shadow:
        0 3px 6px 0 rgba(255, 161, 161, 0.25),
        0 -4px 6px 0 rgba(194, 255, 175, 0.25),
        0 0 6px 0 rgba(243, 246, 188, 0.75);

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

    transform: scale(1.1);
`

export const BottomGradient = styled.div`
    position: absolute;

    left: 0;
    right: 0;
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

    left: 18px;
    right: 18px;
    bottom: 16px;

    display: flex;
    flex-direction: column;
    gap: 10px;
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
    font-weight: var(--Font-weight-Semi-Bold, 600);

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

    width: 238px;
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

    background: #DC7054;
`