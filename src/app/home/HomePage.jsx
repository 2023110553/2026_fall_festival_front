import { useEffect, useState } from 'react'
import TopHeader from '../../components/common/TopHeader'

import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'
import { apiClient } from '../../api/client'
import * as S from './HomePage.styles'



const FESTIVAL_PERIOD = '2026. 09.29. - 10.01'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const KST_OFFSET_IN_MS = 9 * 60 * 60 * 1000
const FESTIVAL_START_DAY = Date.UTC(2026, 8, 29) / DAY_IN_MS

function getFestivalDay(now = Date.now()) {
  const today = Math.floor((now + KST_OFFSET_IN_MS) / DAY_IN_MS)
  const daysSinceStart = today - FESTIVAL_START_DAY

  if (daysSinceStart < 0) {
    return `D - ${Math.abs(daysSinceStart)}`
  }

  if (daysSinceStart >= 3) {
    return '종료'
  }

  return `DAY ${daysSinceStart + 1}`
}

// 홈 상단 롤링 공지
async function getRollingNotices({ signal } = {}) {
  const { data: response } = await apiClient.get('/api/notices/rolling/', { signal })

  if (response?.success !== true || !Array.isArray(response.data?.notices)) {
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

  if (response?.success !== true || !Array.isArray(response.data?.ranking) ||
      typeof response.data.total_lantern_count !== 'number') {
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
      .catch(() => {
        if (!controller.signal.aborted) {
          setState({ data: null, isLoading: false, isError: true })
        }
      })

    return () => controller.abort()
  }, [request])

  return state
}

export default function HomePage() {
  const [festivalDay, setFestivalDay] = useState(getFestivalDay)
  const notices = useHomeData(getRollingNotices)
  const boothRanking = useHomeData(getBoothRanking)

  useEffect(() => {
    let timeoutId

    const updateFestivalDay = () => {
      const now = Date.now()
      setFestivalDay(getFestivalDay(now))
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
  }, [])

  return (
    <S.Page>
      <TopHeader title="홈" appearance="light" />

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
