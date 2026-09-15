// TODO: API 연동 후 제거 — 목록 UI 확인용 임시 데이터
export const LOST_FOUND_DATES = ['9/29', '9/30', '10/1']

const KEYWORDS = ['핸드폰케이스', '검정색', '아이폰14pro']

export const MOCK_LOST_FOUND = [
  { id: 1, date: '9/29', title: '대운동장 핸드폰케이스', keywords: KEYWORDS, imageUrl: null },
  { id: 2, date: '9/29', title: '경영관 3층 볼펜', keywords: KEYWORDS, imageUrl: null },
  ...Array.from({ length: 30 }, (_, i) => ({
    id: i + 3,
    date: '9/29',
    title: '대운동장 분실물',
    keywords: KEYWORDS,
    imageUrl: null,
  })),
]
