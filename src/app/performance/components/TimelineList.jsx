import * as S from './TimelineList.styles'
import { formatTime } from '../../../utils/time'

export default function TimelineList({ performances = [], onSelect }) {
  if (performances.length === 0) {
    return <S.Empty>등록된 공연이 없어요.</S.Empty>
  }
  return (
    <S.List>
      {performances.map((p) => (
        <S.Item key={p.performance_id} $isLive={p.is_live}>
          <S.Time $isLive={p.is_live}>
            {formatTime(p.start_at)} - {formatTime(p.end_at)}
          </S.Time>
          <S.Card
            type="button"
            $isLive={p.is_live}
            disabled={!p.has_setlist}
            onClick={() => onSelect(p.performance_id)}
          >
            <S.Left>
              <S.Thumb />
              <S.TextGroup>
                <S.Name>{p.team_name}</S.Name>
                {p.affiliation && <S.Category>{p.affiliation}</S.Category>}
              </S.TextGroup>
            </S.Left>
            {p.has_setlist && <S.Chevron aria-hidden="true" />}
          </S.Card>
        </S.Item>
      ))}
    </S.List>
  )
}