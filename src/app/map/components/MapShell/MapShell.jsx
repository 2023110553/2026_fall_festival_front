import MapCanvas from '../../scene/MapCanvas'
import PinLabel from '../PinLabel/PinLabel'
import BottomSheet from '../BottomSheet/BottomSheet'
import { useMapContext } from '../../context/MapProvider'
import TopHeader from '../../../../components/common/TopHeader'
import FestivalDateTabs from '../../../../components/common/FestivalDateTabs'
import PlaceSelector from '../PlaceSelector/PlaceSelector'
import * as S from './MapShell.styles'

export default function MapShell() {
  const {
    selectedDate, setSelectedDate, zoneId, setZoneId, timeOfDay,
    setSelectedBoothId, setIsSheetOpen, setSheetTab, boothBrightnessPreview,
  } = useMapContext()

  const handleBoothClick = (boothId) => {
    setSelectedBoothId(boothId)
    setSheetTab('info')
    setIsSheetOpen(true)
  }

  return (
    <div>
      <TopHeader title="지도" appearance="light" />
      <S.DateArea data-sheet-collapse-ignore>
        <FestivalDateTabs value={selectedDate ?? '2026-09-29'} onChange={setSelectedDate} />
      </S.DateArea>
      <div style={{ position: 'relative', height: '55vh' }}>
        <MapCanvas
          zoneId={zoneId}
          timeOfDay={timeOfDay}
          boothBrightnessPreview={boothBrightnessPreview}
          onBoothClick={handleBoothClick}
        />
        <PinLabel />
      </div>
      <PlaceSelector zoneId={zoneId} onSelectPlace={setZoneId} />
      <BottomSheet />
    </div>
  )
}
