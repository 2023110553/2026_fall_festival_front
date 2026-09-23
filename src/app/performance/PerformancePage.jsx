import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import styled from 'styled-components'
import TimelineList from './components/TimelineList'
import TopHeader from '../../components/common/TopHeader'
import FestivalDateTabs from '../../components/common/FestivalDateTabs'
import NowPlaying from './components/NowPlaying'
import EmptyState from '../../components/common/EmptyState'
import { getPerformances } from '../../api/performance'
import useServerTime from '../../hooks/useServerTime'
import { useTranslation } from '../../i18n/useTranslation'
import { FESTIVAL_DATES } from '../../constants/festivalDates'

const INITIAL_STATE = {
  performances: [],
  serverTime: null,
  isLoading: true,
  error: '',
}

// 공연 안내(STAGE) — 날짜 탭 + 지금 공연중 하이라이트 + 시간대별 타임라인
// 2026-09-22: 목데이터(performanceMock) 연동 해제, GET /api/performances/?date= 로 교체.
// 이 API가 festival_date/server_time/performances(is_live 포함)를 한 번에 내려주므로
// "오늘 날짜"·"지금 몇 시"를 프론트가 따로 계산하지 않고 응답의 server_time을 그대로 useServerTime에 흘려보낸다.
export default function PerformancePage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const dateParam = searchParams.get('date')
  const selectedDate = FESTIVAL_DATES.includes(dateParam) ? dateParam : FESTIVAL_DATES[0]
  const handleDateChange = (date) => {
    setSearchParams({ date })
  }

  const [state, setState] = useState(INITIAL_STATE)

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ ...prev, isLoading: true, error: '' }))

    getPerformances(selectedDate, { signal: controller.signal })
      .then(({ data: response }) => {
        if (response?.success !== true || !Array.isArray(response.data?.performances)) {
          throw new Error('Invalid performance list response')
        }
        setState({
          performances: response.data.performances,
          serverTime: response.data.server_time,
          isLoading: false,
          error: '',
        })
      })
      .catch((error) => {
        if (controller.signal.aborted) return
        setState({
          performances: [],
          serverTime: null,
          isLoading: false,
          error: error?.response?.data?.message || t('performance.error'),
        })
      })

    return () => controller.abort()
  }, [selectedDate, t])

  // server_time 기준으로 로컬에서 1분마다 갱신 — is_live 자체는 서버가 계산해서 내려주므로
  // now는 상단 "지금 공연중" 카드의 진행률(progress bar) 표시에만 쓰인다.
  const now = useServerTime(state.serverTime)
  const nowPlaying = state.performances.find((p) => p.is_live) ?? null

  return (
    <Page>
      <TopHeader title={t('nav.performance')} appearance="light" />
      <HeaderTab>
        <FestivalDateTabs value={selectedDate} onChange={handleDateChange} />
      </HeaderTab>
      <CardArea>
        <NowPlaying performance={nowPlaying} now={now} />
        <Divider />
      </CardArea>
      {state.isLoading ? (
        <EmptyState>{t('performance.loading')}</EmptyState>
      ) : state.error ? (
        <EmptyState>{state.error}</EmptyState>
      ) : (
        <TimelineList
          performances={state.performances}
          onSelect={(id) => {
            if (state.performances.find((p) => p.performance_id === id)?.has_setlist === true) {
              navigate(`/performance/${id}`)
            }
          }}
        />
      )}
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
