import InfoDetailHeader from './InfoDetailHeader'
import * as S from './CollabDetail.styles'

export default function CollabDetail({ collab, onBack }) {
  if (!collab) return null

  return (
    <S.Page>
      <InfoDetailHeader title="협업" onBack={onBack} />
      <S.Title>{collab.name}</S.Title>
      <S.Image src={collab.imageUrl} alt="" />
      <S.Label>Introduction</S.Label>
      <S.Description>{collab.introduction}</S.Description>
      {collab.snsUrl && (
        <S.Link href={collab.snsUrl} target="_blank" rel="noreferrer">
          {collab.snsHandle || 'SNS 바로가기'}
        </S.Link>
      )}
    </S.Page>
  )
}
