import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import titleMarker from '../../../assets/top-header/title-marker.svg'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'

import {
  MOCK_NOW_RESPONSE,
} from '../../performance/mocks/performanceMock'

import formatTime from '../utils/formatTime'

import useServerTime from '../hooks/useServerTime'
import { getPerformanceProgress } from '../utils/getPerformanceProgress'

import * as S from './NowPlayingCards.styles'

const ONE_HOUR =
  60 * 60 * 1000

export default function NowPlayingCards() {
  const navigate = useNavigate()

  // TODO(API):
  // 실제 API 연결 후 MOCK_NOW_RESPONSE를
  // GET /api/performances/now/ 응답으로 교체
  const {
    server_time: serverTime,
    performances,
  } = MOCK_NOW_RESPONSE.data

  const now =
    useServerTime(serverTime)

  const visiblePerformances = (() => {
    if (!now || performances.length === 0) {
      return []
    }

    const nowTime =
      new Date(now).getTime()

    const sortedPerformances = [
      ...performances,
    ].sort(
      (a, b) =>
        new Date(a.start_at).getTime() -
        new Date(b.start_at).getTime()
    )

    const firstStartTime =
      new Date(
        sortedPerformances[0].start_at
      ).getTime()

    // 첫 공연 시작 1시간 전부터
    // 공연 현황 카드 노출
    if (
      nowTime <
      firstStartTime - ONE_HOUR
    ) {
      return []
    }

    return sortedPerformances
      .filter(
        (performance) =>
          nowTime <
          new Date(
            performance.end_at
          ).getTime()
      )
      .slice(0, 3)
  })()

  return (
    <S.Wrapper>
      <S.Header>
        <S.TitleGroup>
          <S.Marker
            src={titleMarker}
            alt=""
            aria-hidden="true"
          />

          <S.Title>
            공연 현황
          </S.Title>
        </S.TitleGroup>

        <S.MoreLink
          type="button"
          onClick={() =>
            navigate('/performance')
          }
        >
          <span>
            전체 일정 보기
          </span>

        </S.MoreLink>
      </S.Header>

      {!now ? (
        <EmptyState>
          공연 현황을 불러올 수 없어요.
        </EmptyState>
      ) : visiblePerformances.length === 0 ? (
        <EmptyState>
          진행 중인 공연이 없어요.
        </EmptyState>
      ) : (
        <S.Scroller>
          {visiblePerformances.map(
            (performance) => {
              const progress =
                getPerformanceProgress(
                  now,
                  performance.start_at,
                  performance.end_at
                )

              return (
                <S.Card
                  key={
                    performance.performance_id
                  }
                >
                  <S.CardButton
                    type="button"
                    aria-label={
                      `${performance.team_name} ` +
                      `${formatTime(performance.start_at)}부터 ` +
                      `${formatTime(performance.end_at)}`
                    }
                    onClick={() =>
                      navigate(
                        `/performance/${performance.performance_id}`
                      )
                    }
                  >
                    <S.Thumbnail
                      src={
                        performance.image_url ||
                        performanceThumbnail
                      }
                      alt={`${performance.team_name} 공연 사진`}
                    />

                    <S.BottomGradient />

                    <S.CardInfo>
                      <S.InfoRow>
                        <S.CardName>
                          {
                            performance.team_name
                          }
                        </S.CardName>

                        <S.CardTime>
                          {
                            formatTime(
                              performance.start_at
                            )
                          }

                          {' - '}

                          {
                            formatTime(
                              performance.end_at
                            )
                          }
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
            }
          )}
        </S.Scroller>
      )}
    </S.Wrapper>
  )
}