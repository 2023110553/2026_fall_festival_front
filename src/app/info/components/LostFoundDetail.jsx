import * as S from './LostFoundDetail.styles'

export default function LostFoundDetail({ item, onBack }) {
  if (!item) return null
  return <S.Page>
    <S.Back type="button" onClick={onBack}>← 목록으로</S.Back>
    {item.imageUrl && <S.Image src={item.imageUrl} alt={item.title} />}
    <S.Date>{item.date}</S.Date>
    <S.Title>{item.title}</S.Title>
    <S.Tags>{item.hashtags?.join(' ')}</S.Tags>
    {item.instagramUrl && <S.Link href={item.instagramUrl}>분실물 찾으러 가기</S.Link>}
  </S.Page>
}
