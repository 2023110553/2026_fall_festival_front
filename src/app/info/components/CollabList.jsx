import { useState } from 'react'
import * as S from './CollabList.styles'

export default function CollabList({ collabs = [], onSelect }) {
  const [expanded, setExpanded] = useState(false)
  const visibleCollabs = expanded ? collabs : collabs.slice(0, 3)
  return <S.Stack>
    <S.Heading><h2>함께하는 단체</h2><p>축제를 함께 만드는 협업 단체를 소개합니다.</p></S.Heading>
    <S.List>{visibleCollabs.map((item) => <S.Card key={item.id} type="button" onClick={() => onSelect(item.id)}><S.Thumbnail /><S.Body><strong>{item.name}</strong><span>{item.description}</span></S.Body><S.Chevron>›</S.Chevron></S.Card>)}</S.List>
    {collabs.length > 3 && <S.More type="button" onClick={() => setExpanded((value) => !value)}>{expanded ? '접어서 보기' : '펼쳐보기'}</S.More>}
  </S.Stack>
}
