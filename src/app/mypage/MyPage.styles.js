import styled from 'styled-components'

export const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const Title = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111111;
`

export const ButtonGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`

export const PrimaryButton = styled.button`
    padding: 12px;
    border-radius: 12px;
    background-color: #111111;
    color: #ffffff;
    font-weight: bold;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #333333;
    }
`

export const SecondaryButton = styled.button`
    padding: 12px;
    border-radius: 12px;
    background-color: #f59e0b;
    color: #ffffff;
    font-weight: bold;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #d97706;
    }
`

export const DefaultButton = styled.button`
    padding: 12px;
    border-radius: 12px;
    background-color: #eeeeee;
    color: #333333;
    font-weight: bold;
    border: none;
    cursor: pointer;

    &:hover {
        background-color: #e2e2e2;
    }
`

export const LogoutWrapper = styled.div`
    display: flex;
`

export const LogoutButton = styled.button`
    border: none;
    background: none;
    color: #888888;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: 14px;

    &:hover {
        color: #555555;
    }
`