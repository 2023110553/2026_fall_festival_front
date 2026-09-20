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
// 목록 조회 — found_date 미지정 시 전체, page는 0부터, size는 최대 100 (기본 20)
// 응답 data: { total_count, page, size, has_next, items: [{ lost_item_id, title, found_date, thumbnail_url, tags, created_at }] }
// tags는 작성(sort_order) 순 상위 3개, thumbnail_url은 이미지 없으면 null
export const getAdminLostItems = ({ foundDate, page = 0, size = 20 } = {}) =>
  apiClient.get('/api/lost-items/', { params: { found_date: foundDate, page, size } })

// 상세 조회 — 목록과 달리 tags는 개수 제한 없이 전체, images/tags 모두 객체 배열(sort_order 포함)
// 응답 data: { lost_item_id, title, found_date, images: [{ image_id, image_url, sort_order }],
//              tags: [{ tag_id, keyword, sort_order }], created_at, updated_at }
export const getAdminLostItemDetail = (lostItemId) =>
  apiClient.get(`/api/lost-items/${lostItemId}/`)

// 등록/수정 공통 body — tags, image_urls 모두 배열 순서가 sort_order가 되므로 순서를 바꾸지 않는다
const toLostItemBody = ({ title, foundDate, tags, imageUrls }) => ({
  title,
  found_date: foundDate,
  tags,
  ...(imageUrls?.length ? { image_urls: imageUrls } : {}),
})

// 등록 — 필수값은 title / found_date / tags(1개 이상). 성공 201 → data: { lost_item_id }
export const createAdminLostItem = (payload) =>
  apiClient.post('/api/lost-items/', toLostItemBody(payload))

// 수정 — 등록과 동일 스키마. 이미지/태그는 replace-all이라 최종 배열을 그대로 보낸다
// (보내지 않은 항목은 지워지므로 부분 전송하면 안 됨). 성공 200 → data는 상세 조회와 같은 형태
export const updateAdminLostItem = (lostItemId, payload) =>
  apiClient.put(`/api/lost-items/${lostItemId}/`, toLostItemBody(payload))

// 삭제 — Soft Delete. 이미 삭제된 항목도 404로 온다
export const deleteAdminLostItem = (lostItemId) =>
  apiClient.delete(`/api/lost-items/${lostItemId}/`)
