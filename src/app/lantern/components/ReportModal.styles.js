import styled from 'styled-components'

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 4px;
`

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    margin-bottom: 20px;
`

export const Title = styled.h2`
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #111111;
`

export const SubTitle = styled.p`
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: #555555;
`

export const OptionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 24px;
`

export const OptionItem = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    color: #111111;
`

export const RadioInput = styled.input`
    appearance: none;
    width: 18px;
    height: 18px;
    border: 1.5px solid #ccc;
    border-radius: 50%;
    outline: none;
    cursor: pointer;
    margin: 0;
    display: grid;
    place-content: center;

    &:checked {
    border-color: #666;
    &::before {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #666;
        }
    }
`

export const ButtonGroup = styled.div`
    display: flex;
    gap: 10px;
    width: 100%;
`

export const CancelButton = styled.button`
    flex: 1;
    padding: 13px 0;
    border: none;
    border-radius: 12px;
    background: #f2f2f2;
    font-size: 15px;
    font-weight: 600;
    color: #666666;
    cursor: pointer;

    &:hover {
        background: #e5e5e5;
    }
`

export const SubmitButton = styled.button`
    flex: 1;
    padding: 13px 0;
    border: none;
    border-radius: 12px;
    background: ${({ $disabled }) => ($disabled ? '#999999' : '#666666')};
    font-size: 15px;
    font-weight: 600;
    color: #ffffff;
    cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
    transition: background 0.2s ease;

    &:hover {
        background: ${({ $disabled }) => ($disabled ? '#999999' : '#555555')};
    }
`