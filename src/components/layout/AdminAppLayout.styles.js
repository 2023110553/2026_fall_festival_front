import styled from 'styled-components'

export const Page = styled.div`
    min-height: 100vh;
    background-color: #E0E0E0;
`

export const Container = styled.div`
    width: 100%;
    max-width: 375px;
    min-height: 100vh;
    margin: 0 auto;
`

export const Title = styled.h1`
    margin: 0;
    padding: 44px 0 20px 0;
    color: #000;
    text-align: center;
    font-size: 16px;
    font-weight: 500;
    font-family: 'Pretendard', sans-serif;

`

export const Header = styled.header`
    position: sticky;
    top: 0;
    z-index: 100;
    width: 343px;
    height: 40px;
    display: flex;
    align-items: center;
    background: #FDFDFD;
    border-radius: 99px;
    overflow: hidden;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);
    margin: 0 auto;
`

export const Tab = styled.button`
    flex: 1;
    height: 40px;
    padding: 0;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 30px;
    border: none;
    background:${({ $active }) => ($active ? '#D8D8D8': 'transparent')};
    color: ${({ $active }) => ($active ? '#100B0B': '#737373')};
    cursor: pointer;
    font-family: 'Pretendard', sans-serif;
    font-weight: 500;
`

export const TABS = [
    { path: '/admin/lanterns', label: '등불 관리' },
    { path: '/admin/notices', label: '공지 관리' },
    { path: '/admin/lost-found', label: '분실물 관리' },
]
