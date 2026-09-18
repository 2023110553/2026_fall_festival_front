import * as S from './NowPlaying.styles'

export default function NowPlaying({ performance }) {
    if (!performance) {
        return (
            <S.Card>
                <S.Empty>오늘 공연이 모두 종료되었어요.</S.Empty>
            </S.Card>
        )
    }

    const { name, category, time, progress } = performance
    const [start, end] = time.split(' - ')
    return (
        <S.Card>
            <S.Row>
                <S.Thumb />
                <S.TextGroup>
                    <S.Name>{name}</S.Name>
                    <S.Category>{category}</S.Category>
                </S.TextGroup>
            </S.Row>

            <S.ProgressArea>
                <S.TimeRow>
                    <span>{start}</span>
                    <span>{end}</span>
                </S.TimeRow>
                <S.Bar>
                    <S.Fill $percent={progress * 100} />
                </S.Bar>
            </S.ProgressArea>
        </S.Card>
    )
}