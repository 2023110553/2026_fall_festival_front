import * as S from './FestivalDateTabs.styles'

const FESTIVAL_DATES = [
  { value: '29', label: '29일' },
  { value: '30', label: '30일' },
  { value: '1', label: '1일' },
]

export default function FestivalDateTabs({ value, onChange }) {
  return (
    <S.TabList role="tablist" aria-label="축제 날짜 선택">
      {FESTIVAL_DATES.map((date) => {
        const isSelected = value === date.value

        return (
          <S.Tab
            key={date.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            $selected={isSelected}
            onClick={() => onChange(date.value)}
          >
            {date.label}
          </S.Tab>
        )
      })}
    </S.TabList>
  )
}
