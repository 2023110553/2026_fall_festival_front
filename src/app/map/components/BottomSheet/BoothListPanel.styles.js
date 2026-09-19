import styled from "styled-components";

export const TimeWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
`
export const Top = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%
`
export const Search =styled.img`
    width: 24px;
    height: 24px;
    object-fit: contain;
`
export const SearchButton = styled.button`
    display: grid;
    place-items: center;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 0;
    background: transparent;
    &:focus-visible { outline: 2px solid #DC7054; }
`
export const ButtonWrapper = styled.div`
    background: var(--text_black, #272727);
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    border-radius: 999px;
    gap: 0;
    padding: 3px;
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
`
export const Button = styled.button`
    border-radius: 999px;
    border: 0;
    width: 42px;
    height: 30px;
    padding: 0;
    background: ${({ $active }) => ($active ? 'var(--aurora_orange, #DC7054)' : 'transparent')};
    color: #FDFDFD;

    font-family: inherit;
    font-size: 12px;
    line-height: normal;
    font-weight: ${({ $active }) => ($active ? 600 : 400)};

    transition: background 0.2s;

    &:focus-visible {
        outline: 2px solid #FDFDFD;
        outline-offset: -3px;
    }
`

export const Time = styled.span`
    padding-left: 7px;

`
export const Divider = styled.hr`
    width: 100%;
    margin: 16px 0;
    border: 0;
    border-top: 1px solid #D8D8D8;
`

export const CategoryList = styled.div`
    display: flex;
    gap: 5px;
`

export const CategoryButton = styled.button`
    padding: 4px 10px;
    font-size: 12px;
    background: ${({ $active }) => ($active ? '#272727' : '#FDFDFD')};
    color: ${({ $active }) => ($active ? '#FDFDFD' : '#272727')};
    border: 0;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);

    transition: transform 0.12s ease, box-shadow 0.12s ease;


    &:active {
    transform: translateY(1px) scale(0.96);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.12);
    }

    &:focus-visible {
        outline: 2px solid #DC7054;
        outline-offset: 2px;
    }
`
