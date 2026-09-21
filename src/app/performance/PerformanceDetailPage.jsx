import {
    Navigate,
    useNavigate,
    useParams,
} from 'react-router-dom'

import PerformanceInfo from './components/PerformanceInfo'
import Setlist from './components/Setlist'

import { getMockPerformanceById } from './mocks/performanceMock'

import * as S from './PerformanceDetailPage.styles'

export default function PerformanceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

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
                    aria-label="뒤로가기"
                    onClick={() =>
                        navigate(-1)
                    }
                >
                    <S.BackIcon />
                </S.BackButton>

                <S.HeaderTitle>
                    공연 상세
                </S.HeaderTitle>
            </S.DetailHeader>

            <S.DetailPanel>
                {!performance ? (
                    <S.EmptyText>
                        공연을 찾을 수 없습니다.
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
                                공연순서
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