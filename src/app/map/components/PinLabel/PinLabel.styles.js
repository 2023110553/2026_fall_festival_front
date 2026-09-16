import styled from 'styled-components'

export const PinLabelWrapper = styled.button`
    position: relative;
    display: block;
    width: 40px;
    height: 54px;
    padding: 0;
    border: none; 
    background: transparent;
    cursor: pointer;
    
    > svg {
        display: block;
        width: 100%;
        height: 100%;
    }
    `;

export const PinContent = styled.div`
    position: absolute;
    top: 9px;
    left: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;

    > svg {
        display: block;
    }
`;

export const LanternCount = styled.span`
    color: #DC7054;
    text-align: center;
    font-size: 11.508px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
`;