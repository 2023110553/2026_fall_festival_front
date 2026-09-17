import { useState } from 'react'
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

export default function BoothSearchPanel({ booths, onSelectBooth, onCancel }) {
  const { setSearchTerm } = useMapContext()
  const [keyword, setKeyword] = useState('')
  const [history, setHistory] = useState(readHistory)

  const updateHistory = (next) => {
    setHistory(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // Search remains usable when browser storage is unavailable.
    }
  }

  const search = (value) => {
    const term = value.trim()
    if (!term) return
    setKeyword(term)
    setSearchTerm(term)
    updateHistory([term, ...history.filter((item) => item !== term)].slice(0, 10))
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
            aria-label="전체 검색"
            placeholder="전체 검색"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setSearchTerm(event.target.value.trim())
            }}
            autoFocus
          />
        </S.InputWrapper>
        <S.TextButton type="button" onClick={onCancel}>취소</S.TextButton>
      </S.SearchRow>
      {keyword.trim() ? (
        <section aria-label="검색 결과">
          <S.Heading>검색 결과</S.Heading>
          <BoothCardList booths={booths} onSelectBooth={(id) => {
            search(keyword)
            onSelectBooth(id)
          }} />
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
