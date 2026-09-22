import { useEffect, useState } from 'react'
import {
    Navigate,
    useNavigate,
    useParams,
} from 'react-router-dom'

import PerformanceInfo from './components/PerformanceInfo'
import Setlist from './components/Setlist'

import { getPerformanceDetail } from '../../api/performance'

import { useTranslation } from '../../i18n/useTranslation'
import * as S from './PerformanceDetailPage.styles'

const INITIAL_STATE = {
    performance: null,
    isLoading: true,
    notFound: false,
}

// 2026-09-22: 목데이터(getMockPerformanceById) 연동 해제, GET /api/performances/{id}/ 로 교체.
export default function PerformanceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const [state, setState] = useState(INITIAL_STATE)

    useEffect(() => {
        const controller = new AbortController()
        setState(INITIAL_STATE)

        getPerformanceDetail(id, { signal: controller.signal })
            .then(({ data: response }) => {
                if (response?.success !== true || !response.data) {
                    throw new Error('Invalid performance detail response')
                }
                setState({
                    performance: response.data,
                    isLoading: false,
                    notFound: false,
                })
            })
            .catch((error) => {
                if (controller.signal.aborted) return
                setState({
                    performance: null,
                    isLoading: false,
                    notFound: error?.response?.status === 404,
                })
            })

        return () => controller.abort()
    }, [id])

    const { performance, isLoading, notFound } = state

    // 셋리스트 없는 공연(has_setlist: false)은 상세 화면이 없다 — URL 직접 접근도 함께 막는다.
    if (performance?.has_setlist === false) {
        return <Navigate to={`/performance?date=${performance.festival_date}`} replace />
    }

    if (notFound) {
        return <Navigate to="/performance" replace />
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
                {isLoading ? (
                    <S.EmptyText>
                        {t('performance.loading')}
                    </S.EmptyText>
                ) : !performance ? (
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
