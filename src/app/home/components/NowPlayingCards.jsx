import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import titleMarker from '../../../assets/top-header/title-marker.svg'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'

import ArrowRightIcon from './ArrowRightIcon'

import useCurrentTime from '../hooks/useCurrentTime'
import { getPerformanceProgress } from '../utils/getPerformanceProgress'

import * as S from './NowPlayingCards.styles'

// TODO(API): 공연 현황 API 연결 후 제거
const NOW_PLAYING = [
  {
    id: 1,
    name: '멋쟁이사자처럼',
    date: '2026-09-18',
    startTime: '22:00',
    endTime: '23:00',
    thumbnail: performanceThumbnail,
  },
  {
    id: 2,
    name: '멋쟁이사자처럼',
    date: '2026-09-19',
    startTime: '15:00',
    endTime: '17:00',
    thumbnail: performanceThumbnail,
  },
]

export default function NowPlayingCards() {
  const navigate = useNavigate()
  const now = useCurrentTime()

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
          <span>전체 일정 보기</span>

          <S.ArrowBox>
            <ArrowRightIcon />
          </S.ArrowBox>
        </S.MoreLink>
      </S.Header>

      {NOW_PLAYING.length === 0 ? (
        <EmptyState>
          진행 중인 공연이 없어요.
        </EmptyState>
      ) : (
        <S.Scroller>
          {NOW_PLAYING.map((performance) => {
            const progress =
              getPerformanceProgress(
                performance.date,
                performance.startTime,
                performance.endTime,
                now
              )

            return (
              <S.Card key={performance.id}>
                <S.CardButton
                  type="button"
                  aria-label={`${performance.name} ${performance.date} ${performance.startTime}부터 ${performance.endTime}`}
                  onClick={() =>
                    navigate(
                      `/performance/${performance.id}`
                    )
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
                        {performance.startTime}
                        {' - '}
                        {performance.endTime}
                      </S.CardTime>
                    </S.InfoRow>

                    <S.ProgressTrack>
                      <S.ProgressFill
                        $value={progress}
                      />
                    </S.ProgressTrack>
                  </S.CardInfo>
                </S.CardButton>
              </S.Card>
            )
          })}
        </S.Scroller>
      )}
    </S.Wrapper>
  )
}