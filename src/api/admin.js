import { apiClient } from './client'

// 관리자 로그인 — 성공 시 받은 토큰을 useAdminAuthStore에 저장해서 AdminRoute 가드가 사용
export const adminLogin = (adminKey) => apiClient.post('/api/admin/login', { adminKey })

// 등불 관리
export const getAdminLanterns = (sort = 'report') => apiClient.get('/api/admin/lanterns', { params: { sort } })
export const deleteAdminLantern = (lanternId) => apiClient.delete(`/api/admin/lanterns/${lanternId}`)

// 공지 관리
// 목록 조회 — type: ALL(기본) / EMERGENCY / NORMAL, page는 0부터, size는 최대 100 (기본 20)
// 응답 data: { total_count, page, size, has_next, items: [{ notice_id, type, title, content_preview, image_url, created_at }] }
// 정렬은 서버가 처리(긴급 우선 → 일반 최신순), 긴급 공지 제목엔 [M/D]가 붙어서 온다. 이미지 없으면 image_url: null
export const getAdminNotices = ({ type = 'ALL', page = 0, size = 20 } = {}) =>
  apiClient.get('/api/notices/', { params: { type, page, size } })
// 상세 조회 — 수정 화면 초기값 바인딩에도 사용. 없거나 삭제된 공지는 404(NOTICE_NOT_FOUND)
// 응답 data: { notice_id, type, title, content, image_url, created_at, updated_at }
export const getAdminNoticeDetail = (noticeId) =>
  apiClient.get(`/api/notices/${noticeId}/`)
// 등록 — multipart/form-data. type(EMERGENCY/NORMAL)·title·content 필수, image는 선택
// 긴급 공지 제목의 [M/D]는 서버가 붙이므로 제목만 보낸다
export const createAdminNotice = ({ type, title, content, imageFile }) => {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('title', title)
  formData.append('content', content)
  if (imageFile) formData.append('image', imageFile)
  // Content-Type은 axios가 boundary까지 붙여서 자동 설정하므로 직접 지정하지 않는다
  return apiClient.post('/api/notices/', formData)
}
// 수정 — multipart/form-data. type(EMERGENCY/NORMAL)·title·content는 필수라 바뀌지 않아도 매번 보낸다
// image는 새 사진으로 교체할 때만, delete_image는 기존 사진을 지울 때만 true (기본 false → 기존 사진 유지)
// 성공 200 → { type, title, content, image_url }
export const updateAdminNotice = (noticeId, { type, title, content, imageFile, deleteImage = false }) => {
  const formData = new FormData()
  formData.append('type', type)
  formData.append('title', title)
  formData.append('content', content)
  if (imageFile) formData.append('image', imageFile)
  formData.append('delete_image', String(deleteImage))
  // Content-Type은 axios가 boundary까지 붙여서 자동 설정하므로 직접 지정하지 않는다
  return apiClient.put(`/api/notices/${noticeId}/`, formData)
}
// 삭제 — Soft Delete(deleted_at 갱신). 사용자 공지 목록·홈 롤링 바에서도 즉시 빠진다
// 성공 200 → data: { notice_id, deleted_at }
export const deleteAdminNotice = (noticeId) => apiClient.delete(`/api/notices/${noticeId}/`)

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

// 이미지 업로드 — multipart(field name: file), jpg/jpeg/png/webp · 5MB 이하
// 성공 201 → data: { image_url }. 이 URL을 등록/수정의 image_urls에 담아 보낸다
// (업로드만 하고 저장하지 않으면 고아 파일이 남는 구조 — 서버에서 일괄 정리)
export const uploadAdminLostItemImage = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  // Content-Type은 axios가 boundary까지 붙여서 자동 설정하므로 직접 지정하지 않는다
  return apiClient.post('/api/lost-items/images/', formData)
}

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
