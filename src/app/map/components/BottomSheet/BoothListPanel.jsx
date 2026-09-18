import { useState } from 'react'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import * as S from './BoothListPanel.styles'
import search from '../../../../assets/map/search.svg'
import { useMapZoneBooths } from '../../hooks/useMapZones'

// 2026-09-18 리팩토링: boothResponses.json을 여기서 직접 import해서 날짜/시간대만
// 걸러 쓰던 로직을 useMapZoneBooths 훅으로 통일함.
// - 전엔 zone 필터가 아예 빠져있어서(카테고리만 거름) 구역을 바꿔도 부스 목록이 그대로였음
//   → 훅이 zoneId를 이미 반영해서 응답을 주기 때문에 자동으로 해결됨
// - mock ↔ 실제 API 전환 지점이 api/map.js 한 곳으로 통일됨(여기 컴포넌트는 백엔드 붙어도 안 건드림)
export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
  const [listTimeOfDay, setListTimeOfDay] = useState('day')
  const [selectedCategory, setSelectedCategory] = useState(null)

  const { booths: zoneBooths, isLoading, isError } = useMapZoneBooths({ timeSlot: listTimeOfDay })

  const booths = zoneBooths.filter(
    (booth) => selectedCategory === null || booth.category === selectedCategory
  )

  if (isSearching) {
    return <BoothSearchPanel booths={zoneBooths} onSelectBooth={onSelectBooth} onCancel={onCancelSearch} />
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
      {isLoading ? (
        <S.StatusMessage>부스 목록을 불러오는 중이에요...</S.StatusMessage>
      ) : isError ? (
        <S.StatusMessage>부스 목록을 불러오지 못했어요. 잠시 후 다시 시도해주세요.</S.StatusMessage>
      ) : (
        <BoothCardList booths={booths} onSelectBooth={onSelectBooth} />
      )}
    </>
  )
}
