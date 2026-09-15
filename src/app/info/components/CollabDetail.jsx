import * as S from './CollabDetail.styles'

export default function CollabDetail({ collab, onBack }) {
  if (!collab) return null
  return <S.Page>
    <S.Back type="button" onClick={onBack}>← 목록으로</S.Back>
    <S.Image src={collab.imageUrl} alt="" />
    <S.Title>{collab.name}</S.Title>
    <S.Label>Introduction</S.Label>
    <S.Description>{collab.introduction}</S.Description>
    {collab.snsUrl && <S.Link href={collab.snsUrl}>{collab.snsHandle || 'SNS 바로가기'}</S.Link>}
  </S.Page>
}
