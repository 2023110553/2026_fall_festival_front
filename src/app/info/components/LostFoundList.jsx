import EmptyState from '../../../components/common/EmptyState'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './LostFoundList.styles'

const DATES = [
  { value: '2026-09-29', label: '9/29' },
  { value: '2026-09-30', label: '9/30' },
  { value: '2026-10-01', label: '10/1' },
]

export default function LostFoundList({
  items = [],
  date,
  keyword,
  isLoading = false,
  error = '',
  onDateChange,
  onKeywordChange,
  onSelect,
}) {
  const { t } = useTranslation()

  return (
    <S.Stack>
      <S.SearchWrap>
        <S.SearchIcon aria-hidden="true">⌕</S.SearchIcon>
        <S.Search
          type="search"
          value={keyword}
          placeholder={t('lostFound.search')}
          aria-label={t('lostFound.searchLabel')}
          onChange={(event) => onKeywordChange(event.target.value)}
        />
      </S.SearchWrap>

      <S.FilterRow>
        <S.DateFilters aria-label={t('lostFound.dateLabel')}>
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
        <S.FilterHint>{t('lostFound.dateHint')}</S.FilterHint>
      </S.FilterRow>

      {isLoading && <EmptyState>{t('lostFound.loadingList')}</EmptyState>}
      {!isLoading && error && <EmptyState>{error}</EmptyState>}
      {!isLoading && !error && items.length ? (
        <S.List>
          {items.map((item) => (
            <S.Card
              key={item.lost_item_id}
              type="button"
              onClick={() => onSelect(item.lost_item_id)}
            >
              <S.Body>
                <S.TitleRow>
                  <S.DateBadge>
                    {item.found_date.slice(5).replace(/^0/, '').replace('-', '/')}
                  </S.DateBadge>
                  <strong>{item.title}</strong>
                </S.TitleRow>
                <S.Hashtags>
                  {item.tags?.map((tag) => (
                    <span key={tag}>#{tag}</span>
                  ))}
                </S.Hashtags>
              </S.Body>
              <S.Thumbnail>
                {item.thumbnail_url ? <img src={item.thumbnail_url} alt="" /> : <span>{t('lostFound.photo')}</span>}
              </S.Thumbnail>
            </S.Card>
          ))}
        </S.List>
      ) : !isLoading && !error ? (
        <EmptyState>{t('lostFound.noResults')}</EmptyState>
      ) : null}
    </S.Stack>
  )
}
