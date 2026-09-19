const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토']

// '2026-09-29' -> '9/29(화)'
export function formatDayLabel(dateStr) {
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}/${date.getDate()}(${WEEKDAY_KO[date.getDay()]})`
}
