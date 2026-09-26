import { useMapContext } from '../../context/MapProvider'
import { BOOTH_FILTER_CHIPS } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import * as S from './BoothListPanel.styles'
import search from '../../../../assets/map/search.svg'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
  const { t } = useTranslation()
  const { booths, isLoading, isError, listError, listTimeOfDay, setListTimeOfDay,
    selectedCategory, setSelectedCategory } = useMapContext()

  if (isSearching) {
    return <BoothSearchPanel timeSlot={listTimeOfDay} onSelectBooth={onSelectBooth} onCancel={onCancelSearch} />
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
          <S.Search src={search} alt="" />
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
        <S.StatusMessage>{t('map.loadingBooths')}</S.StatusMessage>
      ) : isError ? (
        <S.StatusMessage>{listError}</S.StatusMessage>
      ) : (
        <BoothCardList filterBySearchTerm={false} booths={booths} onSelectBooth={onSelectBooth} />
      )}
    </>
  )
}
