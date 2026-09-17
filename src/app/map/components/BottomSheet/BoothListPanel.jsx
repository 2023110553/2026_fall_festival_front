import { useState } from 'react'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import * as S from './BoothListPanel.styles'
import mockBoothImage from '../../../performance/assets/performance-thumbnail.png'
import search from '../../../../assets/map/search.svg'
import mockResponses from '../../mocks/boothResponses.json'
import { useMapContext } from '../../context/MapProvider'

export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
const [listTimeOfDay, setListTimeOfDay] = useState('day')

  const { selectedDate } = useMapContext()
  const [selectedCategory, setSelectedCategory] = useState(null)

  const response = mockResponses.find(
    (item) =>
      item.data.festival_date === (selectedDate ?? '2026-10-01') &&
      item.data.time_slot === (listTimeOfDay === 'day' ? 'DAY' : 'NIGHT')
  )

  const booths = (response?.data.booths ?? []).filter(
    (booth) =>
      selectedCategory === null ||
      booth.category === selectedCategory
  )

  if (isSearching) {
    return <BoothSearchPanel onSelectBooth={onSelectBooth} onCancel={onCancelSearch} />
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
        {listTimeOfDay === 'day' ? '12:00-17:00' : `17:00-22:00`}
      </S.Time>
    </S.TimeWrapper>

    <S.Divider />
      <S.CategoryList>
        {BOOTH_CATEGORIES.map((category) => (
          <S.CategoryButton
            key={category.value}
            $active={selectedCategory === category.value}
            aria-pressed={selectedCategory === category.value}
            onClick={() =>
              setSelectedCategory((previous) =>
                previous === category.value ? null : category.value
              )
            }
          >
            {category.label}
          </S.CategoryButton>        
        ))}
      </S.CategoryList>
      <BoothCardList booths={booths} onSelectBooth={onSelectBooth} />
    </>
  )
}
