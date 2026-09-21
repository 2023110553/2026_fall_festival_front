import { useEffect, useRef, useState } from 'react'
import { searchBooths } from '../../../../api/map'
import { useMapContext } from '../../context/MapProvider'
import BoothCardList from '../BoothCardList/BoothCardList'
import searchIcon from '../../../../assets/map/search.svg'
import * as S from './BoothSearchPanel.styles'

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
      setError(!term ? '검색어를 입력해주세요.' : '검색어는 50자 이내로 입력해주세요.')
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
        date: selectedDate ?? '2026-09-29',
        timeSlot: timeSlot?.toUpperCase(),
      }, { signal: controller.signal })
      if (controller.signal.aborted) return
      if (!data?.success || !Array.isArray(data.data?.booths)) throw new Error('Invalid search response')
      setResults(data.data.booths)
      setStatus('success')
    } catch (error) {
      if (controller.signal.aborted) return
      setError(error.response?.status === 400
        ? '검색어를 확인해주세요. 1~50자로 입력해야 해요.'
        : '검색 결과를 불러오지 못했어요. 다시 시도해주세요.')
      setStatus('error')
    }
  }

  return (
    <S.Panel onKeyDown={(event) => { if (event.key === 'Escape') onCancel() }}>
      <S.SearchRow onSubmit={(event) => { event.preventDefault(); search(keyword) }} role="search">
        <S.InputWrapper>
          <S.IconButton type="submit" aria-label="검색" title="검색">
            <img src={searchIcon} alt="" width="24" height="24" />
          </S.IconButton>
          <S.Input
            type="search"
            maxLength={50}
            enterKeyHint="search"
            aria-label="전체 검색"
            placeholder="전체 검색"
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
        <S.TextButton type="button" onClick={onCancel}>취소</S.TextButton>
      </S.SearchRow>
      {status !== 'idle' ? (
        <section aria-label="검색 결과">
          <S.Heading>검색 결과</S.Heading>
          {status === 'loading' ? <S.Empty role="status">검색 중이에요...</S.Empty>
            : status === 'error' ? <S.Empty role="alert">{error}</S.Empty>
            : results.length === 0 ? <S.Empty>검색 결과가 없습니다.</S.Empty>
            : <BoothCardList booths={results} filterBySearchTerm={false} onSelectBooth={onSelectBooth} />}

        </section>
      ) : (
        <section aria-label="최근 검색어">
          <S.HistoryHeader>
            <S.Heading>최근 검색어</S.Heading>
            <S.TextButton type="button" disabled={!history.length} onClick={() => updateHistory([])}>전체 삭제</S.TextButton>
          </S.HistoryHeader>
          {!history.length && <S.Empty>최근 검색어가 없어요.</S.Empty>}
          <S.HistoryList>
            {history.map((term) => (
              <S.HistoryItem key={term}>
                <S.TermButton type="button" onClick={() => search(term)}>{term}</S.TermButton>
                <S.IconButton type="button" aria-label={`${term} 삭제`} title="검색어 삭제" onClick={() => updateHistory(history.filter((item) => item !== term))}>
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
