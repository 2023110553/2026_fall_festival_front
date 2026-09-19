import styled from 'styled-components'

export const Page = styled.article`
  min-height: calc(100vh - 164px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  color: #100b0b;
`

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const DateBadge = styled.span`
  flex: 0 0 auto;
  width: 43px;
  padding: 6px 8px;
  border-radius: 4px;
  background: #100b0b;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
  color: #fdfdfd;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  text-align: center;
  opacity: 0.9;
`

export const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  line-height: 1;
`

export const ImageGallery = styled.div`
  width: 100%;
  display: flex;
  overflow-x: auto;
  border-radius: 5px;
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`

export const Image = styled.img`
  width: 100%;
  flex: 0 0 100%;
  aspect-ratio: 1;
  background: #100b0b;
  object-fit: cover;
  scroll-snap-align: center;
`

export const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  span {
    padding: 4px 8px;
    border: 0.5px solid #d8d8d8;
    border-radius: 999px;
    background: #fdfdfd;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.15);
    color: #272727;
    font-size: 14px;
    line-height: 1;
  }
`

export const Link = styled.a`
  min-height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: auto;
  border-radius: 999px;
  background: #dc7054;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  color: #fdfdfd;
  font-size: 18px;
  font-weight: 600;
`
