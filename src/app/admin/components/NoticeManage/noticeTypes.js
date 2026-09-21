export const NOTICE_TYPE_LABEL = {
  URGENT: '긴급 공지',
  NORMAL: '일반 공지',
}

// 서버·화면 모두 긴급 공지를 URGENT로 쓴다
export const isUrgentNotice = (type) => type === 'URGENT'
export const getNoticeTypeLabel = (type) => NOTICE_TYPE_LABEL[isUrgentNotice(type) ? 'URGENT' : 'NORMAL']
