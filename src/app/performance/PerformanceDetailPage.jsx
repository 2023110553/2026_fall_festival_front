import {
    useNavigate,
    useParams,
} from 'react-router-dom'

import PerformanceInfo from './components/PerformanceInfo'
import Setlist from './components/Setlist'

import performanceThumbnail from './assets/performance-thumbnail.png'

import * as S from './PerformanceDetailPage.styles'

// TODO(API): 공연 상세 조회 API 연결 후 제거
const SAMPLE_PERFORMANCES = {
    5: {
        performance_id: 5,

        team_name: '음샘',

        affiliation: '밴드동아리',

        description:
            '출연진 소개 텍스트',

        image_url:
            performanceThumbnail,

        festival_date:
            '2026-09-29',

        start_at:
            '2026-09-29T16:00:00',

        end_at:
            '2026-09-29T17:00:00',

        songs: [
            {
                song_id: 1,
                title: 'The Volunteer',
                artist: 'S.A.D',
                sort_order: 1,
            },
            {
                song_id: 2,
                title: 'Heroine',
                artist: 'back number',
                sort_order: 2,
            },
            {
                song_id: 3,
                title:
                    'kimi wa Rock Wo Kikanai',
                artist: 'aimyon',
                sort_order: 3,
            },
            {
                song_id: 4,
                title: '집',
                artist: '한로로',
                sort_order: 4,
            },
        ],
    },
}

export default function PerformanceDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()

    // TODO(API):
    // GET 공연 상세 조회 API에 id 전달
    const performance =
        SAMPLE_PERFORMANCES[id]

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