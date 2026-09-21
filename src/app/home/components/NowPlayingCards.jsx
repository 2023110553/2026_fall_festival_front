import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'

import { MOCK_SERVER_TIME, getMockNowPerformances } from '../../performance/mocks/performanceMock'

import useServerTime from '../../../hooks/useServerTime'
import { getPerformanceProgress } from '../utils/getPerformanceProgress'
import { formatTime } from '../../../utils/time'

import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './NowPlayingCards.styles'

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
  const { t } = useTranslation()

  const now = useServerTime(MOCK_SERVER_TIME)
  const visiblePerformances = now ? getMockNowPerformances(now) : []

  return (
    <S.Wrapper>
      <S.Header>
        <S.TitleGroup>
          <S.Marker aria-hidden="true" />
          <S.Title>{t('home.performanceStatus')}</S.Title>
        </S.TitleGroup>

        <S.MoreLink
          type="button"
          onClick={() =>
            navigate('/performance')
          }
        >
          {t('home.viewFullSchedule')}
          <ChevronRightIcon />
        </S.MoreLink>
      </S.Header>

      {!now ? (
        <EmptyState>
          {t('home.performanceError')}
        </EmptyState>
      ) : visiblePerformances.length === 0 ? (
        <EmptyState>
          {t('home.performanceEmpty')}
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
                        performance.has_setlist === false
                          ? `/performance?date=${performance.start_at.slice(0, 10)}`
                          : `/performance/${performance.performance_id}`
                      )
                    }
                  >
                    <S.Thumbnail
                      src={
                        performance.image_url ||
                        performanceThumbnail
                      }
                      alt={t('home.performanceImageAlt', { team: performance.team_name })}
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