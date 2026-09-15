import * as S from './SegmentedTabs.styles'

export default function SegmentedTabs({ items, value, onChange, ariaLabel = '탭 선택', selectedWidth }) {
  return <S.TabList role="tablist" aria-label={ariaLabel}>
    {items.map((item) => {
      const selected = value === item.value
      return <S.Tab key={item.value} type="button" role="tab" aria-selected={selected} $selected={selected} $selectedWidth={selectedWidth} onClick={() => onChange(item.value)}>{item.label}</S.Tab>
    })}
  </S.TabList>
}
