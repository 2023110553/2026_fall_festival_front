import InfoDetailHeader from './InfoDetailHeader'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './LostFoundDetail.styles'

const LOST_FOUND_INSTAGRAM_URL = 'https://www.instagram.com/donggukfesta/'

export default function LostFoundDetail({ item, onBack }) {
  const { t } = useTranslation()
  if (!item) return null

  return (
    <S.Page>
      <InfoDetailHeader title={t('info.lostFound')} onBack={onBack} />

      <S.TitleRow>
        <S.DateBadge>
          {item.found_date.slice(5).replace(/^0/, '').replace('-', '/')}
        </S.DateBadge>
        <S.Title>{item.title}</S.Title>
      </S.TitleRow>

      {item.image_urls?.length > 0 && (
        <S.ImageGallery aria-label={t('lostFound.imagesLabel', { title: item.title })}>
          {item.image_urls.map((imageUrl, index) => (
            <S.Image
              key={imageUrl}
              src={imageUrl}
              alt={t('lostFound.imageAlt', { title: item.title, index: index + 1 })}
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
        {t('lostFound.findLink')}
      </S.Link>
    </S.Page>
  )
}
