import { uploadAdminNoticeImage } from '../../../../api/admin'

// 명세상 공지 이미지는 최대 10MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024
export const IMAGE_SIZE_MESSAGE = '파일 크기는 10MB를 초과할 수 없습니다.'

// 업로드 전에 걸러서 큰 파일을 보내느라 기다리지 않게 한다 (서버도 413으로 막음)
export const isImageTooLarge = (file) => Boolean(file) && file.size > MAX_IMAGE_SIZE

// 사진은 저장 시점에 업로드해서 URL을 받는다 — 고르기만 하고 나가면 업로드되지 않는다
export const uploadNoticeImage = async (file) => {
  const res = await uploadAdminNoticeImage(file)
  return res.data?.data?.image_url ?? null
}

// 서버 400은 errors에 필드별 메시지가 오므로 있으면 그걸, 없으면 message를 보여준다
export const toNoticeErrorMessage = (error, fallback) => {
  const data = error.response?.data
  const fieldMessages = Object.values(data?.errors ?? {}).filter(Boolean)
  if (fieldMessages.length) return fieldMessages.join(' ')
  // 413은 서버 앞단(프록시)에서 JSON 없이 끊길 수도 있어 문구를 직접 채운다
  if (error.response?.status === 413) return data?.message ?? IMAGE_SIZE_MESSAGE
  return data?.message ?? fallback
}
