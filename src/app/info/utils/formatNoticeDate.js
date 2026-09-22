// 공지 목록/상세의 created_at → "09.29" 형식.
// 백엔드 사용자 공지 API(GET /api/notices/, /api/notices/{id}/)는 created_at을 UTC ISO 문자열("...T15:30:00Z")로
// 내려주므로 문자열을 잘라 쓰면 KST 자정~09시 사이 게시물의 날짜가 하루 앞으로 밀린다.
// Date로 파싱한 뒤 항상 Asia/Seoul 기준으로 표시한다(해외 이용자 브라우저 시간대와 무관하게 축제 현지 날짜).
export function formatNoticeDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value.slice(5, 10).replace('-', '.') : ''
  }
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const month = parts.find((part) => part.type === 'month')?.value ?? ''
  const day = parts.find((part) => part.type === 'day')?.value ?? ''
  return `${month}.${day}`
}
