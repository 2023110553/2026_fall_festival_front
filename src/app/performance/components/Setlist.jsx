import styled from 'styled-components'

export default function Setlist({
  songs = [],
}) {
  if (songs.length === 0) {
    return (
      <EmptyText>
        등록된 공연 순서가 없습니다.
      </EmptyText>
    )
  }

  const sortedSongs = [...songs].sort(
    (a, b) =>
      a.sort_order - b.sort_order
  )

  return (
    <List>
      {sortedSongs.map((song) => (
        <Song key={song.song_id}>
          {song.artist
            ? `${song.title} - ${song.artist}`
            : song.title}
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

  background: rgba(
    255,
    255,
    255,
    0.7
  );

  box-shadow:
    0 0 2px 0
    rgba(0, 0, 0, 0.15);

  color: #100b0b;

    font-size: 14px;
    color: #100B0B;
    font-weight: 400;
    line-height: normal;
    font-family: var(--font-pretendard);

`

const EmptyText = styled.p`
  margin: 20px 0 0;

  color: #999999;

  font-family: Pretendard;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
`