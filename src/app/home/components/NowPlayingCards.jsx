import { useNavigate } from 'react-router-dom'

import EmptyState from '../../../components/common/EmptyState'
import titleMarker from '../../../assets/top-header/title-marker.svg'
import performanceThumbnail from '../../performance/assets/performance-thumbnail.png'

import ArrowRightIcon from './ArrowRightIcon'

import useServerTime from '../hooks/useServerTime'
import { getPerformanceProgress } from '../utils/getPerformanceProgress'

import * as S from './NowPlayingCards.styles'

// TODO(API):
// 백엔드 공연 타임테이블 데이터 등록 전까지
// API 명세와 동일한 구조의 mock 데이터를 사용합니다.
// 실제 데이터 등록 후 /api/performances/now/ 응답으로 교체합니다.
const MOCK_NOW_RESPONSE = {
  success: true,
  code: 'PERFORMANCE_NOW_SUCCESS',
  message: '현재 공연 정보를 조회했습니다.',

  data: {
    server_time: '2026-09-29T16:20:00',

    performances: [
      {
        performance_id: 5,
        team_name: '음샘',
        affiliation: '밴드동아리',
        image_url: performanceThumbnail,
        start_at: '2026-09-29T16:00:00',
        end_at: '2026-09-29T17:00:00',
        is_live: true,
      },
      {
        performance_id: 6,
        team_name: '멋쟁이사자처럼',
        affiliation: 'IT동아리',
        image_url: performanceThumbnail,
        start_at: '2026-09-29T17:10:00',
        end_at: '2026-09-29T18:00:00',
        is_live: false,
      },
    ],
  },
}

function formatTime(dateTime) {
  return dateTime
    ?.slice(11, 16)
}

export default function NowPlayingCards() {
  const navigate = useNavigate()

  // TODO(API): API 응답 데이터로 교체
  const {
    server_time: serverTime,
    performances,
  } = MOCK_NOW_RESPONSE.data

  const now =
    useServerTime(serverTime)

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

          <S.ArrowBox>
            <ArrowRightIcon />
          </S.ArrowBox>
        </S.MoreLink>
      </S.Header>

      {!now ? (
        <EmptyState>
          공연 현황을 불러올 수 없어요.
        </EmptyState>
      ) : performances.length === 0 ? (
        <EmptyState>
          진행 중인 공연이 없어요.
        </EmptyState>
      ) : (
        <S.Scroller>
          {performances.map(
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
                        performance.image_url
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
                          $value={
                            progress
                          }
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
