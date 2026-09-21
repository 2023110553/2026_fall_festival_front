export const NOTICE_TYPE_LABEL = {
  URGENT: '긴급 공지',
  NORMAL: '일반 공지',
}

// 서버는 긴급 공지를 EMERGENCY로 내려주고, 화면 쪽 라벨/등록 흐름은 URGENT 키를 쓴다
export const isUrgentNotice = (type) => type === 'EMERGENCY' || type === 'URGENT'
export const getNoticeTypeLabel = (type) => NOTICE_TYPE_LABEL[isUrgentNotice(type) ? 'URGENT' : 'NORMAL']
