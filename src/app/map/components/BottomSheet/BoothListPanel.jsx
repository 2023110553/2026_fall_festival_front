import { useMapContext } from '../../context/MapProvider'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import * as S from './BoothListPanel.styles'
import search from '../../../../assets/map/search.svg'

export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
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
          <S.Button type="button" $active={listTimeOfDay === 'day'} aria-pressed={listTimeOfDay === 'day'} onClick={() => setListTimeOfDay('day')}>주간</S.Button>
          <S.Button type="button" $active={listTimeOfDay === 'night'} aria-pressed={listTimeOfDay === 'night'} onClick={() => setListTimeOfDay('night')}>야간</S.Button>
        </S.ButtonWrapper>
        <S.SearchButton type="button" onClick={onOpenSearch} aria-label="검색 열기" title="검색 열기">
          <S.Search src={search} alt="" />
        </S.SearchButton>
      </S.Top>
      <S.Time>
        {listTimeOfDay === 'day' ? '11:00-16:30' : '17:30-22:00'}
      </S.Time>
    </S.TimeWrapper>

    <S.Divider />
      <S.CategoryList>
        {BOOTH_CATEGORIES.map((category) => (
          <S.CategoryButton
            key={category.value}
            $active={selectedCategory === category.value}
            aria-pressed={selectedCategory === category.value}
            onClick={() => setSelectedCategory(selectedCategory === category.value ? null : category.value)}
          >
            {category.label}
          </S.CategoryButton>
        ))}
      </S.CategoryList>
      {isLoading ? (
        <S.StatusMessage>부스 목록을 불러오는 중이에요...</S.StatusMessage>
      ) : isError ? (
        <S.StatusMessage>{listError}</S.StatusMessage>
      ) : (
        <BoothCardList filterBySearchTerm={false} booths={booths} onSelectBooth={onSelectBooth} />
      )}
    </>
  )
}