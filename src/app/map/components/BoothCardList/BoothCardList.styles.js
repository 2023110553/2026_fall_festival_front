import styled from "styled-components";

export const StatusMessage = styled.p`
    padding: 24px 0;
    text-align: center;
    font-size: 13px;
    color: ${({ $isNight }) => $isNight ? '#272727' : '#9F9C99'};
`

export const BoothCardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;

`
export const Card = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: #FFFFFFB2;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    gap: 10px;

`
export const RestroomCard = styled(Card)`
    min-height: 90px;
`
export const Thumbnail = styled.img`
    width: 66px;
    height: 66px;
    flex-shrink: 0;
    object-fit: cover;
    border-radius: 8px;
`
export const RestroomThumbnail = styled.div`
    width: 66px;
    height: 66px;
    flex: 0 0 66px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    background: rgba(159, 156, 153, 0.16);
    color: #737373;
    font-family: var(--font-pretendard);
    font-size: 16px;
    font-weight: 600;
`
export const RestroomName = styled.span`
    min-width: 0;
    flex: 1;
    overflow-wrap: anywhere;
    color: #100B0B;
    font-family: var(--font-pretendard);
    font-size: 16px;
    font-weight: 600;
    line-height: 1.3;
`
export const RestroomBadges = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;
    flex-shrink: 0;
    margin-left: auto;
`
export const RestroomBadge = styled.span`
    width: 25px;
    height: 25px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: ${({ $gender }) => $gender === 'W' ? '#C5261D' : '#2D63C8'};
    color: #FFF;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
`
export const Info = styled.div`
    flex: 1;
    min-width: 0;
    min-height: 66px;
    overflow-wrap: anywhere;
    display: flex;
    flex-direction: column;
    
`
export const Title = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0;
    margin-bottom: 4px;
`
export const Department = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 400;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0;
    color: #737373;
    min-height: 12px;
    margin-bottom: 12px;
`
export const Location = styled.span`
    min-height: 12px;
    font-family: var(--font-pretendard);
    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0;
    color: #9F9C99;
`
export const LanternWrapper = styled.div`
    width: 34px;
    min-width: 34px;
    max-width: 34px;
    flex: 0 0 34px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-left: auto;
`
export const CollabBadge = styled.span`
    width: 34px;
    box-sizing: border-box;
    gap: 1px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 3px 0;
    border-radius: 4px;
    background: #DC7054;
    color: #FDFDFD;
    font-size: 10px;
    font-weight: 600;
    line-height: 1.2;
    white-space: nowrap;

    img {
        width: 12px;
        height: 12px;
        flex-shrink: 0;
        object-fit: contain;
    }
`

export const Directions = styled.span`
    color: #9F9C99;
    font-size: 12px;
    font-weight: 400;
    line-height: 1.4;
`
export const LanternImg = styled.img`
    width: 14px;
    height: 20px;
`
export const LanternCount = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 500;
    font-size: 12px;
    color: ${({ $hasMyLantern }) =>
        $hasMyLantern ? '#DC7054' : '#272727'};
    line-height: 100%;
    letter-spacing: 0;
    text-align: center;
`
