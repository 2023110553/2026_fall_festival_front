import Tag from '../../../components/common/Tag'
import InfoDetailHeader from './InfoDetailHeader'
import OverflowMarquee from './OverflowMarquee'
import { formatNoticeDate } from '../utils/formatNoticeDate'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './NoticeDetail.styles'

export default function NoticeDetail({ notice, onBack }) {
  const { t } = useTranslation()
  if (!notice) return null

  return (
    <S.Page>
      <InfoDetailHeader title={t('info.notice')} onBack={onBack} />

      <S.TitleRow>
        <Tag tone={notice.type === 'URGENT' ? 'danger' : 'default'} size="detail">
          {notice.type === 'URGENT' ? t('notice.urgent') : t('notice.normal')}
        </Tag>
        <OverflowMarquee as="h3" variant="detail">
          {notice.title}
        </OverflowMarquee>
      </S.TitleRow>

      <S.Article>
        {notice.image_url && <S.Image src={notice.image_url} alt="" />}
        <S.Content>
          <time dateTime={notice.created_at}>
            {formatNoticeDate(notice.created_at)}
          </time>{' '}
          {notice.content}
        </S.Content>
      </S.Article>
    </S.Page>
  )
}
