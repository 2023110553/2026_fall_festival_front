import TopHeader from '../../components/common/TopHeader'

import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'
import * as S from './HomePage.styles'



const FESTIVAL_PERIOD = '2026. 09.29. - 10.01'
const FESTIVAL_DAY = 'DAY 1'

export default function HomePage() {
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
            <S.DayBadge>{FESTIVAL_DAY}</S.DayBadge>
          </S.HeroRow>
        </S.Hero>

        {/* 간격계산 DIRVANA 로고 ~ 공지사항 18px */}
        <S.Gap $size={18}>
          <NoticeMarquee />
        </S.Gap>

        {/* 공지사항 ~ 현재 인기 */}
        <S.Gap $size={30}>
          <LanternPreview>
            <BoothRanking />
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
