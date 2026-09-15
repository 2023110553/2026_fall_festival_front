import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import titleMarker from '../../../assets/top-header/title-marker.svg'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'
import * as S from './NowPlayingCards.styles'

// TODO(API): 실제 공연 데이터 연결 후 교체
const NOW_PLAYING = [
  {
    id: 1,
    name: '멋쟁이사자처럼',
    time: '07:00',
    progress: 0.38,
    thumbnail: performanceThumbnail,
  },
  {
    id: 2,
    name: '멋쟁이사자처럼',
    time: '07:00',
    progress: 0.38,
    thumbnail: performanceThumbnail,
  },
  {
    id: 3,
    name: '멋쟁이사자처럼',
    time: '07:00',
    progress: 0.38,
    thumbnail: performanceThumbnail,
  },
]

export default function NowPlayingCards() {
  const navigate = useNavigate()

  return (
    <S.Wrapper>
      <S.Header>
        <S.TitleGroup>
          <S.Marker
            src={titleMarker}
            alt=""
            aria-hidden="true"
          />
          <S.Title>공연 현황</S.Title>
        </S.TitleGroup>

        <S.MoreLink
          type="button"
          onClick={() => navigate('/performance')}
        >
          전체 일정 보기
        </S.MoreLink>
      </S.Header>

      {NOW_PLAYING.length === 0 ? (
        <EmptyState>
          진행 중인 공연이 없어요.
        </EmptyState>
      ) : (
        <S.Scroller>
          {NOW_PLAYING.map((performance) => (
            <S.Card key={performance.id}>
              <S.CardButton
                type="button"
                aria-label={`${performance.name} ${performance.time}`}
                onClick={() =>
                  navigate(`/performance/${performance.id}`)
                }
              >
                <S.Thumbnail
                  src={performance.thumbnail}
                  alt={`${performance.name} 공연 사진`}
                />

                <S.BottomGradient />

                <S.CardInfo>
                  <S.InfoRow>
                    <S.CardName>
                      {performance.name}
                    </S.CardName>

                    <S.CardTime>
                      {performance.time}
                    </S.CardTime>
                  </S.InfoRow>

                  <S.ProgressTrack>
                    <S.ProgressFill
                      $value={performance.progress}
                    />
                  </S.ProgressTrack>
                </S.CardInfo>
              </S.CardButton>
            </S.Card>
          ))}
        </S.Scroller>
      )}
    </S.Wrapper>
  )
}