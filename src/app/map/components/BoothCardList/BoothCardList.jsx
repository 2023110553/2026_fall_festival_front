import { useMapContext } from '../../context/MapProvider'
import { useBoothSearch } from '../../hooks/useMapZones'
import * as S from './BoothCardList.styles'
import lanternOn from '../../../../assets/map/lantern/lanternOn.svg'
import lanternOff from '../../../../assets/map/lantern/lanternOff.svg'
import mockDetails from '../../mocks/boothDetailResponses.json'
import helpingHand from '../../../../assets/map/Helping Hand.svg'
// 하단 부스/장소 카드 리스트 — 썸네일/이름/소속/등불개수. 카테고리 필터·주야간 전환에 따라 갱신된다.
export default function BoothCardList({ booths: providedBooths, onSelectBooth, filterBySearchTerm = true }) {
  const { searchTerm } = useMapContext()
  const filtered = useBoothSearch(providedBooths, filterBySearchTerm ? searchTerm : '')

  if (filtered.length === 0) return <p>표시할 부스가 없어요.</p>

  return (
    // <ul>
    //   {filtered.map((booth) => (
    //     <li key={booth.id} onClick={() => onSelectBooth(booth.id)}>
    //       {booth.name} · 등불 {booth.lanternCount ?? 0}
    //     </li>
    //   ))}
    // </ul>
  <S.BoothCardList>
    {filtered.map((booth) => {
      const simple = booth.place_type === 'FACILITY' || ['TOILET', 'ALCOHOL'].includes(booth.category)
      // 목록 API에는 directions가 없으므로 목 화면에서는 상세 응답으로 보완한다.
      const directions = booth.directions ?? mockDetails.find((item) => item.data.booth_id === booth.booth_id)?.data.directions
      return (
      <S.Card key={booth.booth_id} role="button" tabIndex={0}
        onClick={() => onSelectBooth(booth.booth_id)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            onSelectBooth(booth.booth_id)
          }
        }}
      >
        <S.Thumbnail src={booth.thumbnail_url} alt={booth.name} />

        <S.Info>
          <S.Title>{booth.name}</S.Title>
          <S.Department>{simple ? booth.location_detail : booth.subtitle}</S.Department>
          {simple ? (
            directions && <S.Directions>{directions}</S.Directions>
          ) : <S.Location>{booth.location_detail}</S.Location>}
        </S.Info>
        
        {!simple && <S.LanternWrapper>
          {booth.category === 'COLLAB' && (
            <S.CollabBadge>
              <img src={helpingHand} alt="" />
              협업
            </S.CollabBadge>
          )}
          <S.LanternImg
            src={(booth.has_my_lantern ?? booth.hasMyLantern) ? lanternOn : lanternOff}
            alt={(booth.has_my_lantern ?? booth.hasMyLantern) ? '등불 등록 완료' : '등불 미등록'}
          />
          <S.LanternCount $hasMyLantern={(booth.has_my_lantern ?? booth.hasMyLantern)}>{booth.lantern_count}</S.LanternCount>
        </S.LanternWrapper>}
      </S.Card>
      )
    })}
  </S.BoothCardList>
  
  )
}
