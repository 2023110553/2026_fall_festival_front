import styled from "styled-components";

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
export const Thumbnail = styled.img`
    width: 66px;
    height: 66px;
    border-radius: 8px;
`
export const Info = styled.div`
    display: flex;
    flex-direction: column;
    
`
export const Title = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    letter-spacing: 0;
    padding-bottom: 5px;
`
export const Department = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 400;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0;
    color: #737373;
    padding-bottom: 15px;
;
`
export const Location = styled.span`
    font-family: var(--font-pretendard);
    font-weight: 600;
    font-size: 12px;
    line-height: 100%;
    letter-spacing: 0;
    color: #9F9C99;
`
export const LanternWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
    margin-left: auto;
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