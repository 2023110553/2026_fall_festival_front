import lostWalletImage from '../../assets/info/lost-wallet.svg'
import lostEarbudsImage from '../../assets/info/lost-earbuds.svg'
import lostUmbrellaImage from '../../assets/info/lost-umbrella.svg'
import lostStudentIdImage from '../../assets/info/lost-student-id.svg'

const LOST_ITEM_DETAILS = [
  {
    lost_item_id: 1,
    title: '대운동장 검은색 카드지갑',
    found_date: '2026-09-29',
    image_urls: [lostWalletImage],
    tags: ['카드지갑', '검은색', '대운동장', '학생증'],
    created_at: '2026-09-29T14:20:11',
    instagram_url: 'https://www.instagram.com/',
  },
  {
    lost_item_id: 2,
    title: '푸드트럭 존 흰색 무선 이어폰',
    found_date: '2026-09-29',
    image_urls: [lostEarbudsImage],
    tags: ['무선이어폰', '흰색', '푸드트럭존'],
    created_at: '2026-09-29T16:05:00',
    instagram_url: 'https://www.instagram.com/',
  },
  {
    lost_item_id: 3,
    title: '혜화관 입구 파란색 우산',
    found_date: '2026-09-30',
    image_urls: [lostUmbrellaImage],
    tags: ['우산', '파란색', '혜화관', '장우산'],
    created_at: '2026-09-30T12:40:00',
    instagram_url: 'https://www.instagram.com/',
  },
  {
    lost_item_id: 4,
    title: '만해광장 안내 부스 학생증',
    found_date: '2026-10-01',
    image_urls: [lostStudentIdImage],
    tags: ['학생증', '만해광장', '안내부스'],
    created_at: '2026-10-01T10:15:00',
    instagram_url: 'https://www.instagram.com/',
  },
]

const toListItem = ({
  lost_item_id,
  title,
  found_date,
  image_urls,
  tags,
  created_at,
}) => ({
  lost_item_id,
  title,
  found_date,
  thumbnail_url: image_urls[0] ?? null,
  tags: tags.slice(0, 3),
  created_at,
})

export const LOST_ITEM_LIST_BAD_REQUEST_MOCK = {
  success: false,
  code: 'INVALID_REQUEST_PARAM',
  message: '요청 파라미터가 올바르지 않습니다.',
  errors: {
    found_date: '날짜 형식이 올바르지 않습니다. (YYYY-MM-DD)',
  },
}

export const LOST_ITEM_DETAIL_NOT_FOUND_MOCK = {
  success: false,
  code: 'LOST_ITEM_NOT_FOUND',
  message: '해당 분실물을 찾을 수 없습니다.',
  errors: {},
}

export const getLostItemListMock = ({
  found_date: foundDate,
  keyword = '',
  page = 0,
  size = 20,
} = {}) => {
  const hasInvalidDate = foundDate !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(foundDate)
  const hasInvalidPage = !Number.isInteger(page) || page < 0
  const hasInvalidSize = !Number.isInteger(size) || size < 1 || size > 100

  if (hasInvalidDate || hasInvalidPage || hasInvalidSize) {
    return LOST_ITEM_LIST_BAD_REQUEST_MOCK
  }

  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredItems = LOST_ITEM_DETAILS.filter((item) => {
    const matchesDate = !foundDate || item.found_date === foundDate
    const searchableText = `${item.title} ${item.tags.join(' ')}`.toLowerCase()
    return matchesDate && (!normalizedKeyword || searchableText.includes(normalizedKeyword))
  })
  const startIndex = page * size
  const items = filteredItems.slice(startIndex, startIndex + size).map(toListItem)

  return {
    success: true,
    code: 'LOST_ITEM_LIST_SUCCESS',
    message: '분실물 목록을 조회했습니다.',
    data: {
      total_count: filteredItems.length,
      page,
      size,
      has_next: startIndex + size < filteredItems.length,
      items,
    },
  }
}

export const getLostItemDetailMock = (lostItemId) => {
  const item = LOST_ITEM_DETAILS.find(
    (lostItem) => lostItem.lost_item_id === Number(lostItemId),
  )

  if (!item) return LOST_ITEM_DETAIL_NOT_FOUND_MOCK

  return {
    success: true,
    code: 'LOST_ITEM_DETAIL_SUCCESS',
    message: '분실물 상세 정보를 조회했습니다.',
    data: item,
  }
}
