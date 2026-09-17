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
            {MAP_ZONES.filter((place) => place.id !== zoneId).map((place) => (
                <S.PlaceButton
                key={place.id}
                type="button"
                disabled={place.id === 'zone3'}
                title={place.id === 'zone3' ? '지도 준비 중' : place.label}
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
