import MapCanvas from '../../scene/MapCanvas'
import PinLabel from '../PinLabel/PinLabel'
import BottomSheet from '../BottomSheet/BottomSheet'
import { useMapContext } from '../../context/MapProvider'
import TopHeader from '../../../../components/common/TopHeader'
import FestivalDateTabs from '../../../../components/common/FestivalDateTabs'
import PlaceSelector from '../PlaceSelector/PlaceSelector'
import * as S from './MapShell.styles'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function MapShell() {
  const { t } = useTranslation()
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
    <S.Shell>
      <S.HeaderArea>
      <TopHeader title={t('map.title')} appearance="light" zIndex={2} />
      <S.DateArea data-sheet-collapse-ignore>
        <FestivalDateTabs value={selectedDate ?? '2026-09-29'} onChange={setSelectedDate} />
      </S.DateArea>
      </S.HeaderArea>
      <S.MapArea>
        <MapCanvas
          zoneId={zoneId}
          timeOfDay={timeOfDay}
          boothBrightnessPreview={boothBrightnessPreview}
          onBoothClick={handleBoothClick}
        />
        <PinLabel />
        <PlaceSelector zoneId={zoneId} onSelectPlace={setZoneId} />
      </S.MapArea>
      <BottomSheet />
    </S.Shell>
  )
}
