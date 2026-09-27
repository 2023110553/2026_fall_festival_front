import { useMapContext } from '../../context/MapProvider'
import * as S from './BoothCardList.styles'
import lanternOn from '../../../../assets/map/lantern/lanternOn.svg'
import lanternOff from '../../../../assets/map/lantern/lanternOff.svg'
import helpingHand from '../../../../assets/map/Helping Hand.svg'
import { useTranslation } from '../../../../i18n/useTranslation'
import { isSimplePlace } from '../../../../constants/categories'
import { MAP_ZONES } from '../../../../constants/zones'

const RESTROOM_TYPE_BADGES = {
  BOTH: ['W', 'M'],
  FEMALE: ['W'],
  MALE: ['M'],
}

// 하단 부스/장소 카드 리스트
export default function BoothCardList({
  booths: providedBooths,
  onSelectBooth,
}) {
  const { t } = useTranslation()
  const { listTimeOfDay, zoneId } = useMapContext()
  const booths = Array.isArray(providedBooths) ? providedBooths : []
  const currentZoneLabel = MAP_ZONES.find((zone) => zone.id === zoneId)?.label

  if (booths.length === 0) {
    return (
      <S.StatusMessage $isNight={listTimeOfDay === 'night'}>
        {t('map.noBooths')}
      </S.StatusMessage>
    )
  }

  return (
    <S.BoothCardList>
      {booths.map((booth) => {
        const isRestroom = booth.category === 'TOILET'
        const simple = isSimplePlace(booth)

        const restroomBadges =
          RESTROOM_TYPE_BADGES[
            String(booth.restroom_type ?? '').toUpperCase()
          ] ?? []

        const directions = booth.directions

        const selectBooth = () => {
          onSelectBooth(booth.booth_id, booth)
        }

        const selectBoothWithKeyboard = (event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            selectBooth()
          }
        }

        if (isRestroom) {
          return (
            <S.RestroomCard
              key={booth.booth_id}
              role="button"
              tabIndex={0}
              onClick={selectBooth}
              onKeyDown={selectBoothWithKeyboard}
            >
              {booth.thumbnail_url ? (
                <S.Thumbnail
                  src={booth.thumbnail_url}
                  alt=""
                />
              ) : (
                <S.RestroomThumbnail aria-hidden="true">
                  WC
                </S.RestroomThumbnail>
              )}

              <S.RestroomName>{booth.name}</S.RestroomName>

              {restroomBadges.length > 0 && (
                <S.RestroomBadges aria-label={t('map.restroomType')}>
                  {restroomBadges.map((badge) => {
                    const badgeLabel =
                      badge === 'W'
                        ? t('map.restroomWomen')
                        : t('map.restroomMen')

                    return (
                      <S.RestroomBadge
                        key={badge}
                        $gender={badge}
                        aria-label={badgeLabel}
                        title={badgeLabel}
                      >
                        {badge}
                      </S.RestroomBadge>
                    )
                  })}
                </S.RestroomBadges>
              )}
            </S.RestroomCard>
          )
        }

        const hasMyLantern =
          booth.has_my_lantern ?? booth.hasMyLantern

        return (
          <S.Card
            key={booth.booth_id}
            role="button"
            tabIndex={0}
            onClick={selectBooth}
            onKeyDown={selectBoothWithKeyboard}
          >
            <S.Thumbnail
              src={booth.thumbnail_url}
              alt={booth.name}
            />

            <S.Info>
              <S.TitleRow>
                <S.Title>{booth.name}</S.Title>
                {booth.zone && booth.zone !== currentZoneLabel && (
                  <S.ZoneBadge>{booth.zone}</S.ZoneBadge>
                )}
              </S.TitleRow>

              <S.Department>
                {simple ? booth.location_detail : booth.subtitle}
              </S.Department>

              {simple ? (
                directions && (
                  <S.Directions>{directions}</S.Directions>
                )
              ) : (
                <S.Location>{booth.location_detail}</S.Location>
              )}
            </S.Info>

            {!simple && (
              <S.LanternWrapper>
                {booth.category === 'COLLAB' && (
                  <S.CollabBadge>
                    <img src={helpingHand} alt="" />
                    {t('map.collab')}
                  </S.CollabBadge>
                )}

                <S.LanternImg
                  src={hasMyLantern ? lanternOn : lanternOff}
                  alt={
                    hasMyLantern
                      ? t('map.lanternRegistered')
                      : t('map.lanternNotRegistered')
                  }
                />

                <S.LanternCount $hasMyLantern={hasMyLantern}>
                  {booth.lantern_count}
                </S.LanternCount>
              </S.LanternWrapper>
            )}
          </S.Card>
        )
      })}
    </S.BoothCardList>
  )
}
