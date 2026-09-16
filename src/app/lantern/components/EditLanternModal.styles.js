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
    width: 305px;
    padding: 16px;
    border-radius: 20px;
    background-color: #dcdcdc;
    box-sizing: border-box;
    text-align: left;
    box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.15);
`

export const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 0 2px;
`

export const Nickname = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: #111111;
`

export const MoreButton = styled.button`
    border: none;
    background: none;
    cursor: pointer;
    padding: 0 2px;
    font-size: 16px;
    color: #777777;
    line-height: 1;
`

export const InputWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 52px;
    background-color: #ffffff;
    border-radius: 14px;
    padding: 12px 14px 28px 14px;
    box-sizing: border-box;
    border: 1px solid #c8c8c8;
`

export const TextArea = styled.textarea`
    width: 100%;
    height: 64px;
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
    font-size: 11px;
    color: #aaaaaa;
`

export const Footer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding: 0 2px;
`

export const Time = styled.span`
    font-size: 11px;
    color: #888888;
    font-weight: 400;
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: 8px;
`

export const CancelButton = styled.button`
    padding: 7px 16px;
    border: none;
    border-radius: 8px;
    background-color: #ffffff;
    font-size: 12px;
    font-weight: 600;
    color: #444444;
    cursor: pointer;

    &:hover {
        background-color: #f0f0f0;
    }
`

export const SubmitButton = styled.button`
    padding: 7px 16px;
    border: none;
    border-radius: 8px;
    background-color: #111111;
    font-size: 12px;
    font-weight: 600;
    color: #ffffff;
    cursor: pointer;

    &:hover {
        background-color: #333333;
    }
`