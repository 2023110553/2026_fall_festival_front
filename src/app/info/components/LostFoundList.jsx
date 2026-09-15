import EmptyState from '../../../components/common/EmptyState'
import * as S from './LostFoundList.styles'

const DATES = [
  { value: '9/29', label: '9/29' },
  { value: '9/30', label: '9/30' },
  { value: '10/1', label: '10/1' },
]

export default function LostFoundList({
  items = [],
  date,
  keyword,
  onDateChange,
  onKeywordChange,
  onSelect,
}) {
  return (
    <S.Stack>
      <S.SearchWrap>
        <S.SearchIcon aria-hidden="true">⌕</S.SearchIcon>
        <S.Search
          type="search"
          value={keyword}
          placeholder="전체 검색"
          aria-label="분실물 전체 검색"
          onChange={(event) => onKeywordChange(event.target.value)}
        />
      </S.SearchWrap>

      <S.FilterRow>
        <S.DateFilters aria-label="분실물 습득 날짜">
          {DATES.map((item) => (
            <S.DateFilter
              key={item.value}
              type="button"
              $selected={date === item.value}
              aria-pressed={date === item.value}
              onClick={() => onDateChange(item.value)}
            >
              {item.label}
            </S.DateFilter>
          ))}
        </S.DateFilters>
        <S.FilterHint>*습득된 날짜입니다.</S.FilterHint>
      </S.FilterRow>

      {items.length ? (
        <S.List>
          {items.map((item) => (
            <S.Card key={item.id} type="button" onClick={() => onSelect(item.id)}>
              <S.Body>
                <S.TitleRow>
                  <S.DateBadge>{item.date}</S.DateBadge>
                  <strong>{item.title}</strong>
                </S.TitleRow>
                <S.Hashtags>
                  {item.hashtags?.map((hashtag) => (
                    <span key={hashtag}>{hashtag}</span>
                  ))}
                </S.Hashtags>
              </S.Body>
              <S.Thumbnail>
                {item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>사진</span>}
              </S.Thumbnail>
            </S.Card>
          ))}
        </S.List>
      ) : (
        <EmptyState>검색 결과가 없습니다.</EmptyState>
      )}
    </S.Stack>
  )
}
