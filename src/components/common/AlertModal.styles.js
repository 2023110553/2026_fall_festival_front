import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 260px;
    margin: 0 auto;
    padding: 8px 4px 4px 4px;
`

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    text-align: center;
`

export const Title = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111111;
    word-break: keep-all;
`

export const SubTitle = styled.p`
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: #555555;
    word-break: keep-all;
`

export const CloseBtn = styled.button`
    width: 100%;
    padding: 12px 0;
    border: none;
    border-radius: 12px;
    background: #ededed;
    font-size: 14px;
    font-weight: 600;
    color: #666666;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
        background: #e0e0e0;
    }
`