import { apiClient } from './client'

export const getNoticeList = (
  { type, page = 0, size = 20 } = {},
  { signal } = {},
) =>
  apiClient.get('/api/notices/', {
    params: { type: type || undefined, page, size },
    signal,
    skipUserAuth: true,
  })

export const getNoticeDetail = (noticeId, { signal } = {}) =>
  apiClient.get(`/api/notices/${noticeId}/`, { signal, skipUserAuth: true })

export const getLostItemList = (
  { foundDate, keyword, page = 0, size = 20 } = {},
  { signal } = {},
) =>
  apiClient.get('/api/lost-items/', {
    params: {
      found_date: foundDate || undefined,
      keyword: keyword?.trim() || undefined,
      page,
      size,
    },
    signal,
    skipUserAuth: true,
  })

export const getLostItemDetail = (lostItemId, { signal } = {}) =>
  apiClient.get(`/api/lost-items/${lostItemId}/`, { signal, skipUserAuth: true })
