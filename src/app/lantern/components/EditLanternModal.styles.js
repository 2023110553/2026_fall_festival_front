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
    gap: 10px;
    width: 305px;
    padding: 16px;
    border-radius: 20px;
    background-color: #ffffff;
    box-sizing: border-box;
    text-align: left;
    box-shadow:
        0 3px 6px 0 rgba(255, 161, 161, 0.25),
        0 -4px 6px 0 rgba(194, 255, 175, 0.25),
        0 0 6px 0 rgba(243, 246, 188, 0.75);
`

export const BoothLabel = styled.span`
    align-self: flex-end;
    font-size: 11px;
    font-weight: 500;
    color: #999999;
`

export const InputBox = styled.div`
    position: relative;
    width: 100%;
    background-color: #ffffff;
    border-radius: 14px;
    border: 1px solid #e0e0e0;
    padding: 10px 14px 20px 14px;
    box-sizing: border-box;
`

export const NicknameInput = styled.input`
    width: 100%;
    border: none;
    outline: none;
    font-size: 13px;
    font-family: inherit;
    color: #222222;
    background: transparent;

    &::placeholder {
        color: #aaaaaa;
    }
`

export const MessageTextArea = styled.textarea`
    width: 100%;
    height: 44px;
    border: none;
    outline: none;
    resize: none;
    font-size: 12px;
    font-family: inherit;
    color: #222222;
    line-height: 1.45;
    background: transparent;

    &::placeholder {
        color: #aaaaaa;
    }
`

export const CharCount = styled.span`
    position: absolute;
    bottom: 8px;
    right: 12px;
    font-size: 10px;
    color: #aaaaaa;
`

export const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 4px;
    padding: 0 2px;
`

export const Time = styled.span`
    font-size: 11px;
    color: #999999;
    font-weight: 400;
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`

export const CancelButton = styled.button`
    padding: 8px 18px;
    border: none;
    border-radius: 10px;
    background-color: #f0f0f0;
    font-size: 12px;
    font-weight: 600;
    color: #444444;
    cursor: pointer;

    &:hover {
        background-color: #e5e5e5;
    }
`

export const SubmitButton = styled.button`
    padding: 8px 18px;
    border: none;
    border-radius: 10px;
    background-color: #111111;
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;

    &:hover {
        background-color: #333333;
    }
`
