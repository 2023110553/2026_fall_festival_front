import noticeStageImage from '../../assets/info/notice-stage.svg'

const NOTICE_DETAILS = [
  {
    notice_id: 3,
    type: 'URGENT',
    title: '우천으로 인한 팔정도 부스 운영 시간 변경 안내',
    content:
      '기상 악화로 인하여 팔정도 내 모든 부스의 야간 운영 시간이 21시에서 20시로 조기 마감됩니다. 학우 여러분의 양해 부탁드립니다.',
    image_url: noticeStageImage,
    created_at: '2026-09-29T11:00:00',
  },
  {
    notice_id: 2,
    type: 'NORMAL',
    title: '2026 대동제 셔틀버스 운영 노선 안내',
    content:
      '축제 기간 동안 학우 여러분의 편의를 위해 야간 셔틀버스를 증차 운행합니다. 자세한 운행 노선과 시간은 현장 안내를 확인해 주세요.',
    image_url: null,
    created_at: '2026-09-29T09:30:00',
  },
  {
    notice_id: 1,
    type: 'NORMAL',
    title: '축제장 입장 및 안전 수칙 안내',
    content:
      '혼잡 구역에서는 안전요원의 안내에 따라 이동해 주세요. 위험 물품은 행사장에 반입할 수 없습니다.',
    image_url: noticeStageImage,
    created_at: '2026-09-28T18:00:00',
  },
]

const toListItem = ({ notice_id, type, title, content, image_url, created_at }) => ({
  notice_id,
  type,
  title,
  preview_content: content.length > 60 ? `${content.slice(0, 60)}...` : content,
  has_image: Boolean(image_url),
  created_at,
})

export const NOTICE_LIST_BAD_REQUEST_MOCK = {
  success: false,
  code: 'INVALID_REQUEST_PARAM',
  message: '요청 파라미터가 올바르지 않습니다.',
  errors: {},
}

export const NOTICE_DETAIL_NOT_FOUND_MOCK = {
  success: false,
  code: 'NOTICE_NOT_FOUND',
  message: '해당 공지사항을 찾을 수 없습니다.',
  errors: {},
}

export const getNoticeListMock = ({ type, page = 0, size = 20 } = {}) => {
  const hasInvalidType = type !== undefined && !['URGENT', 'NORMAL'].includes(type)
  const hasInvalidPage = !Number.isInteger(page) || page < 0
  const hasInvalidSize = !Number.isInteger(size) || size < 1

  if (hasInvalidType || hasInvalidPage || hasInvalidSize) {
    return NOTICE_LIST_BAD_REQUEST_MOCK
  }

  const filteredNotices = type
    ? NOTICE_DETAILS.filter((notice) => notice.type === type)
    : NOTICE_DETAILS
  const startIndex = page * size
  const items = filteredNotices.slice(startIndex, startIndex + size).map(toListItem)

  return {
    success: true,
    code: 'NOTICE_LIST_SUCCESS',
    message: '공지사항 목록을 조회했습니다.',
    data: {
      total_count: filteredNotices.length,
      page,
      size,
      has_next: startIndex + size < filteredNotices.length,
      items,
    },
  }
}

export const getNoticeDetailMock = (noticeId) => {
  const notice = NOTICE_DETAILS.find((item) => item.notice_id === Number(noticeId))

  if (!notice) return NOTICE_DETAIL_NOT_FOUND_MOCK

  return {
    success: true,
    code: 'NOTICE_DETAIL_SUCCESS',
    message: '공지사항 상세 정보를 조회했습니다.',
    data: notice,
  }
}

export const NOTICE_LIST_MOCK_RESPONSE = getNoticeListMock()
