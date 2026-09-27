import { festivalDay } from '../../../../analytics/policy'
import { useAnalyticsView } from '../../../../analytics/useAnalyticsView'
import { useMapContext } from '../../context/MapProvider'
import { BOOTH_FILTER_CHIPS } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import SearchIcon from './SearchIcon'
import * as S from './BoothListPanel.styles'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
  const { t } = useTranslation()
  const { selectedDate, allBooths, isLoading, isError, listError, listTimeOfDay, setListTimeOfDay,
    selectedCategory, setSelectedCategory } = useMapContext()

  useAnalyticsView('booth_list_opened', !isSearching, 'list', { festival_day: festivalDay(selectedDate) })
  useAnalyticsView('site_error_shown', !isSearching && isError, 'list', { error_type: 'load_failed' })
  if (isSearching) {
    return <BoothSearchPanel onSelectBooth={onSelectBooth} onCancel={onCancelSearch} />
  }

  return (
    <>
    <S.TimeWrapper>
      <S.Top>
        <S.ButtonWrapper>
          <S.Button type="button" $active={listTimeOfDay === 'day'} aria-pressed={listTimeOfDay === 'day'} onClick={() => setListTimeOfDay('day')}>{t('map.day')}</S.Button>
          <S.Button type="button" $active={listTimeOfDay === 'night'} aria-pressed={listTimeOfDay === 'night'} onClick={() => setListTimeOfDay('night')}>{t('map.night')}</S.Button>
        </S.ButtonWrapper>
        <S.SearchButton type="button" onClick={onOpenSearch} aria-label={t('map.openSearch')} title={t('map.openSearch')}>
          <SearchIcon isNight={listTimeOfDay === 'night'} />
        </S.SearchButton>
      </S.Top>
      <S.Time>
        {listTimeOfDay === 'day' ? '11:00 - 16:30' : '17:30 - 22:00'}
      </S.Time>
    </S.TimeWrapper>

    <S.Divider />
      <S.CategoryList>
        {BOOTH_FILTER_CHIPS.map((category) => (
          <S.CategoryButton
            key={category.value}
            $active={selectedCategory === category.value}
            aria-pressed={selectedCategory === category.value}
            onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
          >
            {t(category.labelKey)}
          </S.CategoryButton>
        ))}
      </S.CategoryList>
      {isLoading ? (
        <S.StatusMessage $isNight={listTimeOfDay === 'night'}>{t('map.loadingBooths')}</S.StatusMessage>
      ) : isError ? (
        <S.StatusMessage $isNight={listTimeOfDay === 'night'}>{listError}</S.StatusMessage>
      ) : (
        <BoothCardList
          booths={allBooths}
          onSelectBooth={onSelectBooth}
        />
      )}
    </>
  )
}
