import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import TimelineList from './components/TimelineList'
import TopHeader from '../../components/common/TopHeader'
import FestivalDateTabs from '../../components/common/FestivalDateTabs'
import NowPlaying from './components/NowPlaying'
import { MOCK_SERVER_TIME, getMockPerformanceList } from './mocks/performanceMock'
import useServerTime from '../../hooks/useServerTime'

const FESTIVAL_DATES = ['2026-09-29', '2026-09-30', '2026-10-01']

// 공연 안내(STAGE) — 날짜 탭 + 지금 공연중 하이라이트 + 시간대별 타임라인
export default function PerformancePage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const dateParam = searchParams.get('date')
  const now = useServerTime(MOCK_SERVER_TIME)
  const defaultDate = FESTIVAL_DATES.includes(MOCK_SERVER_TIME.slice(0, 10))
    ? MOCK_SERVER_TIME.slice(0, 10)
    : FESTIVAL_DATES[0]
  const selectedDate = FESTIVAL_DATES.includes(dateParam) ? dateParam : defaultDate
  const handleDateChange = (date) => {
    setSearchParams({ date })
  }

  const performances = getMockPerformanceList(selectedDate, now ?? MOCK_SERVER_TIME)
  const nowPlaying = performances.find((p) => p.is_live) ?? null

  return (
    <Page>
      <TopHeader title="공연" appearance="light" />
      <HeaderTab>
        <FestivalDateTabs value={selectedDate} onChange={handleDateChange} />
      </HeaderTab>
      <CardArea>
        <NowPlaying performance={nowPlaying} now={now} />
        <Divider />
      </CardArea>
      <TimelineList
        performances={performances}
        onSelect={(id) => {
          if (performances.find((p) => p.performance_id === id)?.has_setlist === true) {
            navigate(`/performance/${id}`)
          }
        }}
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