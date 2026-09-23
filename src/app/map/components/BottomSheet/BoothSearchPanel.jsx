import { useEffect, useRef, useState } from 'react'
import { searchBooths } from '../../../../api/map'
import { useMapContext } from '../../context/MapProvider'
import BoothCardList from '../BoothCardList/BoothCardList'
import searchIcon from '../../../../assets/map/search.svg'
import * as S from './BoothSearchPanel.styles'
import { useTranslation } from '../../../../i18n/useTranslation'
import { DEFAULT_FESTIVAL_DATE } from '../../../../constants/festivalDates'

const STORAGE_KEY = 'map-booth-recent-searches'

function readHistory() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(saved) ? [...new Set(saved.filter((item) => typeof item === 'string' && item.trim()))].slice(0, 10) : []
  } catch {
    return []
  }
}

export default function BoothSearchPanel({ timeSlot, onSelectBooth, onCancel }) {
  const { t } = useTranslation()
  const { selectedDate } = useMapContext()
  const [keyword, setKeyword] = useState('')
  const [history, setHistory] = useState(readHistory)
  const [results, setResults] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const requestRef = useRef(null)
  useEffect(() => () => requestRef.current?.abort(), [])

  const updateHistory = (next) => {
    setHistory(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Search remains usable when browser storage is unavailable.
    }
  }

  const search = async (value) => {
    const term = value.trim()
    requestRef.current?.abort()
    if (!term || term.length > 50) {
      setError(!term ? t('map.enterKeyword') : t('map.keywordTooLong'))
      setStatus('error')
      return
    }
    const controller = new AbortController()
    requestRef.current = controller
    setKeyword(term)
    setResults([])
    setError('')
    setStatus('loading')
    updateHistory([term, ...history.filter((item) => item !== term)].slice(0, 10))
    try {
      const { data } = await searchBooths({
        keyword: term,
        date: selectedDate ?? DEFAULT_FESTIVAL_DATE,
        timeSlot: timeSlot?.toUpperCase(),
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

  return (
    <S.Panel onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <S.SearchRow onSubmit={(event) => { event.preventDefault(); search(keyword) }} role="search">
        <S.InputWrapper>
          <S.IconButton type="submit" aria-label={t('map.search')} title={t('map.search')}>
            <img src={searchIcon} alt="" width="24" height="24" />
          </S.IconButton>
          <S.Input
            type="search"
            maxLength={50}
            enterKeyHint="search"
            aria-label={t('map.searchAll')}
            placeholder={t('map.searchAll')}
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              requestRef.current?.abort()
              setStatus('idle')
              setError('')
            }}
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
            : <BoothCardList booths={results} filterBySearchTerm={false} onSelectBooth={onSelectBooth} />}

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
                <S.TermButton type="button" onClick={() => search(term)}>{term}</S.TermButton>
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
