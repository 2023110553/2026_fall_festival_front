import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import TimelineList from './components/TimelineList'
import TopHeader from '../../components/common/TopHeader'
import FestivalDateTabs from '../../components/common/FestivalDateTabs'
import NowPlaying from './components/NowPlaying'
import { PERFORMANCE_MOCKS } from './Performance.mock'

// 공연 안내(STAGE) — 날짜 탭 + 지금 공연중 하이라이트 + 시간대별 타임라인 + 상세(셋리스트) 모달
export default function PerformancePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedDate = searchParams.get('date') ?? '2026-10-01'

  const handleDateChange = (date) => {
    setSearchParams({ date })
  }

  const performances = PERFORMANCE_MOCKS.filter((p) => p.date === selectedDate)
  const nowPlaying = performances.find((p) => p.isNow)

  return (
    <Page>
      <TopHeader title="공연" appearance="light" />
      <HeaderTab>
        <FestivalDateTabs value={selectedDate} onChange={handleDateChange} />
      </HeaderTab>
      <CardArea>
        <NowPlaying performance={nowPlaying} />
        <Divider />
      </CardArea>
      <TimelineList
        performances={performances}
        onSelect={(id) => navigate(`/performance/${id}`)}
      />
    </Page>
  )
}

const Page = styled.main`
  width: 100%;
  max-width: 375px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 0 32px;
  background: transparent;
`

const HeaderTab = styled.div`
  padding: 16px 16px 0;
  `

const CardArea = styled.div`
  padding: 16px 16px 0;
`

const Divider = styled.div`
  width: 100%;
  height: 1px;
  margin-top: 12px;
  margin-bottom: 10px;
  background: #d8d8d8;
`