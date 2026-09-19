import { getLocalDateString } from './getLocalDateString'

const DEV_DATE_OVERRIDE_KEY = 'dev_mock_today'

// 오늘 날짜 — DEV 환경에서 localStorage에 임시로 지정해둔 날짜가 있으면 그걸 대신 반환한다.
// 축제 시작 전/종료 후에도 지난 날짜 화면(수정 제한 등)을 눈으로 확인해볼 수 있게 하는 개발용 오버라이드.
// 프로덕션 빌드에서는 import.meta.env.DEV가 false라 항상 실제 오늘 날짜만 사용한다.
export function getToday() {
  if (import.meta.env.DEV) {
    const override = localStorage.getItem(DEV_DATE_OVERRIDE_KEY)
    if (override) return override
  }
  return getLocalDateString()
}

// dateStr을 넘기면 그 날짜로, null/undefined를 넘기면 오버라이드 해제(실제 날짜로 복귀)
export function setMockToday(dateStr) {
  if (dateStr) {
    localStorage.setItem(DEV_DATE_OVERRIDE_KEY, dateStr)
  } else {
    localStorage.removeItem(DEV_DATE_OVERRIDE_KEY)
  }
}
