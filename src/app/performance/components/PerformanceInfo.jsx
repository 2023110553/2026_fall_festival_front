import * as S from './PerformanceInfo.styles'

export default function PerformanceInfo({ performance }) {
    return (
        <S.Container>
            <S.Name>
                {performance.name}
            </S.Name>

            <S.Category>
                {performance.category}
            </S.Category>

            <S.Time>
                {performance.time}
            </S.Time>
        </S.Container>
    )
}