import styled from 'styled-components'

const TEXT = '#100b0b'

export const Page = styled.main`
    width: 100%;
    max-width: 375px;
    min-height: 100vh;

    margin: 0 auto;

    display: flex;
    flex-direction: column;

    background: transparent;

    font-family: Pretendard, sans-serif;
`

export const DetailHeader = styled.header`
    position: relative;

    width: 100%;
    height: 60px;

    display: flex;
    align-items: center;
    justify-content: center;
`

export const BackButton = styled.button`
    position: absolute;
    left: 16px;

    width: 32px;
    height: 32px;

    display: flex;
    align-items: center;
    justify-content: center;

    padding: 0;

    border: 0;
    background: transparent;

    cursor: pointer;
`

export const BackIcon = styled.span`
    width: 10px;
    height: 10px;

    border-left: 1.5px solid ${TEXT};
    border-bottom: 1.5px solid ${TEXT};

    transform: rotate(45deg);
`

export const HeaderTitle = styled.h1`
    margin: 0;

    color: ${TEXT};

    font-size: 18px;
    font-weight: 600;
`

export const DetailPanel = styled.section`
    flex: 1;

    min-height: calc(100dvh - 60px);
    width: 343px;

    margin: 0 16px;
    padding: 28px 20px 16px 20px;

    box-sizing: border-box;

    border-radius: 12px;
    background: transparent;
    box-shadow: 0 0 10.82px rgba(0, 0, 0, 0.25);
`

export const Divider = styled.div`
    width: 100%;
    height: 1px;

    margin: 12px 0 20px;

    background: #fdfdfd;
`

export const SetlistSection = styled.section`
    width: 100%;
`

export const SectionTitle = styled.h3`
    margin: 0 0 8px;

    color: #737373;

    font-size: 12px;
    font-weight: 400;
`

export const EmptyText = styled.p`
    position: absolute;
    top: 50%;
    left: 50%;

    margin: 0;

    color: #555555;

    font-size: 14px;
    font-weight: 400;

    transform: translate(-50%, -50%);
`