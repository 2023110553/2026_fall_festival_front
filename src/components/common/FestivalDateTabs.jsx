import SegmentedTabs from './SegmentedTabs'

const FESTIVAL_DATES=[
  {value:'29',label:'29일'},
  {value:'30',label:'30일'},
  {value:'1',label:'1일'},
]

export default function FestivalDateTabs({value,onChange}){
  return <SegmentedTabs items={FESTIVAL_DATES} value={value} onChange={onChange} ariaLabel="축제 날짜 선택" selectedWidth="120px" />
}
