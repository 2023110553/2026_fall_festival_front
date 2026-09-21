import { useState } from 'react'
import * as S from './PlaceSelector.styles'
import { MAP_ZONES } from '../../../../constants/zones'
import { useTranslation } from '../../../../i18n/useTranslation'

export default function PlaceSelector({ zoneId, onSelectPlace }) {
    const { t } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)
    const selectedPlace = t(`map.zone.${zoneId}`)

    return (
        <S.Wrapper>
        {isOpen && (
            <S.Menu>
            {/* 2026-09-19: zone3(만해광장) 씬이 연결되면서 하드코딩(disabled={id === 'zone3'}) 제거.
                준비 중인 구역은 zones.js에서 comingSoon: true로 표시하면 여기서 자동으로 비활성화된다. */}
            {MAP_ZONES.filter((place) => place.id !== zoneId).map((place) => (
                <S.PlaceButton
                key={place.id}
                type="button"
                disabled={Boolean(place.comingSoon)}
                title={place.comingSoon ? t('map.comingSoon') : t(`map.zone.${place.id}`)}
                onClick={() => {
                    setIsOpen(false)
                    onSelectPlace(place.id)
                }}
                >
                {t(`map.zone.${place.id}`)}
                </S.PlaceButton>
            ))}
            </S.Menu>
        )}

        <S.Toggle
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((previous) => !previous)}
        >
            {selectedPlace}
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.51604 5.55271C3.59807 5.47078 3.70927 5.42476 3.8252 5.42476C3.94114 5.42476 4.05234 5.47078 4.13437 5.55271L6.15854 7.57688L8.1827 5.55271C8.26564 5.47543 8.37533 5.43336 8.48867 5.43536C8.60202 5.43736 8.71016 5.48327 8.79032 5.56343C8.87047 5.64359 8.91639 5.75173 8.91839 5.86507C8.92039 5.97841 8.87832 6.08811 8.80104 6.17104L6.4677 8.50438C6.38567 8.58631 6.27447 8.63232 6.15854 8.63232C6.0426 8.63232 5.9314 8.58631 5.84937 8.50438L3.51604 6.17104C3.43411 6.08901 3.38809 5.97781 3.38809 5.86188C3.38809 5.74594 3.43411 5.63474 3.51604 5.55271Z" fill="#737373"/>
            </svg>
        </S.Toggle>
        </S.Wrapper>
    )
}
