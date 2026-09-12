import { apiClient } from './client'

// 안내(ABOUT) 하위 4개 탭 — 협업 / 공지 / 분실물 / 개발진
export const getCollabList = () => apiClient.get('/api/info/collabs')
export const getCollabDetail = (collabId) => apiClient.get(`/api/info/collabs/${collabId}`)

export const getNoticeList = () => apiClient.get('/api/info/notices')
export const getNoticeDetail = (noticeId) => apiClient.get(`/api/info/notices/${noticeId}`)

export const getLostFoundList = (date, keyword) =>
  apiClient.get('/api/info/lost-found', { params: { date, keyword } })
export const getLostFoundDetail = (itemId) => apiClient.get(`/api/info/lost-found/${itemId}`)

export const getDevTeamList = () => apiClient.get('/api/info/dev-team')
