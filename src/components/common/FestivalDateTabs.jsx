import SegmentedTabs from './SegmentedTabs'

const FESTIVAL_DATES=[
  {value:'2026-09-29',label:'29일'},
  {value:'2026-09-30',label:'30일'},
  {value:'2026-10-01',label:'1일'},
]

export default function FestivalDateTabs({value,onChange}){
  return <SegmentedTabs items={FESTIVAL_DATES} value={value} onChange={onChange} ariaLabel="축제 날짜 선택" selectedWidth="120px" />
}
