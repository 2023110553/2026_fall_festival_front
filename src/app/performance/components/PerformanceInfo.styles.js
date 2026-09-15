import styled from 'styled-components'

const SUB_TEXT = '#747474'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

export const Name = styled.h2`
    margin: 0 0 6px;

    color: #000000;

    font-size: 20px;
    font-weight: 600;
`

export const Category = styled.p`
    margin: 0 0 14px;

    color: ${SUB_TEXT};

    font-size: 14px;
    font-weight: 400;
`

export const Time = styled.p`
    margin: 0;

    color: ${SUB_TEXT};

    font-size: 12px;
    font-weight: 400;
`