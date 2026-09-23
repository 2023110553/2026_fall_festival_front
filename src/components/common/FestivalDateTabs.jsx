import SegmentedTabs from './SegmentedTabs'
import { useTranslation } from '../../i18n/useTranslation'

// TEMP: 로컬 테스트용으로 value만 오늘 기준 3일로 변경 (원래 9/29~10/1) — labelKey 텍스트는 그대로라 탭 표기(9/29 등)와 실제 값(9/23 등)이 다르게 보임
const FESTIVAL_DATES=[
  {value:'2026-09-23',labelKey:'festival.day29'},
  {value:'2026-09-24',labelKey:'festival.day30'},
  {value:'2026-09-25',labelKey:'festival.day1'},
]

export default function FestivalDateTabs({value,onChange}){
  const { t } = useTranslation()
  const items = FESTIVAL_DATES.map((item) => ({ ...item, label: t(item.labelKey) }))
  return <SegmentedTabs items={items} value={value} onChange={onChange} ariaLabel={t('festival.selectDate')} selectedWidth="120px" />
}
