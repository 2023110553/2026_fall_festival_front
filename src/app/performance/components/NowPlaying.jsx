import * as S from './NowPlaying.styles'
import { formatTime, getProgress } from '../../../utils/time'


export default function NowPlaying({ performance, now }) {
    if (!performance) {
        return (
            <S.Card>
                <S.Empty>오늘 공연이 모두 종료되었어요.</S.Empty>
            </S.Card>
        )
    }

    const { team_name, affiliation, start_at, end_at } = performance
    const progress = getProgress(now.toISOString(), start_at, end_at)
    return (
        <S.Card>
            <S.Row>
                <S.Thumb />
                <S.TextGroup>
                    <S.Name>{team_name}</S.Name>
                    {affiliation && <S.Category>{affiliation}</S.Category>}
                </S.TextGroup>
            </S.Row>

            <S.ProgressArea>
                <S.TimeRow>
                    <span>{formatTime(start_at)}</span>
                    <span>{formatTime(end_at)}</span>
                </S.TimeRow>
                <S.Bar>
                    <S.Fill $percent={progress * 100} />
                </S.Bar>
            </S.ProgressArea>
        </S.Card>
    )
}