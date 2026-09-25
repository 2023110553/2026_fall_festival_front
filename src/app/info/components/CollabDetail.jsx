import InfoDetailHeader from './InfoDetailHeader'
import instagramIcon from '../../../assets/info/instagram-icon.png'
import * as S from './CollabDetail.styles'

export default function CollabDetail({ collab, onBack, headerTitle = '협업' }) {
  if (!collab) return null

  return (
    <S.Page>
      <InfoDetailHeader title={headerTitle} onBack={onBack} compact />
      <S.Title>{collab.name}</S.Title>
      <S.Card>
        <S.Image
          src={collab.imageUrl || undefined}
          alt={`${collab.name} 소개 이미지`}
          $fit={collab.imageFit}
        />
        <S.Copy>
          <S.Label>Introduction</S.Label>
          <S.Description>{collab.description}</S.Description>
        </S.Copy>
        {collab.snsUrl && (
          <S.Sns>
            <S.Label>SNS</S.Label>
            <S.Link href={collab.snsUrl} target="_blank" rel="noreferrer">
              <S.InstagramIcon src={instagramIcon} alt="" aria-hidden="true" />
              {collab.snsHandle || 'SNS 바로가기'}
            </S.Link>
          </S.Sns>
        )}
      </S.Card>
    </S.Page>
  )
}
