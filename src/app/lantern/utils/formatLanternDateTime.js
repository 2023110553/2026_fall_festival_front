// ISO/Date 문자열(백엔드 DATETIME) -> "9/30 | 20:44" 형식으로 변환
export function formatLanternDateTime(dateTimeStr) {
  const date = new Date(dateTimeStr)
  if (Number.isNaN(date.getTime())) return dateTimeStr

  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${month}/${day} | ${hours}:${minutes}`
}
