import InfoDetailHeader from './InfoDetailHeader'
import * as S from './LostFoundDetail.styles'

const LOST_FOUND_INSTAGRAM_URL = 'https://www.instagram.com/donggukfesta/'

export default function LostFoundDetail({ item, onBack }) {
  if (!item) return null

  return (
    <S.Page>
      <InfoDetailHeader title="분실물" onBack={onBack} />

      <S.TitleRow>
        <S.DateBadge>
          {item.found_date.slice(5).replace(/^0/, '').replace('-', '/')}
        </S.DateBadge>
        <S.Title>{item.title}</S.Title>
      </S.TitleRow>

      {item.image_urls?.length > 0 && (
        <S.ImageGallery aria-label={`${item.title} 이미지`}>
          {item.image_urls.map((imageUrl, index) => (
            <S.Image
              key={imageUrl}
              src={imageUrl}
              alt={`${item.title} ${index + 1}번째 이미지`}
            />
          ))}
        </S.ImageGallery>
      )}

      <S.Tags>
        {item.tags?.map((tag) => (
          <span key={tag}>#{tag}</span>
        ))}
      </S.Tags>

      <S.Link
        href={LOST_FOUND_INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
      >
        분실물 찾으러 가기
      </S.Link>
    </S.Page>
  )
}
