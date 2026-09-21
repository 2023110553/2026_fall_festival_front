import styled from 'styled-components'

export const modalStyle = {
    boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.15)',
}

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    margin: 4px 0 -8px 0;
`

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    margin-bottom: 12px;
`

export const Title = styled.h2`
    font-family: Pretendard;
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #100B0B;
    word-break: keep-all;
`

export const SubTitle = styled.p`
    font-family: Pretendard;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: #100B0B;
    word-break: keep-all;
`

export const ButtonRow = styled.div`
    display: flex;
    width: 100%;
    gap: 8px;
`

export const CloseBtn = styled.button`
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 8px;
    background: #EEE;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
    color: #696666;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
        background: #e0e0e0;
    }

    &:disabled {
        opacity: 0.6;
        cursor: wait;
    }
`

export const ConfirmBtn = styled.button`
    flex: 1;
    padding: 10px 0;
    border: none;
    border-radius: 8px;
    background: #737373;
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 500;
    color: #FDFDFD;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
        background: #333333;
    }

    &:disabled {
        opacity: 0.6;
        cursor: wait;
    }
`