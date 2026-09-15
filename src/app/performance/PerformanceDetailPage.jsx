import { useNavigate, useParams } from 'react-router-dom'

import PerformanceInfo from './components/PerformanceInfo'
import Setlist from './components/Setlist'
import * as S from './PerformanceDetailPage.styles'

// TODO(API): 실제 공연 상세 데이터 연결 후 제거
const SAMPLE_PERFORMANCES = {
    1: {
        id: 1,
        name: '음샘',
        category: '밴드동아리',
        time: '16:00 - 17:00',
        setlist: [
            'The Volunteer - S.A.D',
            'Heroine - back number',
            'kimi wa Rock Wo Kikanai - aimyon',
            'ㅈㅣㅂ - 한로로',
            'The Volunteer - S.A.D',
        ],
    },
}

export default function PerformanceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    // TODO(API): id를 이용해 공연 상세 데이터 조회
    const performance = SAMPLE_PERFORMANCES[id]

    return (
        <S.Page>
            <S.DetailHeader>
                <S.BackButton
                    type="button"
                    aria-label="뒤로가기"
                    onClick={() => navigate(-1)}
                >
                    <S.BackIcon />
                </S.BackButton>

                <S.HeaderTitle>공연 상세</S.HeaderTitle>
            </S.DetailHeader>

            <S.DetailPanel>
                {!performance ? (
                    <S.EmptyText>
                        진행 중인 공연이 없어요.
                    </S.EmptyText>
                ) : (
                    <>
                        <PerformanceInfo
                            performance={performance}
                        />

                        <S.Divider />

                        <S.SetlistSection>
                            <S.SectionTitle>
                                공연순서
                            </S.SectionTitle>

                            <Setlist
                                songs={performance.setlist}
                            />
                        </S.SetlistSection>
                    </>
                )}
            </S.DetailPanel>
        </S.Page>
    )
}