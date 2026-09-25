import SegmentedTabs from './SegmentedTabs'
import { useTranslation } from '../../i18n/useTranslation'
import { FESTIVAL_DATES } from '../../constants/festivalDates'

// 탭 라벨(29일/30일/1일)은 i18n 키로, 실제 값(ISO 날짜)은 constants/festivalDates.js에서 가져온다.
// 날짜 값을 여기에 직접 쓰면 페이지 쪽 날짜 목록과 어긋나서 탭을 눌러도 다른 날짜가 요청된다(2026-09-24 버그).
const LABEL_KEYS = ['festival.day29', 'festival.day30', 'festival.day1']

export default function FestivalDateTabs({ value, onChange }) {
  const { t } = useTranslation()
  const items = FESTIVAL_DATES.map((date, index) => ({
    value: date,
    label: t(LABEL_KEYS[index]),
  }))

  return (
    <SegmentedTabs
      items={items}
      value={value}
      onChange={onChange}
      ariaLabel={t('festival.selectDate')}
      selectedWidth="120px"
    />
  )
}
