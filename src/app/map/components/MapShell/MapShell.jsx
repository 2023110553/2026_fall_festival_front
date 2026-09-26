import { useMemo } from 'react'
import MapCanvas from '../../scene/MapCanvas'
import PinLabel from '../PinLabel/PinLabel'
import BottomSheet from '../BottomSheet/BottomSheet'
import { useMapContext } from '../../context/MapProvider'
import TopHeader from '../../../../components/common/TopHeader'
import FestivalDateTabs from '../../../../components/common/FestivalDateTabs'
import PlaceSelector from '../PlaceSelector/PlaceSelector'
import * as S from './MapShell.styles'
import { useTranslation } from '../../../../i18n/useTranslation'
import { DEFAULT_FESTIVAL_DATE } from '../../../../constants/festivalDates'

export default function MapShell() {
  const { t } = useTranslation()
  const {
    selectedDate, setSelectedDate, zoneId, setZoneId, timeOfDay,
    booths, selectedBoothId, setSelectedBoothId, setIsSheetOpen, setSheetTab, boothBrightnessPreview,
  } = useMapContext()

  const handleBoothClick = (boothId) => {
    setSelectedBoothId(boothId)
    setSheetTab('info')
    setIsSheetOpen(true)
  }

  // 2026-09-24: 고른 부스를 찾아 지도에 넘긴다 — MapCanvas가 그 부스 정면으로 카메라를 옮긴다.
  // 부스를 고르는 경로가 셋(3D 핀 클릭 / 바텀시트 목록·검색 / 홈 부스 랭킹의 ?booth=)인데
  // 전부 selectedBoothId를 바꾸므로, 그 하나만 보면 세 경로가 동시에 처리된다.
  //
  // 새 상태를 따로 만들지 않은 이유 — "어느 부스를 보고 있나"는 이미 selectedBoothId가 갖고 있다.
  // 같은 뜻의 상태를 하나 더 두면 둘이 어긋날 때 원인을 찾기 어려워진다.
  //
  // useMemo를 쓰는 건 성능 때문이 아니라 정확성 때문이다. MapCanvas가 리렌더될 때마다 새 객체를 주면
  // 카메라가 매번 "새 부스를 골랐다"고 오해해서 계속 다시 날아간다. 같은 부스면 같은 객체여야 한다.
  const focusBooth = useMemo(
    () => booths.find((booth) => booth.booth_id === selectedBoothId) ?? null,
    [booths, selectedBoothId],
  )

  return (
    <S.Shell>
      <S.HeaderArea>
      <TopHeader title={t('map.title')} appearance="light" zIndex={2} />
      <S.DateArea data-sheet-collapse-ignore>
        <FestivalDateTabs value={selectedDate ?? DEFAULT_FESTIVAL_DATE} onChange={setSelectedDate} />
      </S.DateArea>
      </S.HeaderArea>
      <S.MapArea>
        <MapCanvas
          zoneId={zoneId}
          timeOfDay={timeOfDay}
          boothBrightnessPreview={boothBrightnessPreview}
          focusBooth={focusBooth}
          onBoothClick={handleBoothClick}
        />
        <PinLabel />
        <PlaceSelector zoneId={zoneId} onSelectPlace={setZoneId} />
      </S.MapArea>
      <BottomSheet />
    </S.Shell>
  )
}
