import AdBanner from './components/AdBanner'
import NoticeMarquee from './components/NoticeMarquee'
import LanternPreview from './components/LanternPreview'
import BoothRanking from './components/BoothRanking'
import NowPlayingCards from './components/NowPlayingCards'

// 홈 화면 — 각 섹션은 components/ 아래 독립 컴포넌트로 분리해서
// 담당자가 바뀌어도(배너 담당, 공지 담당 등) 파일 단위로 나눠 작업할 수 있게 한다.
export default function HomePage() {
  return (
    <div>
      <AdBanner />
      <NoticeMarquee />
      <LanternPreview />
      <BoothRanking />
      <NowPlayingCards />
    </div>
  )
}
