// 공연 상세(선택 시) — 출연진 소개, 공연순서(셋리스트) 표시
import styled from 'styled-components'

export default function Setlist({ songs = [] }) {
  if (songs.length === 0) {
    return <EmptyText>등록된 공연순서가 없어요.</EmptyText>
  }

  return (
    <List>
      {songs.map((song, index) => (
        <Song key={`${song}-${index}`}>
          {song}
        </Song>
      ))}
    </List>
  )
}

const List = styled.ol`
    width: 100%;

    display: flex;
    flex-direction: column;
    gap: 10px;

    margin: 0;
    padding: 0;

    list-style: none;
`

const Song = styled.li`
    width: 100%;

    padding: 8px 12px;

    box-sizing: border-box;

    border-radius: 8px;

    border: 1px solid var(--light_grey, #D8D8D8);
  background: var(--aurora_white, #FDFDFD);
  /* box_shadow */
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.10);

    font-size: 14px;
    font-weight: 400;
    line-height: normal;
    font-family: var(--font-pretendard);
`

const EmptyText = styled.p`
    margin: 0;

    color: #747474;

    font-size: 12px;
    font-weight: 400;
`