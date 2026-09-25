import { apiClient } from './client'

export async function getRollingNotices({ signal } = {}) {
  const { data: response } = await apiClient.get('/api/notices/rolling/', { signal, skipUserAuth: true })

  if (
    response?.success !== true ||
    !Array.isArray(response.data?.notices) ||
    response.data.notices.some((notice) =>
      !Number.isInteger(notice?.notice_id) || notice.notice_id <= 0 ||
      !['URGENT', 'NORMAL'].includes(notice.type) ||
      typeof notice.title !== 'string' ||
      typeof notice.created_at !== 'string' ||
      !Number.isFinite(Date.parse(notice.created_at))
    )
  ) {
    throw new Error('공지사항 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}

export async function getBoothRanking({ signal } = {}) {
  const { data: response } = await apiClient.get('/api/booths/ranking/', {
    params: { limit: 3 },
    signal,
    skipUserAuth: true,
  })

  if (
    response?.success !== true ||
    !Array.isArray(response.data?.ranking) ||
    !Number.isInteger(response.data.total_lantern_count) || response.data.total_lantern_count < 0 ||
    response.data.ranking.some((booth) =>
      !Number.isInteger(booth?.rank) || booth.rank <= 0 ||
      !Number.isInteger(booth.booth_id) || booth.booth_id <= 0 ||
      typeof booth.name !== 'string' ||
      !Number.isInteger(booth.lantern_count) || booth.lantern_count < 0
    )
  ) {
    throw new Error('부스 랭킹 응답 형식이 올바르지 않습니다.')
  }

  return response.data
}
