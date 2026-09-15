import InfoDetailHeader from './InfoDetailHeader'
import * as S from './LostFoundDetail.styles'

export default function LostFoundDetail({ item, onBack }) {
  if (!item) return null

  return (
    <S.Page>
      <InfoDetailHeader title="분실물" onBack={onBack} />

      <S.TitleRow>
        <S.DateBadge>{item.date}</S.DateBadge>
        <S.Title>{item.title}</S.Title>
      </S.TitleRow>

      {item.imageUrl && <S.Image src={item.imageUrl} alt={item.title} />}

      <S.Tags>
        {item.hashtags?.map((hashtag) => (
          <span key={hashtag}>{hashtag}</span>
        ))}
      </S.Tags>

      {item.instagramUrl && (
        <S.Link href={item.instagramUrl} target="_blank" rel="noreferrer">
          분실물 찾으러 가기
        </S.Link>
      )}
    </S.Page>
  )
}
