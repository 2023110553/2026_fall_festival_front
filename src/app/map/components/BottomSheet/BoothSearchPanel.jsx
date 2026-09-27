import { festivalDay } from '../../../../analytics/policy'
import { useAnalyticsView } from '../../../../analytics/useAnalyticsView'
import { useEffect, useRef, useState } from 'react'
import { searchBooths } from '../../../../api/map'
import { useMapContext } from '../../context/MapProvider'
import BoothCardList from '../BoothCardList/BoothCardList'
import SearchIcon from './SearchIcon'
import * as S from './BoothSearchPanel.styles'
import { useTranslation } from '../../../../i18n/useTranslation'

const STORAGE_KEY = 'map-booth-recent-searches'

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? [...new Set(saved.filter((item) => typeof item === 'string' && item.trim()))].slice(0, 10) : []
  } catch {
    return []
  }
}

export default function BoothSearchPanel({ onSelectBooth, onCancel }) {
  const { t } = useTranslation()
  const { selectedDate, listTimeOfDay, searchQuery, updateSearchQuery } = useMapContext()
  // 2026-09-26: 검색어를 URL(?q=)에도 싣는다. 검색 결과에서 부스를 고른 뒤 뒤로가기를 누르면
  // 이 화면이 다시 마운트되는데, 로컬 state만 쓰면 검색어가 비어 있는 첫 화면으로 돌아간다.
  // 초기값을 URL에서 읽으면 "멋사를 검색해 둔 상태"가 그대로 복원된다.
  const [keyword, setKeyword] = useState(() => searchQuery ?? '')
  const [history, setHistory] = useState(readHistory)
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  useAnalyticsView('booth_searched', status === 'success', results, { result_count: results.length, festival_day: festivalDay(selectedDate) })
  useAnalyticsView('site_error_shown', status === 'error', 'search', { error_type: 'search_failed' })
  const requestRef = useRef(null)
  const composingRef = useRef(false)
  useEffect(() => () => {
    requestRef.current?.abort()
  }, [])

  // 뒤로가기로 이 화면에 돌아오면 URL의 검색어로 결과를 다시 불러온다.
  // 마운트 시 한 번만 — 이후 입력은 handleKeywordChange가 처리한다.
  const didRestoreRef = useRef(false)
  useEffect(() => {
    if (didRestoreRef.current) return
    didRestoreRef.current = true
    if (searchQuery) search(searchQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateHistory = (next) => {
    setHistory(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Search remains usable when browser storage is unavailable.
    }
  }

  const rememberSearch = (value) => {
    const term = value.trim()
    if (term) updateHistory([term, ...history.filter((item) => item !== term)].slice(0, 10))
  }

  const search = async (value, saveHistory = false) => {
    const term = value.trim()
    requestRef.current?.abort()
    if (!term) {
      setResults([])
      setError('')
      setStatus('idle')
      return
    }
    if (term.length > 50) {
      setError(t('map.keywordTooLong'))
      setStatus('error')
      return
    }
    const controller = new AbortController()
    requestRef.current = controller
    setResults([])
    setError('')
    setStatus('loading')
    if (saveHistory) rememberSearch(term)
    try {
      const { data } = await searchBooths({
        keyword: term,
      }, { signal: controller.signal })
      if (controller.signal.aborted) return
      if (!data?.success || !Array.isArray(data.data?.booths)) throw new Error('Invalid search response')
      setResults(data.data.booths)
      setStatus('success')
    } catch (error) {
      if (controller.signal.aborted) return
      setError(error.response?.status === 400
        ? t('map.invalidKeyword')
        : t('map.searchError'))
      setStatus('error')
    }
  }

  const handleKeywordChange = (value) => {
    setKeyword(value)
    // replace다(MapProvider) — 한 글자마다 히스토리가 쌓이면 뒤로가기를 글자 수만큼 눌러야 한다.
    updateSearchQuery(value)
    search(value)
  }

  return (
    <S.Panel onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <S.SearchRow $isNight={listTimeOfDay === 'night'} onSubmit={(event) => {
        event.preventDefault()
        if (!composingRef.current) search(keyword, true)
      }} role="search">
        <S.InputWrapper $isNight={listTimeOfDay === 'night'}>
          <S.IconButton type="submit" aria-label={t('map.search')} title={t('map.search')}>
            <SearchIcon isNight={listTimeOfDay === 'night'} />
          </S.IconButton>
          <S.Input
            $isNight={listTimeOfDay === 'night'}
            type="search"
            maxLength={50}
            enterKeyHint="search"
            aria-label={t('map.searchAll')}
            placeholder={t('map.searchAll')}
            value={keyword}
            onCompositionStart={() => {
              composingRef.current = true
            }}
            onCompositionEnd={() => {
              composingRef.current = false
            }}
            onChange={(event) => handleKeywordChange(event.target.value)}
            autoFocus
          />
          {keyword && (
            <S.ClearInputButton
              $isNight={listTimeOfDay === 'night'}
              type="button"
              aria-label={t('map.deleteSearchTitle')}
              title={t('map.deleteSearchTitle')}
              onClick={() => handleKeywordChange('')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                <path d="M9 1.6875C4.968 1.6875 1.6875 4.968 1.6875 9C1.6875 13.032 4.968 16.3125 9 16.3125C13.032 16.3125 16.3125 13.032 16.3125 9C16.3125 4.968 13.032 1.6875 9 1.6875ZM9 2.8125C12.4239 2.8125 15.1875 5.57606 15.1875 9C15.1875 12.4239 12.4239 15.1875 9 15.1875C5.57606 15.1875 2.8125 12.4239 2.8125 9C2.8125 5.57606 5.57606 2.8125 9 2.8125ZM6.87375 6.06375L6.06375 6.87375L8.19225 9L6.06487 11.1263L6.87488 11.9362L9 9.80831L11.1263 11.9346L11.9362 11.1263L9.80831 9L11.9346 6.87375L11.1263 6.06375L9 8.19225L6.87375 6.06487V6.06375Z" fill="currentColor" />
              </svg>
            </S.ClearInputButton>
          )}
        </S.InputWrapper>
        <S.TextButton $isNight={listTimeOfDay === 'night'} type="button" onClick={onCancel}>{t('common.cancel')}</S.TextButton>
      </S.SearchRow>
      {status !== 'idle' ? (
        <section aria-label={t('map.searchResults')}>
          <S.Heading $isNight={listTimeOfDay === 'night'}>{t('map.searchResults')}</S.Heading>
          {status === 'loading' ? <S.Empty $isNight={listTimeOfDay === 'night'} role="status">{t('map.searching')}</S.Empty>
            : status === 'error' ? <S.Empty $isNight={listTimeOfDay === 'night'} role="alert">{error}</S.Empty>
            : results.length === 0 ? <S.Empty $isNight={listTimeOfDay === 'night'}>{t('map.noSearchResults')}</S.Empty>
            : <BoothCardList booths={results} onSelectBooth={(boothId, booth) => {
              rememberSearch(keyword)
              onSelectBooth(boothId, booth)
            }} />}

        </section>
      ) : (
        <section aria-label={t('map.recentSearches')}>
          <S.HistoryHeader>
            <S.Heading $isNight={listTimeOfDay === 'night'}>{t('map.recentSearches')}</S.Heading>
            <S.TextButton $isNight={listTimeOfDay === 'night'} type="button" disabled={!history.length} onClick={() => updateHistory([])}>{t('map.clearAll')}</S.TextButton>
          </S.HistoryHeader>
          {!history.length && <S.Empty $isNight={listTimeOfDay === 'night'}>{t('map.noRecentSearches')}</S.Empty>}
          <S.HistoryList>
            {history.map((term) => (
              <S.HistoryItem key={term}>
                <S.TermButton $isNight={listTimeOfDay === 'night'} type="button" onClick={() => {
                  setKeyword(term)
                  updateSearchQuery(term)
                  search(term, true)
                }}>{term}</S.TermButton>
                <S.IconButton type="button" aria-label={t('map.deleteSearch', { term })} title={t('map.deleteSearchTitle')} onClick={() => updateHistory(history.filter((item) => item !== term))}>
                  <S.CloseMark $isNight={listTimeOfDay === 'night'} aria-hidden="true">×</S.CloseMark>
                </S.IconButton>
              </S.HistoryItem>
            ))}
          </S.HistoryList>
        </section>
      )}
    </S.Panel>
  )
}
