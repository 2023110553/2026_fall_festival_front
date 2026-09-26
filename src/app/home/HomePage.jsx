import { useEffect, useState } from 'react'
import TopHeader from '../../components/common/TopHeader'

import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'
import { getBoothRanking, getRollingNotices } from '../../api/home'
import { getNowPerformances } from '../../api/performance'
import useHomeData from '../../hooks/useHomeData'
import { useTranslation } from '../../i18n/useTranslation'
import { getBooths } from '../../api/map'
import { mapZoneIdByBoothId, pickTopLanternZone } from './utils/getTopLanternZone'
import * as S from './HomePage.styles'



const FESTIVAL_PERIOD = '2026. 09. 29. - 10. 01.'
const DAY_IN_MS = 24 * 60 * 60 * 1000
const KST_OFFSET_IN_MS = 9 * 60 * 60 * 1000
const FESTIVAL_START_DAY = Date.UTC(2026, 8, 29) / DAY_IN_MS

function getFestivalDay(now = Date.now(), endedLabel = '종료') {
  const today = Math.floor((now + KST_OFFSET_IN_MS) / DAY_IN_MS)
  const daysSinceStart = today - FESTIVAL_START_DAY

  if (daysSinceStart < 0) {
    return `D-${Math.abs(daysSinceStart)}`
  }

  if (daysSinceStart >= 3) {
    return endedLabel
  }

  return `DAY ${daysSinceStart + 1}`
}

// 홈이 부스 목록(GET /api/booths/, 현재 날짜·시간대 운영 부스)에서 뽑아 쓰는 두 가지.
//   - topZoneId: 등불이 가장 많은 구역 → 지도 미리보기 카드에 쓸 사진
//   - zoneIdByBoothId: 부스 id → 구역 id → 부스 랭킹의 "지도에서 보기" 링크(/map?zone=..&booth=..)
// 구역별 합계 API도, 랭킹 응답의 구역 필드도 아직 없어서 지도 페이지와 같은 목록을 받아 프론트에서 만든다.
// 백엔드에 둘 중 하나라도 생기면 이 함수 안만 바꾸면 된다.
//
// 2026-09-23: 반환 형태를 { zoneId, lanternCount } | null → { topZoneId, zoneIdByBoothId }로 바꿨다.
// 랭킹 링크도 같은 응답이 필요한데 따로 조회하면 똑같은 요청이 두 번 나가기 때문에 한 번에 둘 다 뽑는다.
async function getBoothZoneSummary({ signal } = {}) {
  const { data: response } = await getBooths({}, { signal })

  if (response?.success !== true || !Array.isArray(response.data?.booths)) {
    throw new Error('부스 목록 응답 형식이 올바르지 않습니다.')
  }

  const { booths } = response.data

  return {
    topZoneId: pickTopLanternZone(booths)?.zoneId ?? null,
    zoneIdByBoothId: mapZoneIdByBoothId(booths),
  }
}

// 홈 "지금 공연 중" 카드 — 서버가 라이브/1시간 이내 예정 공연을 이미 계산해서 내려준다
async function getNowPlaying({ signal } = {}) {
  const { data: response } = await getNowPerformances({ signal })

  if (
    response?.success !== true ||
    !Array.isArray(response.data?.performances) ||
    typeof response.data.server_time !== 'string'
  ) {
    throw new Error('공연 현황 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}

export default function HomePage() {
  const { t } = useTranslation()
  const [festivalDay, setFestivalDay] = useState(() => getFestivalDay(Date.now(), t('home.ended')))
  const notices = useHomeData(getRollingNotices)
  const boothZones = useHomeData(getBoothZoneSummary)
  const boothRanking = useHomeData(getBoothRanking)
  const nowPlaying = useHomeData(getNowPlaying)

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
          {/* 2026-09-23: 사진 위 문구가 고정 문구로 바뀌면서 등불 개수·조회 실패 여부는 더 이상 쓰지 않는다 */}
          <LanternPreview zoneId={boothZones.data?.topZoneId} isLoading={boothZones.isLoading}>
            {/* 2026-09-23: 랭킹에서 부스를 누르면 지도로 이동한다 — 어느 구역으로 보낼지는 부스 목록에서 뽑은 매핑이 정한다 */}
            <BoothRanking
              ranking={boothRanking.data?.ranking}
              zoneIdByBoothId={boothZones.data?.zoneIdByBoothId}
              isLoading={boothRanking.isLoading}
              isError={boothRanking.isError}
            />
          </LanternPreview>
        </S.Gap>

        {/* 카드 ~ 공연 현황 20px */}
        <S.Gap $size={20}>
          <NowPlayingCards
            performances={nowPlaying.data?.performances}
            serverTime={nowPlaying.data?.server_time}
            isLoading={nowPlaying.isLoading}
            isError={nowPlaying.isError}
          />
        </S.Gap>
      </S.Content>
    </S.Page>
  )
}
