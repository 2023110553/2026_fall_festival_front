import profileImage from '../../assets/info/dev-team-profile.png'

const createMember = (id, track, department, name) => ({ id, track, department, name, imageUrl: profileImage })

export const DEV_TEAM_MOCKS = [
  { id: 'leader', label: 'Leader', members: [createMember('leader-1', '축제기획단 총괄', '경영학과', '김리더')] },
  {
    id: 'pm-design', label: 'PM / DESIGN', members: [
      createMember('pm-1', '기획·디자인 총괄', '광고홍보학과', '정서현'),
      createMember('pm-2', '기획·디자인', '건축학전공', '오윤서'),
      createMember('pm-3', '기획·디자인', '경영학과', '이소이'),
      createMember('pm-4', '기획·디자인', '경영정보학과', '황사라'),
    ],
  },
  {
    id: 'front-end', label: 'FRONT-END', members: [
      createMember('front-1', '프론트엔드', '전기전자공학부', '고성채'),
      createMember('front-2', '프론트엔드', '컴퓨터공학전공', '김세진'),
      createMember('front-3', '프론트엔드', '산업시스템공학과', '김채현'),
      createMember('front-4', '프론트엔드', '경영학과', '이희수'),
      createMember('front-5', '프론트엔드', '컴퓨터·AI학부', '허현'),
    ],
  },
  {
    id: 'back-end', label: 'BACK-END', members: [
      createMember('back-1', '백엔드 총괄', '컴퓨터공학전공', '김백엔드'),
      createMember('back-2', '백엔드', '정보통신공학과', '이백엔드'),
      createMember('back-3', '백엔드', '산업시스템공학과', '박백엔드'),
      createMember('back-4', '백엔드', '컴퓨터공학전공', '최백엔드'),
      createMember('back-5', '백엔드', 'AI소프트웨어융합학부', '정백엔드'),
    ],
  },
]
