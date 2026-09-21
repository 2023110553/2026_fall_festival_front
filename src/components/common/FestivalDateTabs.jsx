import SegmentedTabs from './SegmentedTabs'
import { useTranslation } from '../../i18n/useTranslation'

const FESTIVAL_DATES=[
  {value:'2026-09-29',labelKey:'festival.day29'},
  {value:'2026-09-30',labelKey:'festival.day30'},
  {value:'2026-10-01',labelKey:'festival.day1'},
]

export default function FestivalDateTabs({value,onChange}){
  const { t } = useTranslation()
  const items = FESTIVAL_DATES.map((item) => ({ ...item, label: t(item.labelKey) }))
  return <SegmentedTabs items={items} value={value} onChange={onChange} ariaLabel={t('festival.selectDate')} selectedWidth="120px" />
}
