import { useAnalyticsView } from '../../../analytics/useAnalyticsView'
import Tag from '../../../components/common/Tag'
import InfoDetailHeader from './InfoDetailHeader'
import { formatNoticeDate } from '../utils/formatNoticeDate'
import { parseTextWithUrls } from '../utils/parseTextWithUrls'
import { useTranslation } from '../../../i18n/useTranslation'
import * as S from './NoticeDetail.styles'

export default function NoticeDetail({ notice, onBack }) {
  const { t } = useTranslation()
  useAnalyticsView('notice_opened', Boolean(notice), notice?.notice_id, { notice_id: notice?.notice_id, notice_type: notice?.type?.toLowerCase(), page_name: 'notice' })
  if (!notice) return null

  return (
    <S.Page>
      <InfoDetailHeader title={t('info.notice')} onBack={onBack} />

      <S.TitleRow>
        <Tag tone={notice.type === 'URGENT' ? 'danger' : 'default'} size="detail">
          {notice.type === 'URGENT' ? t('notice.urgent') : t('notice.normal')}
        </Tag>
        <S.Title>{notice.title}</S.Title>
      </S.TitleRow>

      <S.Article>
        {notice.image_url && <S.Image src={notice.image_url} alt="" />}
        <S.Content>
          <time dateTime={notice.created_at}>
            {formatNoticeDate(notice.created_at)}
          </time>{' '}
          {parseTextWithUrls(notice.content).map((segment, index) =>
            segment.type === 'url' ? (
              <S.ContentLink
                key={`${segment.value}-${index}`}
                href={segment.value}
                target="_blank"
                rel="noopener noreferrer"
              >
                {segment.value}
              </S.ContentLink>
            ) : (
              segment.value
            ),
          )}
        </S.Content>
      </S.Article>
    </S.Page>
  )
}
