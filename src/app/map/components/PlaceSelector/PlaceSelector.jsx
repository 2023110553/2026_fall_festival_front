import { useState } from 'react'
import * as S from './PlaceSelector.styles'
import { MAP_ZONES } from '../../../../constants/zones'

export default function PlaceSelector({ zoneId, onSelectPlace }) {
    const [isOpen, setIsOpen] = useState(false)
    const selectedPlace = MAP_ZONES.find((zone) => zone.id === zoneId)?.label

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
                title={place.comingSoon ? '지도 준비 중' : place.label}
                onClick={() => {
                    setIsOpen(false)
                    onSelectPlace(place.id)
                }}
                >
                {place.label}
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
            {/* 화살표 아이콘 */}
        </S.Toggle>
        </S.Wrapper>
    )
}
