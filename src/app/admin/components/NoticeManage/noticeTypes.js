export const NOTICE_TYPE_LABEL = {
  URGENT: '긴급 공지',
  NORMAL: '일반 공지',
}

// 서버·화면 모두 긴급 공지를 URGENT로 쓴다
export const isUrgentNotice = (type) => type === 'URGENT'
export const getNoticeTypeLabel = (type) => NOTICE_TYPE_LABEL[isUrgentNotice(type) ? 'URGENT' : 'NORMAL']

// 공지 목록 표시용 등록일 — 긴급 공지 제목 앞 "[9/30]", 미리보기 앞 "2026년 9월 30일"
export const formatNoticeShortDate = (createdAt) => {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''
  return `[${date.getMonth() + 1}/${date.getDate()}]`
}

export const formatNoticeLongDate = (createdAt) => {
  const date = new Date(createdAt)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`
}
