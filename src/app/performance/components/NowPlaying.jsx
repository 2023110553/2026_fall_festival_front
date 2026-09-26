import * as S from './NowPlaying.styles'
import { formatTime, getProgress } from '../../../utils/time'
import { useTranslation } from '../../../i18n/useTranslation'

export default function NowPlaying({ performance, now }) {
    const { t } = useTranslation()
    if (!now) {
        return null
    }

    if (!performance) {
        return (
            <S.Card>
                <S.Empty>{t('home.performanceEmpty')}</S.Empty>
            </S.Card>
        )
    }

    const { team_name, affiliation, image_url, start_at, end_at } = performance
    const progress = getProgress(now, start_at, end_at)

    return (
        <S.Card>
            <S.Row>
                {image_url
                    ? <S.Thumb as="img" src={image_url} alt="" />
                    : <S.Thumb />}
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