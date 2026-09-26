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
  const { listTimeOfDay } = useMapContext()
  const [keyword, setKeyword] = useState('')
  const [history, setHistory] = useState(readHistory)
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestRef = useRef(null)
  const composingRef = useRef(false)
  useEffect(() => () => {
    requestRef.current?.abort()
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
    search(value)
  }

  return (
    <S.Panel onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <S.SearchRow onSubmit={(event) => {
        event.preventDefault()
        if (!composingRef.current) search(keyword, true)
      }} role="search">
        <S.InputWrapper>
          <S.IconButton type="submit" aria-label={t('map.search')} title={t('map.search')}>
            <SearchIcon isNight={listTimeOfDay === 'night'} />
          </S.IconButton>
          <S.Input
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
        </S.InputWrapper>
        <S.TextButton type="button" onClick={onCancel}>{t('common.cancel')}</S.TextButton>
      </S.SearchRow>
      {status !== 'idle' ? (
        <section aria-label={t('map.searchResults')}>
          <S.Heading>{t('map.searchResults')}</S.Heading>
          {status === 'loading' ? <S.Empty role="status">{t('map.searching')}</S.Empty>
            : status === 'error' ? <S.Empty role="alert">{error}</S.Empty>
            : results.length === 0 ? <S.Empty>{t('map.noSearchResults')}</S.Empty>
            : <BoothCardList booths={results} filterBySearchTerm={false} onSelectBooth={(boothId) => {
              rememberSearch(keyword)
              onSelectBooth(boothId)
            }} />}

        </section>
      ) : (
        <section aria-label={t('map.recentSearches')}>
          <S.HistoryHeader>
            <S.Heading>{t('map.recentSearches')}</S.Heading>
            <S.TextButton type="button" disabled={!history.length} onClick={() => updateHistory([])}>{t('map.clearAll')}</S.TextButton>
          </S.HistoryHeader>
          {!history.length && <S.Empty>{t('map.noRecentSearches')}</S.Empty>}
          <S.HistoryList>
            {history.map((term) => (
              <S.HistoryItem key={term}>
                <S.TermButton type="button" onClick={() => {
                  setKeyword(term)
                  search(term, true)
                }}>{term}</S.TermButton>
                <S.IconButton type="button" aria-label={t('map.deleteSearch', { term })} title={t('map.deleteSearchTitle')} onClick={() => updateHistory(history.filter((item) => item !== term))}>
                  <S.CloseMark aria-hidden="true">×</S.CloseMark>
                </S.IconButton>
              </S.HistoryItem>
            ))}
          </S.HistoryList>
        </section>
      )}
    </S.Panel>
  )
}
