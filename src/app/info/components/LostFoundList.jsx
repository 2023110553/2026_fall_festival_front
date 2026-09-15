import EmptyState from '../../../components/common/EmptyState'
import SegmentedTabs from '../../../components/common/SegmentedTabs'
import * as S from './LostFoundList.styles'

const DATES=[
  {value:'9/29',label:'29일'},
  {value:'9/30',label:'30일'},
  {value:'10/1',label:'1일'},
]

export default function LostFoundList({items=[],date,keyword,onDateChange,onKeywordChange,onSelect}){
  return <S.Stack>
    <S.Heading><h2>분실물 안내</h2><p>습득 날짜와 이름으로 분실물을 찾아보세요.</p></S.Heading>
    <SegmentedTabs items={DATES} value={date} onChange={onDateChange} ariaLabel="분실물 습득 날짜" selectedWidth="120px" />
    <S.Search type="search" value={keyword} placeholder="분실물 키워드 검색" aria-label="분실물 키워드 검색" onChange={(event)=>onKeywordChange(event.target.value)}/>
    {items.length?<S.List>{items.map((item)=><S.Card key={item.id} type="button" onClick={()=>onSelect(item.id)}><S.Thumbnail/><S.Body><strong>{item.title}</strong><span>{item.date} · {item.location}</span></S.Body><S.Chevron>›</S.Chevron></S.Card>)}</S.List>:<EmptyState>검색 결과가 없습니다.</EmptyState>}
  </S.Stack>
}
