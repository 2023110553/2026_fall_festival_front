import { useEffect, useState } from 'react'
import TopHeader from '../../components/common/TopHeader'

import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'
import { apiClient } from '../../api/client'
import { useTranslation } from '../../i18n/useTranslation'
import * as S from './HomePage.styles'



const FESTIVAL_PERIOD = '2026. 09.29. - 10.01'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const KST_OFFSET_IN_MS = 9 * 60 * 60 * 1000
const FESTIVAL_START_DAY = Date.UTC(2026, 8, 29) / DAY_IN_MS

function getFestivalDay(now = Date.now(), endedLabel = '종료') {
  const today = Math.floor((now + KST_OFFSET_IN_MS) / DAY_IN_MS)
  const daysSinceStart = today - FESTIVAL_START_DAY

  if (daysSinceStart < 0) {
    return `D - ${Math.abs(daysSinceStart)}`
  }

  if (daysSinceStart >= 3) {
    return endedLabel
  }

  return `DAY ${daysSinceStart + 1}`
}

// 홈 상단 롤링 공지
async function getRollingNotices({ signal } = {}) {
  const { data: response } = await apiClient.get('/api/notices/rolling/', { signal })

  if (
    response?.success !== true ||
    !Array.isArray(response.data?.notices) ||
    response.data.notices.some((notice) =>
      !Number.isInteger(notice?.notice_id) || notice.notice_id <= 0 ||
      !['URGENT', 'NORMAL'].includes(notice.type) ||
      typeof notice.title !== 'string' ||
      typeof notice.created_at !== 'string' ||
      !Number.isFinite(Date.parse(notice.created_at))
    )
  ) {
    throw new Error('공지사항 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}

// 홈 부스별 등불 랭킹
async function getBoothRanking({ signal } = {}) {
  const { data: response } = await apiClient.get('/api/booths/ranking/', {
    params: { limit: 3 },
    signal,
  })

  if (
    response?.success !== true ||
    !Array.isArray(response.data?.ranking) ||
    !Number.isInteger(response.data.total_lantern_count) || response.data.total_lantern_count < 0 ||
    response.data.ranking.some((booth) =>
      !Number.isInteger(booth?.rank) || booth.rank <= 0 ||
      !Number.isInteger(booth.booth_id) || booth.booth_id <= 0 ||
      typeof booth.name !== 'string' ||
      !Number.isInteger(booth.lantern_count) || booth.lantern_count < 0
    )
  ) {
    throw new Error('부스 랭킹 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}

function useHomeData(request) {
  const [state, setState] = useState({ data: null, isLoading: true, isError: false })

  useEffect(() => {
    const controller = new AbortController()

    request({ signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, isLoading: false, isError: false })
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error(`[HomePage] ${request.name} failed`, error)
          setState({ data: null, isLoading: false, isError: true })
        }
      })

    return () => controller.abort()
  }, [request])

  return state
}

export default function HomePage() {
  const { t } = useTranslation()
  const [festivalDay, setFestivalDay] = useState(() => getFestivalDay(Date.now(), t('home.ended')))
  const notices = useHomeData(getRollingNotices)
  const boothRanking = useHomeData(getBoothRanking)

  useEffect(() => {
    let timeoutId

    const updateFestivalDay = () => {
      const now = Date.now()
      setFestivalDay(getFestivalDay(now, t('home.ended')))
      window.clearTimeout(timeoutId)
      const untilMidnight = DAY_IN_MS - ((now + KST_OFFSET_IN_MS) % DAY_IN_MS)
      timeoutId = window.setTimeout(updateFestivalDay, untilMidnight)
    }

    updateFestivalDay()
    window.addEventListener('focus', updateFestivalDay)
    document.addEventListener('visibilitychange', updateFestivalDay)

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('focus', updateFestivalDay)
      document.removeEventListener('visibilitychange', updateFestivalDay)
    }
  }, [t])

  return (
    <S.Page>
      <TopHeader title={t('nav.home')} appearance="light" />

      <S.Content>
        <AdBanner />

        <S.Hero>
          <S.HeroDate>{FESTIVAL_PERIOD}</S.HeroDate>
          <S.HeroRow>
            <S.HeroLogo aria-label="DIRVANA">
              DI<S.FlippedR aria-hidden="true">R</S.FlippedR>VANA
            </S.HeroLogo>
            <S.DayBadge>{festivalDay}</S.DayBadge>
          </S.HeroRow>
        </S.Hero>

        {/* 간격계산 DIRVANA 로고 ~ 공지사항 18px */}
        <S.Gap $size={18}>
          <NoticeMarquee
            notices={notices.data?.notices}
            isLoading={notices.isLoading}
            isError={notices.isError}
          />
        </S.Gap>

        {/* 공지사항 ~ 현재 인기 */}
        <S.Gap $size={30}>
          <LanternPreview>
            <BoothRanking
              ranking={boothRanking.data?.ranking}
              isLoading={boothRanking.isLoading}
              isError={boothRanking.isError}
            />
          </LanternPreview>
        </S.Gap>

        {/* 카드 ~ 공연 현황 20px */}
        <S.Gap $size={20}>
          <NowPlayingCards />
        </S.Gap>
      </S.Content>
    </S.Page>
  )
}
