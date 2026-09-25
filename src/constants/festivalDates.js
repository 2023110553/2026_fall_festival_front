// 축제 기간(3일) — 프론트 전체에서 날짜는 이 파일 하나만 보고 쓴다.
// 백엔드 config/settings/base.py의 FESTIVAL_START_DATE ~ FESTIVAL_END_DATE(2026-09-29 ~ 2026-10-01)와
// 반드시 같아야 한다. 다르면 date 파라미터를 받는 API(공연·부스·분실물 등)가
// 400 INVALID_FESTIVAL_DATE("축제 기간 내의 날짜가 아닙니다.")로 거절한다.
// 테스트 때문에 날짜를 바꿔야 하면 이 파일만 고치고, 다른 파일에 날짜 문자열을 직접 쓰지 않는다.
export const FESTIVAL_DATES = ['2026-09-29', '2026-09-30', '2026-10-01']

// 날짜를 아직 고르지 않았을 때 쓰는 기본값(축제 1일차)
export const DEFAULT_FESTIVAL_DATE = FESTIVAL_DATES[0]

// '2026-09-29' -> '9/29' (날짜 필터 칩·태그처럼 짧게 보여줄 때)
export const toShortDateLabel = (value) => {
    if (!value) return ''
    const [, month, day] = value.split('-')
    return month && day ? `${Number(month)}/${Number(day)}` : value
}

// 칩/탭 목록을 그릴 때 쓰는 { value, label } 형태
export const FESTIVAL_DATE_OPTIONS = FESTIVAL_DATES.map((value) => ({
    value,
    label: toShortDateLabel(value),
}))
