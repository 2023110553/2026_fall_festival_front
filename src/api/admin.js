import { apiClient } from './client'

// 관리자 로그인 — 성공 시 받은 토큰을 useAdminAuthStore에 저장해서 AdminRoute 가드가 사용
export const adminLogin = (adminKey) => apiClient.post('/api/admin/login', { adminKey })

// 등불 관리
export const getAdminLanterns = (sort = 'report') => apiClient.get('/api/admin/lanterns', { params: { sort } })
export const deleteAdminLantern = (lanternId) => apiClient.delete(`/api/admin/lanterns/${lanternId}`)

// 공지 관리
export const getAdminNotices = () => apiClient.get('/api/admin/notices')
export const createAdminNotice = (payload) => apiClient.post('/api/admin/notices', payload)
export const updateAdminNotice = (noticeId, payload) => apiClient.put(`/api/admin/notices/${noticeId}`, payload)
export const deleteAdminNotice = (noticeId) => apiClient.delete(`/api/admin/notices/${noticeId}`)

// 분실물 관리
export const getAdminLostFound = () => apiClient.get('/api/admin/lost-found')
export const createAdminLostFound = (payload) => apiClient.post('/api/admin/lost-found', payload)
export const updateAdminLostFound = (itemId, payload) => apiClient.put(`/api/admin/lost-found/${itemId}`, payload)
export const deleteAdminLostFound = (itemId) => apiClient.delete(`/api/admin/lost-found/${itemId}`)
