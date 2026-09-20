import formatTime from '../../home/utils/formatTime'

import * as S from './PerformanceInfo.styles'

export default function PerformanceInfo({
    performance,
}) {
    return (
        <S.Container>
            <S.Name>
                {performance.team_name}
            </S.Name>

            {performance.affiliation && (
                <S.Category>
                    {performance.affiliation}
                </S.Category>
            )}

            <S.Time>
                {formatTime(performance.start_at)}
                {' - '}
                {formatTime(performance.end_at)}
            </S.Time>
        </S.Container>
    )
}