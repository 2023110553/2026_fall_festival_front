import styled from 'styled-components'

export const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 320px;
    padding: 12px 20px;
    border-radius: 9px;
    background-color: #D8D8D8;
    box-sizing: border-box;
    text-align: left;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.15);
    `

export const BoothLabel = styled.span`
    align-self: flex-end;
    font-family: Pretendard;
    font-size: 10px;
    font-weight: 400;
    color: #9F9C99;
`

export const InputGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 6px 0;
`

export const InputBox = styled.div`
    position: relative;
    width: 100%;
    padding: 6px;
    background-color: #FDFDFD;
    border-radius: 6px;
    border: 0.5px solid #9F9C99;
    box-sizing: border-box;
`

// 메시지 입력창 컨테이너 — 패딩/보더 포함한 전체 높이를 52px로 고정
export const MessageBox = styled(InputBox)`
    height: 52px;
`

// 닉네임 입력창 컨테이너 — 패딩/보더 포함한 전체 높이를 30px로 고정
export const NicknameBox = styled(InputBox)`
    height: 30px;
`

export const NicknameInput = styled.input`
    width: 100%;
    height: 100%;

    border: none;
    outline: none;
    font-size: 12px;
    font-family: Pretentard;
    color: #100B0B;
    background: transparent;
    padding: 0;

    &::placeholder {
        color: #D8D8D8;
    }
`

export const MessageTextArea = styled.textarea`
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    font-size: 12px;
    font-family: Pretentard;
    color: #100B0B;
    line-height: 1.45;
    background: transparent;
    padding: 0;

    &::placeholder {
        color: #D8D8D8;
    }
`

export const CharCount = styled.span`
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 10px;
    color: #aaaaaa;
`

export const ErrorText = styled.p`
    font-size: 10px;
    font-family: Pretendard;
    font-weight: 400;
    color: #E53935;
    margin: 1px 0 4px 0;
`

export const Footer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`

export const Time = styled.span`
    font-family: Pretendard;
    font-size: 10px;
    color: #9F9C99;
    font-weight: 400;
`

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
`

export const CancelButton = styled.button`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
    width: 43px;
    height: 21px;
    padding: 10px 0;
    border: none;
    border-radius: 4px;
    font-family: Pretendard;

    background-color: #EEE;
    font-size: 10px;
    font-weight: 500;
    color: #696666;
    cursor: pointer;

    &:hover {
        background-color: #e5e5e5;
    }
`

export const SubmitButton = styled.button`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
    width: 43px;
height: 21px;
padding: 10px 0;
    border: none;
    border-radius: 4px;
    background-color: #100B0B;
    font-family: Pretendard;

    font-size: 10px;
    font-weight: 500;
    color: #FDFDFD;
    cursor: pointer;

    &:hover {
        background-color: #333333;
    }
`
