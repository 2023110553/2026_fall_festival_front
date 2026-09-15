import mockCortis from '../../../../assets/admin/mockCortis.svg'

const CONTENT =
  '2026년 9월 9일 동국대학교 대동제의 아티스트로 코르티스가 초청되었습니다. 이번 공연은 대동제 둘째 날 저녁에 진행되며, 관람 구역과 입장 방법은 추후 공지를 통해 안내드릴 예정입니다. 기존 게시물을 확인하고 관람할 방법을 찾아보세요.'

export const MOCK_NOTICES = [
  {
    id: 1,
    type: 'URGENT',
    title: '[9/30]동국대학교 가을 대동제에 코르티스가 온다고?',
    content: CONTENT,
    imageUrl: mockCortis,
  },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: i + 2,
    type: 'NORMAL',
    title: '동국대학교 가을 대동제에 코르티스가 온다고?',
    content: CONTENT,
    imageUrl: mockCortis,
  })),
]

export const NOTICE_TYPE_LABEL = {
  URGENT: '긴급 공지',
  NORMAL: '일반 공지',
}
