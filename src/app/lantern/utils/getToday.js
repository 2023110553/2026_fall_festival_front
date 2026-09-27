import { getLocalDateString } from './getLocalDateString'

const KST_OFFSET_MS = 9 * 60 * 60 * 1000

// 서버(가상 시계) 시각 - 기기 시각 차이 — 자정이 지나도 오늘 날짜가 따라 넘어가도록 날짜 대신 차이를 저장
let serverOffsetMs = null

// serverTime: 'YYYY-MM-DDTHH:MM:SS' (KST, 타임존 표기 없음)
export function setServerTime(serverTime) {
  if (typeof serverTime !== 'string') return
  const serverMs = Date.parse(`${serverTime.slice(0, 19)}+09:00`)
  if (Number.isNaN(serverMs)) return
  serverOffsetMs = serverMs - Date.now()
}

// 서버 기준 오늘(KST). 서버 시각을 받기 전엔 기기 날짜로 대체
export function getToday() {
  if (serverOffsetMs === null) return getLocalDateString()
  return new Date(Date.now() + serverOffsetMs + KST_OFFSET_MS).toISOString().slice(0, 10)
}

// 서버 가상 시계 동기화가 (이 세션에서) 한 번이라도 성공했는지 — 동기화 전엔 getToday()가
// 기기 날짜로 대체되므로, 그 값을 신뢰해도 되는 시점인지 판단하는 데 쓴다.
export function hasServerTime() {
  return serverOffsetMs !== null
}
