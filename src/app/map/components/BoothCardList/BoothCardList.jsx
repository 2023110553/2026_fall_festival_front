import { useMapContext } from '../../context/MapProvider'
import { useBoothSearch } from '../../hooks/useMapZones'
import * as S from './BoothCardList.styles'
import lanternOn from '../../../../assets/map/lantern/lanternOn.svg'
import lanternOff from '../../../../assets/map/lantern/lanternOff.svg'
// 하단 부스/장소 카드 리스트 — 썸네일/이름/소속/등불개수. 카테고리 필터·주야간 전환에 따라 갱신된다.
export default function BoothCardList({ booths: providedBooths, onSelectBooth }) {
  const { searchTerm } = useMapContext()
  const filtered = useBoothSearch(providedBooths, searchTerm)

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
    {filtered.map((booth) => (
      <S.Card key={booth.booth_id} onClick={() => onSelectBooth(booth.booth_id)}>
        <S.Thumbnail src={booth.thumbnail_url} alt={booth.name} />

        <S.Info>
          <S.Title>{booth.name}</S.Title>
          <S.Department>{booth.subtitle}</S.Department>
          <S.Location>{booth.location_detail}</S.Location>
        </S.Info>
        
        <S.LanternWrapper>
          <S.LanternImg
            src={booth.hasMyLantern ? lanternOn : lanternOff}
            alt={booth.hasMyLantern ? '등불 등록 완료' : '등불 미등록'}
          />
          <S.LanternCount $hasMyLantern={booth.hasMyLantern}>{booth.lantern_count}</S.LanternCount>
        </S.LanternWrapper>
      </S.Card>
    ))}
  </S.BoothCardList>
  
  )
}
