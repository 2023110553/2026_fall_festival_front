import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'

import {
  MOCK_NOW_RESPONSE,
} from '../../performance/mocks/performanceMock'

import useServerTime from '../../../hooks/useServerTime'
import { getPerformanceProgress } from '../utils/getPerformanceProgress'
import { formatTime } from '../../../utils/time'

import * as S from './NowPlayingCards.styles'

const ONE_HOUR =
  60 * 60 * 1000

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M5.13387 2.62947C5.04805 2.71414 5 2.82788 5 2.94634C5 3.0648 5.04805 3.17854 5.13387 3.26321L9.91635 8L5.1354 12.7368C5.05005 12.8214 5.00228 12.9348 5.00228 13.0529C5.00228 13.171 5.05005 13.2844 5.1354 13.3691C5.17688 13.4105 5.22657 13.4434 5.28151 13.4659C5.33646 13.4884 5.39552 13.5 5.4552 13.5C5.51488 13.5 5.57395 13.4884 5.6289 13.4659C5.68384 13.4434 5.73353 13.4105 5.77501 13.3691L10.8612 8.3302C10.9502 8.24176 11 8.12331 11 8C11 7.87669 10.9502 7.75824 10.8612 7.6698L5.77347 2.63095C5.73199 2.58953 5.6823 2.55659 5.62736 2.53409C5.57242 2.51159 5.51335 2.5 5.45367 2.5C5.39399 2.5 5.33492 2.51159 5.27998 2.53409C5.22504 2.55659 5.17535 2.58953 5.13387 2.63095V2.62947Z"
        fill="#9F9C99"
      />
    </svg>
  )
}

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
          <S.Marker aria-hidden="true" />
          <S.Title>공연 현황</S.Title>
        </S.TitleGroup>

        <S.MoreLink
          type="button"
          onClick={() =>
            navigate('/performance')
          }
        >
          전체 일정 보기
          <ChevronRightIcon />
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