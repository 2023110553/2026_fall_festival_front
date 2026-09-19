import styled from 'styled-components'
import Button from '../../components/common/Button'

export const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 100%;
    padding: 8px 4px 4px 4px;
`
export const CloseButton = styled.button`
    position: absolute;
    top: -4px;
    right: 0px;
    background: none;
    border: none;
    font-size: 16px;
    color: #666666;
    cursor: pointer;
    padding: 4px;
    line-height: 1;
`

export const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
`

export const Title = styled.h2`
    margin: 0;
    font-size: 18px;
    font-weight: 700;
    color: #111111;
`

export const SubTitle = styled.p`
    margin: 0;
    font-size: 13px;
    font-weight: 500;
    color: #333333;
`

export const KakaoButton = styled(Button)`
    display: flex;
    width: 100%;
    padding: 12px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 12px;
    background: #fee500;
    border: none;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #000000;

    &:hover {
        background: #fada0a;
    }
`

export const KakaoIcon = styled.svg`
    flex-shrink: 0;
`