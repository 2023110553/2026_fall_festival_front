import * as S from './TimelineList.styles'
import { formatTime } from '../../../utils/time'

export default function TimelineList({ performances = [], onSelect }) {
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
            onClick={() => onSelect(p.performance_id)}
          >
            <S.Left>
              <S.Thumb />
              <S.TextGroup>
                <S.Name>{p.team_name}</S.Name>
                {p.affiliation && <S.Category>{p.affiliation}</S.Category>}
              </S.TextGroup>
            </S.Left>
            <S.Chevron />
          </S.Card>
        </S.Item>
      ))}
    </S.List>
  )
}