import styled from 'styled-components'

export const TopWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 5px;
`
export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    
    text-align: left;
    width: 100%;
`

export const ModalTitle = styled.h2`
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 600;
    margin: 0;
    color: #100B0B;
`

export const ModalSubtitle = styled.p`
    font-family: Pretendard;
    font-size: 12px;
    margin: 10px 0 15px 0;
    color: #100B0B;
    font-weight: 400;
`

export const Form = styled.form`
    text-align: left;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
`

export const FieldWrapper = styled.div``

export const FieldsGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 17px;
`

export const Label = styled.label`
    font-family: Pretendard;
    font-size: 14px;
    font-weight: 600;
    display: block;
    margin-bottom: 3px;
    color: #100B0B;
`

export const OptionalText = styled.span`
    font-weight: normal;
    color: #9F9C99;
    font-size: 8px;
    font-weight: 500;

`

export const InputWrapper = styled.div`
    position: relative;
`

export const CharCount = styled.span`
    position: absolute;
    font-family: Pretendard;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: #9F9C99;
    font-weight: 400;
    pointer-events: none;
`

export const SelectWrapper = styled.div`
    position: relative;
`

export const SelectTrigger = styled.button`
    width: 100%;
    height: 45px;
    padding: 10px 10px;
    border-radius: 8px;
    border: 1px solid #D8D8D8;
    font-size: 13px;
    font-family: Pretendard;
    outline: none;
    box-sizing: border-box;
    background-color: #FDFDFD;
    color: ${({ $hasValue }) => ($hasValue ? '#111111' : '#aaaaaa')};
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    font-family: Pretendard;
    cursor: pointer;
`

export const Chevron = styled.svg`
    flex-shrink: 0;
    transition: transform 0.15s;
    transform: rotate(${({ $isOpen }) => ($isOpen ? '180deg' : '0deg')});
`

export const DropdownList = styled.ul`
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    right: 0;
    margin: 0;
    padding: 4px 0;
    list-style: none;
    background-color: #FDFDFD;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    z-index: 20;
    max-height: 200px;
    overflow-y: auto;
`

export const DropdownItem = styled.li`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    font-family: Pretendard;
    font-size: 12px;
    color: #111111;
    cursor: pointer;

    &:hover {
        background-color: #f7f7f7;
    }
`

export const Dot = styled.span`
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    background: radial-gradient(
        circle closest-side,
        ${({ $color }) => $color}b3 0%,
        ${({ $color }) => $color}66 35%,
        ${({ $color }) => $color}22 65%,
        ${({ $color }) => $color}00 100%
    );
`

export const Input = styled.input`
    width: 100%;
    height: 45px;
    padding: 10px 10px;
    font-family: Pretendard;
    border-radius: 8px;
    border: 1px solid #D8D8D8;
    font-size: 13px;
    outline: none;
    box-sizing: border-box;

    &::placeholder {
        font-family: Pretendard;
        font-size: 13px;
        color: #aaaaaa;
    }
`

export const Textarea = styled.textarea`
    width: 100%;
    height: 62px;
    font-family: Pretendard;
    padding: 10px 10px;
    border-radius: 8px;
    border: 1px solid #D8D8D8;
    font-size: 13px;
    outline: none;
    resize: none;
    box-sizing: border-box;

    &::placeholder {
        font-family: Pretendard;
        font-size: 13px;
        color: #aaaaaa;
    }
`

export const ErrorText = styled.p`
    font-size: 8px;
    font-family: Pretendard;
    font-weight: 400;
    color: #E53935;
    margin: 1px 0 4px 0;
`

export const NoticeWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 3px;
    margin-top: 4px;
    width: 100%;
    text-align: left;
`

export const InfoIcon = styled.svg`
    flex-shrink: 0;
    margin-top: 1px;
`

export const NoticeText = styled.p`
    font-family: Pretendard;
    font-size: 8px;
    color: #9f9c99;
    font-weight: 400;
    line-height: normal;
    margin: 0;
`

export const ButtonRow = styled.div`
    display: flex;
    gap: 8px;
    margin-top: 8px;
`

export const CloseButton = styled.button`
    flex: 1;
    height: 44px;
    padding: 10px ;
    background-color: #EEE;
    border: none;
    border-radius: 8px;
    font-weight: 500;
    font-size: 14px;
    color: #737373;
    cursor: pointer;
`

export const SubmitButton = styled.button`
    flex: 1;
    height: 44px;
    padding: 10px;
    background-color: #272727;
    border: none;
    border-radius: 8px;
    font-family: Pretendard;

    font-weight: 500;
    font-size: 14px;
    color: #FDFDFD;
    cursor: pointer;
    transition: background-color 0.2s;
`
