import * as S from './PerformanceInfo.styles'

function formatTime(dateTime) {
    return dateTime
        ?.slice(11, 16)
}

export default function PerformanceInfo({
    performance,
}) {
    return (
        <S.Container>
            <S.Name>
                {performance.team_name}
            </S.Name>

            <S.Category>
                {performance.affiliation}
            </S.Category>

            <S.Time>
                {formatTime(
                    performance.start_at
                )}

                {' - '}

                {formatTime(
                    performance.end_at
                )}
            </S.Time>
        </S.Container>
    )
}