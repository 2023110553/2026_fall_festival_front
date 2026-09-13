import TopHeader from '../../components/common/TopHeader'
import { useAuth } from '../../hooks/useAuth'

import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'
import * as S from './HomePage.styles'



const FESTIVAL_PERIOD = '2026. 09.29. - 10.01'
const FESTIVAL_DAY = 'DAY 1'

export default function HomePage() {
  const { isLoggedIn } = useAuth()

  return (
    <S.Page>
      <TopHeader title="홈" isLoggedIn={isLoggedIn} />

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

        <S.Gap $size={8}>
          <NoticeMarquee />
        </S.Gap>

        <S.Gap $size={20}>
          <LanternPreview>
            <BoothRanking />
          </LanternPreview>
        </S.Gap>

        <S.Gap $size={20}>
          <NowPlayingCards />
        </S.Gap>
      </S.Content>
    </S.Page>
  )
}
