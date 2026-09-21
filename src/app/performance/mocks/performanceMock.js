export const MOCK_SERVER_TIME =
    '2026-09-29T16:30:00'

export const MOCK_PERFORMANCES = [
    {
        performance_id: 1,
        has_setlist: true,
        team_name: '음샘',
        affiliation: '밴드동아리',

        description:
            '음샘 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-09-29',

        start_at:
            '2026-09-29T16:00:00',

        end_at:
            '2026-09-29T17:00:00',

        is_live: true,

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
        ],
    },

    {
        performance_id: 2,
        has_setlist: true,
        team_name: '소리터',
        affiliation: '풍물패',

        description:
            '소리터 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-09-29',

        start_at:
            '2026-09-29T17:30:00',

        end_at:
            '2026-09-29T18:15:00',

        is_live: false,

        songs: [
            {
                song_id: 4,
                title: '사물놀이 판굿',
                artist: null,
                sort_order: 1,
            },
        ],
    },

    {
        performance_id: 3,
        has_setlist: false,
        team_name: '초대가수 A',
        affiliation: null,

        description:
            '초대가수 A 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-09-29',

        start_at:
            '2026-09-29T19:00:00',

        end_at:
            '2026-09-29T20:00:00',

        is_live: false,

        songs: [],
    },

    {
        performance_id: 4,
        has_setlist: true,
        team_name: '댄스동아리 하이킥',
        affiliation: '중앙동아리',

        description:
            '댄스동아리 하이킥 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-09-30',

        start_at:
            '2026-09-30T16:30:00',

        end_at:
            '2026-09-30T17:10:00',

        is_live: false,

        songs: [
            {
                song_id: 5,
                title: 'Magnetic',
                artist: 'ILLIT',
                sort_order: 1,
            },
            {
                song_id: 6,
                title: 'Supernova',
                artist: 'aespa',
                sort_order: 2,
            },
        ],
    },

    {
        performance_id: 5,
        has_setlist: true,
        team_name: '어쿠스틱 소모임',
        affiliation: '음악동아리',

        description:
            '어쿠스틱 소모임 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-09-30',

        start_at:
            '2026-09-30T18:00:00',

        end_at:
            '2026-09-30T18:50:00',

        is_live: false,

        songs: [
            {
                song_id: 7,
                title: '밤편지',
                artist: '아이유',
                sort_order: 1,
            },
            {
                song_id: 8,
                title:
                    '모든 날, 모든 순간',
                artist: '폴킴',
                sort_order: 2,
            },
        ],
    },

    {
        performance_id: 6,
        has_setlist: true,
        team_name: '졸업생 밴드',
        affiliation: '동문',

        description:
            '졸업생 밴드 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-10-01',

        start_at:
            '2026-10-01T17:00:00',

        end_at:
            '2026-10-01T17:50:00',

        is_live: false,

        songs: [
            {
                song_id: 9,
                title: '청춘',
                artist: '산울림',
                sort_order: 1,
            },
        ],
    },

    {
        performance_id: 7,
        has_setlist: false,
        team_name: '초대가수 B',
        affiliation: null,

        description:
            '초대가수 B 공연입니다. (목업 데이터)',

        image_url: null,

        festival_date:
            '2026-10-01',

        start_at:
            '2026-10-01T19:30:00',

        end_at:
            '2026-10-01T20:40:00',

        is_live: false,

        songs: [],
    },
]

// 홈 공연 현황용 mock API 응답
export const MOCK_NOW_RESPONSE = {
    success: true,

    code:
        'PERFORMANCE_NOW_SUCCESS',

    message:
        '현재 공연 정보를 조회했습니다.',

    data: {
        server_time:
            MOCK_SERVER_TIME,

        // 현재 서버 시간이 9/29이므로
        // 9/29 공연만 반환
        performances: getMockNowPerformances(MOCK_SERVER_TIME),
    },
}

export function getMockPerformanceById(id) {
    return MOCK_PERFORMANCES.find(
        (performance) =>
            performance.performance_id ===
            Number(id)
    )
}
// Shared list-item shape for the timetable and now-playing mocks.
export function getMockPerformanceList(festivalDate, serverTime = MOCK_SERVER_TIME) {
    const now = new Date(serverTime).getTime()
    return MOCK_PERFORMANCES
        .filter((p) => p.festival_date === festivalDate)
        .sort((a, b) => new Date(a.start_at) - new Date(b.start_at) || a.performance_id - b.performance_id)
        .map((p) => ({
            performance_id: p.performance_id,
            team_name: p.team_name,
            affiliation: p.affiliation,
            image_url: p.image_url,
            start_at: p.start_at,
            end_at: p.end_at,
            has_setlist: p.has_setlist,
            is_live: new Date(p.start_at).getTime() <= now && now < new Date(p.end_at).getTime(),
        }))
}

export function getMockNowPerformances(serverTime = MOCK_SERVER_TIME) {
    const date = new Date(serverTime)
    const now = date.getTime()
    const festivalDate = typeof serverTime === 'string'
        ? serverTime.slice(0, 10)
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    const remaining = getMockPerformanceList(festivalDate, serverTime)
        .filter((p) => new Date(p.end_at).getTime() > now)
    if (!remaining.length || new Date(remaining[0].start_at).getTime() - now > 60 * 60 * 1000) return []
    return remaining.slice(0, 3)
}
