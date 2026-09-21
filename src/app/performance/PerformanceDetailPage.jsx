import {
    Navigate,
    useNavigate,
    useParams,
} from 'react-router-dom'

import PerformanceInfo from './components/PerformanceInfo'
import Setlist from './components/Setlist'

import { getMockPerformanceById } from './mocks/performanceMock'

import { useTranslation } from '../../i18n/useTranslation'
import * as S from './PerformanceDetailPage.styles'

export default function PerformanceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const performance = getMockPerformanceById(id)

    // Guard direct URLs as well as card navigation.
    if (performance?.has_setlist === false) {
        return <Navigate to={`/performance?date=${performance.festival_date}`} replace />
    }

    return (
        <S.Page>
            <S.DetailHeader>
                <S.BackButton
                    type="button"
                    aria-label={t('common.back')}
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    <S.BackIcon />
                </S.BackButton>

                <S.HeaderTitle>
                    {t('performance.detail')}
                </S.HeaderTitle>
            </S.DetailHeader>

            <S.DetailPanel>
                {!performance ? (
                    <S.EmptyText>
                        {t('performance.notFound')}
                    </S.EmptyText>
                ) : (
                    <>
                        <PerformanceInfo
                            performance={
                                performance
                            }
                        />

                        <S.Divider />

                        <S.SetlistSection>
                            <S.SectionTitle>
                                {t('performance.setlist')}
                            </S.SectionTitle>

                            <Setlist
                                songs={
                                    performance.songs
                                }
                            />
                        </S.SetlistSection>
                    </>
                )}
            </S.DetailPanel>
        </S.Page>
    )
}