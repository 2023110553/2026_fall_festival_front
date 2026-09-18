// 시간대별 타임라인 인디케이터 + 공연 리스트
import * as S from './TimelineList.styles'

export default function TimelineList({ performances = [], onSelect }) {
  return (
    <S.List>
      {performances.map((p) => (
        <S.Item key={p.id} $isNow={p.isNow}>
          <S.Time $isNow={p.isNow}>{p.time}</S.Time>
          <S.Card type="button" $isNow={p.isNow} onClick={() => onSelect(p.id)}>
            <S.Left>
              <S.Thumb />
              <S.TextGroup>
                <S.Name>{p.name}</S.Name>
                <S.Category>{p.category}</S.Category>
              </S.TextGroup>
            </S.Left>
            <S.Chevron />
          </S.Card>
        </S.Item>
      ))}
    </S.List>
  )
}