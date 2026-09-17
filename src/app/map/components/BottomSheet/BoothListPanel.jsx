import { useState } from 'react'
import { BOOTH_CATEGORIES } from '../../../../constants/categories'
import BoothCardList from '../BoothCardList/BoothCardList'
import BoothSearchPanel from './BoothSearchPanel'
import * as S from './BoothListPanel.styles'
import mockBoothImage from '../../../performance/assets/performance-thumbnail.png'
import search from '../../../../assets/map/search.svg'

// 실제 부스 사진이 준비되면 각 imageUrl을 교체
const MOCK_BOOTHS = [
  {
    id: 1,
    name: '멋쟁이사자처럼 주점',
    department: '사회과학대학 광고홍보학과',
    location: '명진관 3번 부스',
    category: 'alcohol',
    lanternCount: 32,
    hasMyLantern: true,
    imageUrl: mockBoothImage,
  },
  {
    id: 2,
    name: '가을밤 포차',
    department: '경영대학 경영학과',
    location: '명진관 4번 부스',
    category: 'alcohol',
    lanternCount: 18,
    hasMyLantern: false,
    imageUrl: mockBoothImage,
  },
  {
    id: 3,
    name: '달빛 분식',
    department: '문과대학 국어국문학과',
    location: '팔정도 2번 부스',
    category: 'booth',
    lanternCount: 7,
    hasMyLantern: false,
    imageUrl: mockBoothImage,
  },
  {
    id: 4,
    name: '캠퍼스 사진관',
    department: '예술대학 영화영상학과',
    location: '팔정도 5번 부스',
    category: 'collab',
    lanternCount: 24,
    hasMyLantern: true,
    imageUrl: mockBoothImage,
  },
  {
    id: 5,
    name: '동빛/에코코 체험 부스',
    department: '축제 운영위원회',
    location: '명진관 1번 부스',
    category: 'eco',
    lanternCount: 0,
    hasMyLantern: false,
    imageUrl: mockBoothImage,
  },
]

export default function BoothListPanel({ onSelectBooth, isSearching, onOpenSearch, onCancelSearch }) {
const [listTimeOfDay, setListTimeOfDay] = useState('day')
  if (isSearching) {
    return <BoothSearchPanel booths={MOCK_BOOTHS} onSelectBooth={onSelectBooth} onCancel={onCancelSearch} />
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
          <S.CategoryButton key={category.value}>{category.label}</S.CategoryButton>
        ))}
      </S.CategoryList>
      <BoothCardList booths={MOCK_BOOTHS} onSelectBooth={onSelectBooth} />
    </>
  )
}
