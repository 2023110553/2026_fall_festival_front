// Date -> 'YYYY-MM-DD' (로컬 타임존 기준). toISOString().slice(0,10)은 UTC 기준이라
// KST 새벽 시간대(UTC로는 아직 전날)에 실제 날짜와 다른 값이 나오는 문제가 있어 로컬 기준으로 직접 계산한다.
export function getLocalDateString(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
